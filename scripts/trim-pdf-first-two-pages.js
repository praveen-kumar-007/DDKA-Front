// Node script — extracts first two pages from public/important-docs/entryform.pdf
// Usage: node scripts/trim-pdf-first-two-pages.js
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public', 'important-docs');
const srcPath = path.join(publicDir, 'entryform.pdf');
const tmpPath = path.join(publicDir, 'entryform.trimmed.pdf');

async function run() {
  if (!fs.existsSync(srcPath)) {
    console.error('Source PDF not found:', srcPath);
    process.exit(1);
  }

  const srcBytes = fs.readFileSync(srcPath);
  const srcPdf = await PDFDocument.load(srcBytes);
  const total = srcPdf.getPageCount();
  const take = Math.min(2, total);

  const outPdf = await PDFDocument.create();
  const [copied] = await outPdf.copyPages(srcPdf, Array.from({ length: take }, (_, i) => i));
  // copyPages returns an array; but we passed an array - handle generically
  // Actually above returns array of pages; append them all
  const pages = await outPdf.copyPages(srcPdf, Array.from({ length: take }, (_, i) => i));
  pages.forEach(p => outPdf.addPage(p));

  const outBytes = await outPdf.save();
  fs.writeFileSync(tmpPath, outBytes);
  fs.renameSync(tmpPath, srcPath);
  console.log(`Trimmed document: kept ${take} page(s) — replaced ${path.relative(process.cwd(), srcPath)}`);
}

run().catch(err => { console.error(err); process.exit(1); });