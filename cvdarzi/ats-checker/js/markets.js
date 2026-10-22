/* Prices and CV conventions per market. Prices are display prices; real prices come from Google Play
   once billing is live, so these must match the products set up in Play Console. */

export const MARKETS = {
  IN: {
    name: 'India', word: 'CV', currency: '₹',
    prices: { report: '₹99', sprint: '₹199', hunt: '₹349', kit: '₹149', pro: '₹399' },
    taxNote: 'Prices include GST.',
    maxWords: 1100, pages: '1–2 pages',
    personal: { dob: 'ok', photo: 'ok', marital: 'ok' },
  },
  US: {
    name: 'United States', word: 'resume', currency: '$',
    prices: { report: '$4.99', sprint: '$9.99', hunt: '$14.99', kit: '$6.99', pro: '$14.99' },
    taxNote: 'Sales tax may be added at checkout.',
    maxWords: 750, pages: 'one page for under 10 years of experience',
    personal: { dob: 'remove', photo: 'remove', marital: 'remove' },
  },
  UK: {
    name: 'United Kingdom', word: 'CV', currency: '£',
    prices: { report: '£3.99', sprint: '£7.99', hunt: '£11.99', kit: '£5.49', pro: '£11.99' },
    taxNote: 'Prices include VAT.',
    maxWords: 1000, pages: 'two pages',
    personal: { dob: 'remove', photo: 'remove', marital: 'remove' },
  },
  EU: {
    name: 'Europe', word: 'CV', currency: '€',
    prices: { report: '€4.49', sprint: '€8.99', hunt: '€13.99', kit: '€5.99', pro: '€12.99' },
    taxNote: 'Prices include VAT.',
    maxWords: 1000, pages: 'one to two pages',
    personal: { dob: 'optional', photo: 'optional', marital: 'remove' },
  },
  CA: {
    name: 'Canada', word: 'resume', currency: 'C$',
    prices: { report: 'C$6.99', sprint: 'C$12.99', hunt: 'C$19.99', kit: 'C$9.49', pro: 'C$19.99' },
    taxNote: 'Sales tax may be added at checkout.',
    maxWords: 900, pages: 'one to two pages',
    personal: { dob: 'remove', photo: 'remove', marital: 'remove' },
  },
  AU: {
    name: 'Australia', word: 'resume', currency: 'A$',
    prices: { report: 'A$7.99', sprint: 'A$14.99', hunt: 'A$22.99', kit: 'A$10.99', pro: 'A$21.99' },
    taxNote: 'Prices include GST.',
    maxWords: 1100, pages: 'two to three pages',
    personal: { dob: 'remove', photo: 'remove', marital: 'remove' },
  },
};

export function marketOfCountry(c) {
  const k = String(c || '').toUpperCase();
  if (k === 'IN') return 'IN';
  if (k === 'US') return 'US';
  if (k === 'GB' || k === 'UK') return 'UK';
  if (k === 'CA') return 'CA';
  if (k === 'AU' || k === 'NZ') return 'AU';
  if (/^(AT|BE|BG|HR|CY|CZ|DK|EE|FI|FR|DE|GR|HU|IE|IT|LV|LT|LU|MT|NL|PL|PT|RO|SK|SI|ES|SE|NO|CH|IS|LI)$/.test(k)) return 'EU';
  return null;
}
/* Until the server says where the person is, the phone's time zone is the best guess, then its language. */
export function guessMarket() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/^Asia\/(Kolkata|Calcutta)$/.test(tz)) return 'IN';
    if (/^Europe\/(London|Belfast)$/.test(tz)) return 'UK';
    if (/^Australia\//.test(tz) || /^Pacific\/Auckland$/.test(tz)) return 'AU';
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal|Moncton|Whitehorse|Yellowknife|Iqaluit)$/.test(tz)) return 'CA';
    if (/^(America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana|Kentucky|North_Dakota)|Pacific\/Honolulu|US\/)/.test(tz)) return 'US';
    if (/^Europe\//.test(tz) && !/^Europe\/(Moscow|Istanbul|Kiev|Kyiv|Minsk)$/.test(tz)) return 'EU';
  } catch (_) { /* fall through */ }
  try {
    const loc = (navigator.language || 'en-IN').toUpperCase();
    const m = marketOfCountry(loc.split('-')[1] || '');
    if (m) return m;
  } catch (_) { /* fall through */ }
  return 'IN';
}
