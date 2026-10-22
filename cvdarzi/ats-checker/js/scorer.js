/* CV Darzi rule-based scorer.
   Deterministic: the same CV, job description, market and date always give the same result.
   Runs fully on the device; nothing here calls the network. */

import { SKILLS, AMBIGUOUS, STOPWORDS, IMPLIED_BY } from './skills.js';
import { MARKETS } from './markets.js';
import { familyOfTitle, skillFitsJob } from './qbank.js';

export const ENGINE_VERSION = 1;
const W = { skills: 0.55, experience: 0.2, ats: 0.25 };

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11 };
const WEAK = [
  { re: /^(was\s+)?responsible\s+for\s+/i, label: 'Responsible for' },
  { re: /^worked\s+on\s+/i, label: 'Worked on' },
  { re: /^(helped|assisted)\s+(with\s+|in\s+)?/i, label: 'Helped with' },
  { re: /^involved\s+in\s+/i, label: 'Involved in' },
  { re: /^duties\s+included\s+/i, label: 'Duties included' },
  { re: /^handled\s+/i, label: 'Handled' },
  { re: /^participated\s+in\s+/i, label: 'Participated in' },
];
const IRREGULAR = { lead: 'Led', build: 'Built', runn: 'Ran', writ: 'Wrote', mak: 'Made', sett: 'Set', drive: 'Drove', driv: 'Drove', teach: 'Taught', sell: 'Sold', buy: 'Bought', hold: 'Held', win: 'Won', winn: 'Won', mee: 'Met', meet: 'Met', giv: 'Gave', tak: 'Took', bring: 'Brought', think: 'Thought', grow: 'Grew', ris: 'Rose', choos: 'Chose', speak: 'Spoke', send: 'Sent', spend: 'Spent', mentor: 'Mentored' };
const NUMBER_WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

const SECTION_HEADS = [
  ['experience', /^((work|professional|relevant|teaching|industry|clinical|employment|job|career|sales|nursing|research)\s+)?(experience|employment(\s+history)?|work\s+history|career\s+history|internships?(\s+experience)?|experience\s+summary)\s*:?$/i],
  ['education', /^(education(al)?(\s+(background|qualifications?|details))?|education\s*(&|and)\s*(qualifications?|certifications?|training)|academic(s|\s+background|\s+qualifications?|\s+details)?|qualifications?)\s*:?$/i],
  ['skills', /^((technical|key|core|professional)\s+)?(skills|competencies|skill\s*set|technologies|tools(\s+and\s+technologies)?|expertise)\s*:?$/i],
  ['projects', /^(academic\s+|key\s+|personal\s+)?projects\s*:?$/i],
  ['summary', /^(professional\s+|career\s+)?(summary|profile|objective|about(\s+me)?)\s*:?$/i],
  ['certifications', /^(certifications?|licen[cs]es?(\s+and\s+certifications?)?|courses)\s*:?$/i],
  ['achievements', /^(achievements|awards|accomplishments|honou?rs)\s*:?$/i],
  ['activities', /^((extra[\s-]?curricular|co[\s-]?curricular)\s+)?activities|volunteer(ing)?(\s+(work|experience))?|positions?\s+of\s+responsibility|leadership\s+(roles|experience)\s*:?$/i],
];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const termRe = (t) => new RegExp(`(?<![a-z0-9+#])${escapeRe(t)}(?![a-z0-9+#])`, 'g');
const numberWord = (n) => (n < NUMBER_WORDS.length ? NUMBER_WORDS[n] : String(n));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function splitLines(text) {
  return text.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

/* ---------- skills ---------- */

export function countTerm(lowerText, originalLines, skill) {
  let count = 0;
  for (const term of skill.terms) {
    if (AMBIGUOUS.has(term)) {
      /* short or common words count only when written as a skill, in a list, with the exact case */
      const display = skill.name;
      const re = new RegExp(`(?<![A-Za-z0-9+#])${escapeRe(display)}(?![A-Za-z0-9+#-])`);
      for (const line of originalLines) {
        if (re.test(line) && /[,|/•·]/.test(line) && !/go[\s-]to[\s-]market/i.test(line)) count += 1;
      }
    } else {
      const m = lowerText.match(termRe(term));
      if (m) count += m.length;
    }
  }
  return count;
}

export function jdSkillWeights(jdText, role = '') {
  const lines = splitLines(jdText);
  const preferredLine = /(preferred|nice[\s-]to[\s-]have|good[\s-]to[\s-]have|bonus|desirable|a plus|is a plus|added advantage|optional)/i;
  const resetLine = /(requirement|must[\s-]have|qualifications|what you('| wi)ll|you will|responsibilit|key skills|about the role|what we('| a)re looking)/i;
  /* Lines that describe the company (what it sells, its customers, its story) are context, not skills the job needs. */
  const aboutHead = /^(about\b(?!\s+(the\s+)?(role|job|position|you|opportunity))|company overview|who we are|our story|our company|the company|why join|what we offer|benefits|perks|life at)/i;
  const companyLine = (l) => /^(we|we're|we are|our)\b(?![^.]{0,60}\b(you|your|looking for|need|hiring)\b)/i.test(l) || /^[A-Z][\w&.'’-]*(\s+[A-Z][\w&.'’-]*){0,3}\s+(is|are|was|runs|teaches|helps|builds|makes|offers|sells|connects|supplies|serves|provides|operates|has)\b/.test(l);
  let mode = 'required';
  const tagged = lines.map((line, n) => {
    const isHead = line.length < 60 && !/[.]$/.test(line);
    if (isHead && aboutHead.test(line)) mode = 'context';
    else if (isHead && preferredLine.test(line)) mode = 'preferred';
    else if (isHead && resetLine.test(line)) mode = 'required';
    if (n > 0 && !isHead && companyLine(line) && !/^[-•*]/.test(line)) return { line, lower: line.toLowerCase(), kind: 'context' };
    const kind = mode === 'context' ? 'context' : preferredLine.test(line) ? 'preferred' : mode;
    return { line, lower: line.toLowerCase(), kind };
  });

  const jobFam = familyOfTitle((role && role.trim()) || roleFromJd(jdText));
  const found = [];
  for (const skill of SKILLS) {
    let req = 0; let pref = 0;
    if (!skillFitsJob(skill.name, skill.family, jobFam)) continue;
    for (const t of tagged) {
      if (t.kind === 'context') continue;
      const c = countTerm(t.lower, [t.line], skill);
      if (c) { if (t.kind === 'preferred') pref += c; else req += c; }
    }
    const mentions = req + pref;
    if (!mentions) continue;
    const required = req > 0;
    const weight = (required ? 3 : 1.5) + Math.min(1.5, (mentions - 1) * 0.5);
    found.push({ name: skill.name, family: skill.family, skill, required, mentions, weight });
  }

  /* recurring words that the taxonomy does not know, as plain keywords */
  const known = new Set(found.flatMap((f) => f.skill.terms.flatMap((t) => t.split(' '))));
  const freq = new Map();
  for (const w of jdText.toLowerCase().match(/[a-z][a-z+#.-]{3,}/g) || []) {
    const word = w.replace(/[.-]+$/, '');
    if (word.length < 4 || STOPWORDS.has(word) || known.has(word)) continue;
    freq.set(word, (freq.get(word) || 0) + 1);
  }
  const keywords = [...freq.entries()].filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6)
    .map(([word, n]) => ({ name: word, family: 'keyword', skill: { name: word, terms: [word] }, required: false, mentions: n, weight: 1, keyword: true }));
  return [...found, ...keywords];
}

/* ---------- CV structure ---------- */

export function sectionise(lines) {
  let current = 'top';
  const heads = new Set();
  const out = lines.map((line, i) => {
    const clean = line.replace(/[^A-Za-z\s&]/g, '').trim();
    if (clean.length && clean.length <= 40) {
      for (const [name, re] of SECTION_HEADS) {
        if (re.test(clean)) { current = name; heads.add(name); return { line, i, section: name, head: true }; }
      }
    }
    return { line, i, section: current, head: false };
  });
  return { rows: out, heads };
}

export function parseMonth(token, isEnd, now) {
  const t = token.toLowerCase().replace(/[’']/g, '').trim();
  if (/^(present|current|now|till\s*date|to\s*date|date|ongoing)$/.test(t)) return now.getFullYear() * 12 + now.getMonth();
  let m = t.match(/^([a-z]{3,9})\.?\s*(\d{2,4})$/);
  if (m && MONTHS[m[1].slice(0, 4)] !== undefined) {
    const y = m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
    return y * 12 + MONTHS[m[1].slice(0, 4)];
  }
  if (m && MONTHS[m[1].slice(0, 3)] !== undefined) {
    const y = m[2].length === 2 ? 2000 + Number(m[2]) : Number(m[2]);
    return y * 12 + MONTHS[m[1].slice(0, 3)];
  }
  m = t.match(/^(\d{1,2})[/.-](\d{4})$/);
  if (m) return Number(m[2]) * 12 + Number(m[1]) - 1;
  m = t.match(/^(\d{4})$/);
  if (m) return Number(m[1]) * 12 + (isEnd ? 11 : 0);
  return null;
}

export function cvYears(rows, heads, now) {
  const dateTok = "(?:[A-Za-z]{3,9}\\.?\\s*[’']?\\d{2,4}|\\d{1,2}[/.-]\\d{4}|\\d{4})";
  const endTok = `(?:${dateTok}|present|current|now|till\\s*date|to\\s*date|ongoing)`;
  const re = new RegExp(`(${dateTok})\\s*(?:-|–|—|to|until)\\s*(${endTok})`, 'gi');
  const useSection = heads.has('experience');
  const spans = [];
  for (const r of rows) {
    if (useSection ? r.section !== 'experience' : r.section === 'education') continue;
    for (const m of r.line.matchAll(re)) {
      const a = parseMonth(m[1], false, now); const b = parseMonth(m[2], true, now);
      if (a === null || b === null || b < a || b - a > 12 * 45) continue;
      spans.push([a, b + 1]);
    }
  }
  spans.sort((x, y) => x[0] - y[0]);
  let total = 0; let end = -Infinity;
  for (const [a, b] of spans) {
    if (b <= end) continue;
    total += b - Math.max(a, end);
    end = Math.max(end, b);
  }
  if (total) return Math.round((total / 12) * 10) / 10;
  const stated = rows.map((r) => r.line.match(/(\d{1,2}(?:\.\d)?)\+?\s*(?:years?|yrs?)\s+(?:of\s+)?(?:\w+\s+){0,3}experience/i)).find(Boolean);
  return stated ? Number(stated[1]) : 0;
}

export function jdYears(jdText) {
  const lower = jdText.toLowerCase();
  if (/\b(fresher|freshers|entry[\s-]level|graduate trainee|no experience required)\b/.test(lower)) return 0;
  const re = /(\d{1,2})\s*(?:\+|plus)?\s*(?:(?:-|–|to)\s*(\d{1,2}))?\s*\+?\s*(?:years?|yrs?)/g;
  for (const m of lower.matchAll(re)) {
    const ctx = lower.slice(Math.max(0, m.index - 40), m.index + m[0].length + 60);
    if (/experience|exp\b|background|working/.test(ctx)) return Number(m[1]);
  }
  return null;
}

/* ---------- job title ---------- */

export function roleFromJd(jdText) {
  const lines = splitLines(jdText).slice(0, 25);
  for (const l of lines) {
    const m = l.match(/^(job\s*title|position|role|designation|title|job\s*role|opening)\s*[:\-–]\s*(.{3,90})$/i);
    if (m) return m[2].trim();
  }
  const LABEL = /^(about|we|we're|our|the company|job description|description|overview|location|experience|salary|ctc|shift|eligibility|skills?|note|job type|employment type|work mode|apply|company|hiring|urgent|responsibilit|requirement|qualification|who|what|why|join)\b/i;
  for (const l of lines) {
    const words = l.split(' ').length;
    if (words >= 1 && words <= 12 && l.length <= 90 && !/[.:!?]$/.test(l) && !/:\s/.test(l) && !LABEL.test(l)) return l;
  }
  return 'This role';
}

/* ---------- ATS readability ---------- */

function atsIssues(cv, rows, heads, market, meta) {
  const issues = [];
  const add = (id, penalty, title, detail, fix) => issues.push({ id, penalty, title, detail, fix });
  const text = cv;
  const words = (text.match(/[A-Za-z][A-Za-z'’-]*/g) || []).length;
  const m = MARKETS[market] || MARKETS.IN;

  const perPage = meta && meta.pages ? words / meta.pages : null;
  if (words < 40 || (perPage !== null && perPage < 50 && words < 150)) add('low_text', 40, 'Most of your CV could not be read', `We could read only ${words} words. If your CV is a photo or a scan, hiring software sees it almost empty.`, 'Export it again from Word or Google Docs as a text PDF, or upload the DOCX.');
  else if (words < 150) add('short_cv', 15, 'Your CV is very short', `We found only ${words} words. Recruiters and hiring software look for more detail about what you did.`, 'Add 3 to 5 lines for each job or project: what you did, the tools you used, and the result.');
  if (!/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text)) add('no_email', 12, 'No email address found', 'Recruiters and job sites look for your email at the top.', 'Add your email on the first line under your name.');
  if (!/(\+?\d[\d\s().-]{8,}\d)/.test(text)) add('no_phone', 8, 'No phone number found', 'Recruiters need a phone number to call you.', 'Add a phone number with the country code.');
  if (!heads.has('experience') && words >= 150) add('no_experience_head', 12, 'Add an "Experience" heading', 'Hiring software sorts your CV by standard headings. Without one, your work history may be skipped.', 'Title the section "Experience" or "Work Experience". Freshers can use "Internships" or "Projects".');
  if (!heads.has('skills') && words >= 150) add('no_skills_head', 8, 'Add a "Skills" heading', 'Hiring software looks for a section called Skills to match the job.', 'Add a short "Skills" section listing the tools you have used.');
  if (!heads.has('education') && words >= 150) add('no_education_head', 6, 'Add an "Education" heading', 'Hiring software expects a standard Education section.', 'Add an "Education" section with degree, institution and year.');
  if (meta && meta.columns) add('columns', 10, 'Use one column, not two', 'Hiring software often reads across both columns and mixes up your lines.', 'Use a single-column layout with no tables or text boxes.');

  const bullets = rows.filter((r) => !r.head && /^([•●▪▫◦‣⁃∙\-–—*]|\d+[.)])\s*/.test(r.line));
  const workRows = rows.filter((r) => ['experience', 'projects'].includes(r.section) && !r.head);
  if (words >= 250 && bullets.length < 3) add('few_bullets', 6, 'Use bullet points', 'Long paragraphs are hard for recruiters and hiring software to read.', 'Break each role into 3–5 bullets that start with what you did.');
  const bulletish = bullets.length >= 4 ? bullets : workRows;
  const quantified = bulletish.filter((r) => /\d|%|₹|\$|£|€/.test(r.line.replace(/(19|20)\d{2}/g, ''))).length;
  if (bulletish.length >= 4 && quantified / bulletish.length < 0.25) add('few_numbers', 6, 'Add numbers to your results', `Only ${numberWord(quantified)} of ${bulletish.length} lines show a number, a percentage or a size.`, 'Add one real number where you can: users, time saved, revenue, team size.');
  const weak = workRows.filter((r) => WEAK.some((w) => w.re.test(r.line.replace(/^([•●▪▫◦‣⁃∙\-–—*]|\d+[.)])\s*/, ''))));
  if (weak.length >= 3) add('weak_verbs', 4, `Start ${numberWord(weak.length)} lines with what you did`, 'Phrases like "responsible for" or "worked on" hide what you actually did.', 'Start with a verb: built, analysed, launched, reduced.');
  if (words > m.maxWords * 1.25) add('too_long', 6, 'Make it shorter', `About ${words} words. In ${m.name}, ${m.pages} is the norm.`, 'Cut older roles and repeated points first.');
  const personal = [];
  if (m.personal.dob === 'remove' && /\b(date of birth|d\.?o\.?b\.?|born on)\b/i.test(text)) personal.push('date of birth');
  if (m.personal.marital === 'remove' && /\b(marital status|married|unmarried|single)\b/i.test(text) && /\bmarital|married\b/i.test(text)) personal.push('marital status');
  if (m.personal.marital === 'remove' && /\b(religion|nationality|gender|father'?s name)\b/i.test(text)) personal.push('religion, nationality or family details');
  if (personal.length) add('personal', 6, 'Remove personal details', `For ${m.name}, remove your ${personal.join(' and ')}. Employers there avoid them to prevent bias.`, `Delete them from your ${m.word}.`);
  const odd = (text.match(/[�-■□▪▫]/g) || []).length;
  if (odd > 5) add('odd_chars', 6, 'Remove icons and special symbols', 'Icons or special fonts turned into unreadable symbols.', 'Replace icons with plain words, like "Email:" and "Phone:".');
  return { issues, words, weakRows: weak };
}

/* ---------- coach: honest line suggestions ---------- */

function pastTense(ing) {
  const w = ing.toLowerCase();
  if (!w.endsWith('ing')) return null;
  const stem = w.slice(0, -3);
  if (IRREGULAR[stem]) return IRREGULAR[stem];
  if (stem.length < 2) return null;
  return cap(stem.endsWith('e') ? `${stem}d` : `${stem}ed`);
}

const BULLET = /^([•●▪▫◦‣⁃∙\-–—*]|\d+[.)])\s*/;

function coachLines(rows) {
  const out = [];
  const hasBullets = rows.filter((r) => BULLET.test(r.line)).length >= 3;
  for (const r of rows) {
    if (r.head || !['experience', 'projects'].includes(r.section)) continue;
    if (hasBullets && !BULLET.test(r.line)) continue;
    if (/(19|20)\d{2}\s*(-|–|—|to)/.test(r.line)) continue;
    const body = r.line.replace(/^([•●▪▫◦‣⁃∙\-–—*]|\d+[.)])\s*/, '');
    if (body.split(' ').length < 4) continue;
    const weak = WEAK.find((w) => w.re.test(body));
    const hasNumber = /\d|%|₹|\$|£|€/.test(body.replace(/(19|20)\d{2}/g, ''));
    if (!weak && hasNumber) continue;
    let rest = weak ? body.replace(weak.re, '') : body;
    let verbs = ['Built', 'Developed', 'Improved', 'Analysed', 'Supported', 'Delivered'];
    const ing = rest.match(/^([a-z]+ing)\s+(.*)$/i);
    if (ing && pastTense(ing[1])) { verbs = [pastTense(ing[1]), ...verbs.filter((v) => v !== pastTense(ing[1]))].slice(0, 6); rest = ing[2]; }
    if (!weak) {
      const first = rest.split(' ')[0];
      if (/ed$/i.test(first) || IRREGULAR[first.toLowerCase()]) { verbs = [cap(first), ...verbs.filter((v) => v.toLowerCase() !== first.toLowerCase())].slice(0, 6); rest = rest.split(' ').slice(1).join(' '); }
    }
    rest = rest.replace(/\.$/, '');
    out.push({ index: r.i, section: r.section, original: body, opener: weak ? weak.label : null, verbs, rest, needsNumber: !hasNumber });
    if (out.length >= 10) break;
  }
  return out;
}

/* ---------- main ---------- */

export function score({ cvText, jdText, market = 'IN', meta = {}, now = new Date(), role = '' }) {
  const cvLines = splitLines(cvText || '');
  const cvLower = cvLines.join('\n').toLowerCase();
  const { rows, heads } = sectionise(cvLines);

  /* skills */
  const wanted = jdSkillWeights(jdText || '', role);
  const totalW = wanted.reduce((s, k) => s + k.weight, 0);
  const matched = []; const missing = [];
  for (const k of wanted) {
    const c = countTerm(cvLower, cvLines, k.skill) || (IMPLIED_BY[k.name] || []).some((n) => { const sk = SKILLS.find((x) => x.name === n); return sk && countTerm(cvLower, cvLines, sk); });
    (c ? matched : missing).push(k);
  }
  const matchedW = matched.reduce((s, k) => s + k.weight, 0);
  /* with only a few known skills in the job, the skills part counts less, so one missing word cannot swing the score */
  const conf = Math.min(1, wanted.filter((k) => !k.keyword).length / 4);
  const skillsPart = totalW ? Math.round(60 * (1 - conf) + (matchedW / totalW) * 100 * conf) : 60;

  /* experience */
  const need = jdYears(jdText || '');
  const have = cvYears(rows, heads, now);
  let expPart;
  if (need === null) expPart = have > 0 ? 85 : 70;
  else if (need === 0) expPart = 95;
  else if (have >= need) expPart = 100;
  else expPart = Math.max(have > 0 ? 30 : 15, Math.round((have / need) * 100));

  /* ATS */
  const { issues, words } = atsIssues(cvText || '', rows, heads, market, meta);
  const atsPart = Math.max(0, 100 - issues.reduce((s, i) => s + i.penalty, 0));

  const total = Math.round(W.skills * skillsPart + W.experience * expPart + W.ats * atsPart);

  /* alterations: what each fix is worth in points on the overall score */
  const GENERIC = /(analysis|testing|visuali[sz]ation|management|design|research|marketing|skills|engineering|learning)$/i;
  const familyOf = new Map(matched.filter((k) => !k.keyword && !GENERIC.test(k.name)).map((k) => [k.family, k.name]));
  const skillAlts = missing.map((k) => {
    const pts = Math.max(1, Math.round((W.skills * 100 * k.weight * conf) / (totalW || 1)));
    const sibling = k.keyword ? null : (matched.find((m) => !m.keyword && m.name.length >= 2 && new RegExp(`\\b${m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(k.name) && m.name !== k.name) || {}).name || familyOf.get(k.family);
    const where = sibling
      ? `You list ${sibling}. If you have used ${k.name}, add it beside ${sibling} and show it in the role where you used it.`
      : heads.has('skills')
        ? `If you have used ${k.name}, add it to your Skills section and to the role or project where you used it.`
        : `If you have used ${k.name}, add a Skills section and include it.`;
    const detail = k.keyword
      ? `The job uses this word ${numberWord(k.mentions)} times. Your ${MARKETS[market]?.word || 'CV'} does not.`
      : k.required
        ? `The job ${k.mentions > 1 ? `mentions it ${numberWord(k.mentions)} times` : 'asks for it'}. We did not find it in your ${MARKETS[market]?.word || 'CV'}.`
        : `The job lists it as a plus. We did not find it in your ${MARKETS[market]?.word || 'CV'}.`;
    return { kind: 'skill', title: k.keyword ? `“${k.name}”` : k.name, detail, fix: where, points: pts, required: k.required };
  });
  const atsAlts = issues.map((i) => ({ kind: 'ats', title: i.title, detail: i.detail, fix: i.fix, points: Math.max(1, Math.round(W.ats * i.penalty)), id: i.id }));
  const alterations = [...skillAlts, ...atsAlts].sort((a, b) => b.points - a.points || (a.kind === 'skill' ? -1 : 1) || a.title.localeCompare(b.title));
  const projected = Math.min(98, total + alterations.reduce((s, a) => s + a.points, 0));

  const clear = alterations.filter((a) => a.points >= 2).length;
  let verdict;
  if (total >= 80) verdict = 'Strong match';
  else if (total >= 65) verdict = 'Good match';
  else if (total >= 50) verdict = 'Fair match';
  else verdict = 'Weak match';

  let expNote;
  const haveTxt = have >= 1.5 ? `about ${Math.round(have)} years` : have >= 1 ? 'about 1 year' : have > 0 ? 'less than a year' : 'no dated work experience';
  if (need === null) expNote = have ? `The job does not say how many years. You have ${haveTxt}.` : 'The job does not say how many years of experience it needs.';
  else if (need === 0) expNote = 'This is an entry-level job. Freshers can apply.';
  else if (have >= need) expNote = `The job asks for ${need}+ years. You have ${haveTxt}.`;
  else expNote = `The job asks for ${need}+ years. You have ${haveTxt}, so show the depth of what you have done.`;

  return {
    engine: ENGINE_VERSION,
    score: total,
    projected,
    verdict,
    role: (role && role.trim()) || roleFromJd(jdText || ''),
    parts: { skills: skillsPart, experience: expPart, ats: atsPart },
    experience: { required: need, found: have, note: expNote },
    matched: matched.map((k) => k.name),
    alterations,
    coach: coachLines(rows),
    words,
  };
}
