import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const xml = readFileSync(resolve(__dirname, 'document.xml'), 'utf8');

const decode = (v) =>
  v
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const paragraphs = [];
const paragraphRegex = /<w:p[\s\S]*?<\/w:p>/g;
const textRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
const centerRegex = /<w:jc w:val="center"/;

let match = paragraphRegex.exec(xml);
while (match) {
  const paragraphXml = match[0];
  const texts = [];
  let textMatch = textRegex.exec(paragraphXml);
  while (textMatch) {
    texts.push(decode(textMatch[1]));
    textMatch = textRegex.exec(paragraphXml);
  }

  const line = texts.join('').replace(/\s+/g, ' ').trim();
  if (line) {
    paragraphs.push({
      text: line,
      isCentered: centerRegex.test(paragraphXml),
      hasNumber: /^\d+\./.test(line),
      hasDash: /[–—-]/.test(line),
    });
  }

  match = paragraphRegex.exec(xml);
}

console.log('Total paragraphs:', paragraphs.length);
console.log('Numbered:', paragraphs.filter((p) => p.hasNumber).length);
console.log('Centered:', paragraphs.filter((p) => p.isCentered).length);

const lines = paragraphs.map((p, i) => {
  const flags = [
    p.isCentered ? 'C' : '.',
    p.hasNumber ? 'N' : '.',
  ].join('');
  return `${String(i + 1).padStart(3)} [${flags}] ${p.text}`;
});

import { writeFileSync } from 'node:fs';
writeFileSync(resolve(__dirname, 'inspect-output.txt'), lines.join('\n'), 'utf8');
console.log('Written inspect-output.txt, paragraphs:', paragraphs.length);
