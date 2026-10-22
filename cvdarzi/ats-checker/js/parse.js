/* Reads a CV file on the device. PDF via pdf.js, DOCX via a small zip reader, TXT as is.
   Returns { text, meta: { pages, columns, kind } }. Nothing is uploaded. */

let pdfjs = null;
async function loadPdfJs() {
  if (pdfjs) return pdfjs;
  pdfjs = await import('../vendor/pdfjs/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
  return pdfjs;
}

async function readPdf(buffer) {
  const lib = await loadPdfJs();
  const doc = await lib.getDocument({ data: new Uint8Array(buffer), isEvalSupported: false }).promise;
  const lines = [];
  let splitRows = 0; let rowsTotal = 0;
  for (let p = 1; p <= doc.numPages; p += 1) {
    const page = await doc.getPage(p);
    const width = page.getViewport({ scale: 1 }).width;
    const content = await page.getTextContent();
    /* group text items into rows by their y position */
    const rows = new Map();
    for (const item of content.items) {
      if (!item.str || !item.str.trim()) continue;
      const y = Math.round(item.transform[5] / 3) * 3;
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y).push({ x: item.transform[4], w: item.width || 0, s: item.str });
    }
    const ys = [...rows.keys()].sort((a, b) => b - a);
    for (const y of ys) {
      const items = rows.get(y).sort((a, b) => a.x - b.x);
      let line = ''; let lastEnd = null; let bigGap = false;
      for (const it of items) {
        if (lastEnd !== null) {
          const gap = it.x - lastEnd;
          if (gap > width * 0.12) bigGap = true;
          line += gap > 2 ? ' ' : '';
        }
        line += it.s;
        lastEnd = it.x + it.w;
      }
      rowsTotal += 1;
      if (bigGap) splitRows += 1;
      lines.push(line.trim());
    }
    lines.push('');
  }
  return { text: lines.join('\n'), meta: { kind: 'pdf', pages: doc.numPages, columns: rowsTotal > 12 && splitRows / rowsTotal > 0.3 } };
}

/* minimal zip reader for DOCX: find word/document.xml through the central directory */
async function inflateRaw(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzipEntry(buffer, wanted) {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  let eocd = -1;
  for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 66000); i -= 1) {
    if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a valid DOCX file');
  const count = view.getUint16(eocd + 10, true);
  let ptr = view.getUint32(eocd + 16, true);
  const dec = new TextDecoder();
  for (let n = 0; n < count; n += 1) {
    const method = view.getUint16(ptr + 10, true);
    const size = view.getUint32(ptr + 20, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const local = view.getUint32(ptr + 42, true);
    const name = dec.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    if (name === wanted) {
      const lNameLen = view.getUint16(local + 26, true);
      const lExtraLen = view.getUint16(local + 28, true);
      const start = local + 30 + lNameLen + lExtraLen;
      const data = bytes.subarray(start, start + size);
      return dec.decode(method === 0 ? data : await inflateRaw(data));
    }
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error('This DOCX has no document text');
}

async function readDocx(buffer) {
  const xml = await unzipEntry(buffer, 'word/document.xml');
  const hasTable = /<w:tbl>/.test(xml);
  const text = xml
    .replace(/<w:tab\/>/g, '\t')
    .replace(/<w:br\/>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<w:numPr>/g, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  return { text, meta: { kind: 'docx', pages: null, columns: hasTable } };
}

export async function readCvFile(file) {
  const name = (file.name || '').toLowerCase();
  const buffer = await file.arrayBuffer();
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return readPdf(buffer);
  if (name.endsWith('.docx')) return readDocx(buffer);
  if (name.endsWith('.txt') || file.type.startsWith('text/')) return { text: new TextDecoder().decode(buffer), meta: { kind: 'txt', pages: null, columns: false } };
  throw new Error('Please choose a PDF, DOCX or TXT file.');
}
