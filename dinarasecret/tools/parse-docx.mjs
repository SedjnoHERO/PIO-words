import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const DASH_SEP = ' – ';

const ensureDocumentXml = () => {
  const cachedXml = resolve(__dirname, 'document.xml');
  const psScript = resolve(__dirname, 'extract-docx-xml.ps1');

  execFileSync('powershell', [
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    psScript,
    '-ProjectRoot',
    rootDir,
  ], { stdio: 'inherit' });

  return cachedXml;
};

const decodeXmlEntities = (value) =>
  value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");

const extractParagraphs = (xml) => {
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
      texts.push(decodeXmlEntities(textMatch[1]));
      textMatch = textRegex.exec(paragraphXml);
    }

    const line = texts.join('').replace(/\s+/g, ' ').trim();
    if (line) {
      paragraphs.push({
        text: line,
        isCentered: centerRegex.test(paragraphXml),
      });
    }

    match = paragraphRegex.exec(xml);
  }

  return paragraphs;
};

const slugify = (value) => {
  const transliterated = value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, '-')
    .replace(/^-|-$/g, '');

  if (transliterated) {
    return transliterated.slice(0, 48);
  }

  return `topic-${Math.random().toString(36).slice(2, 8)}`;
};

const stripDefinitions = (value) =>
  value.replace(/\s*«[^»]*»/g, '').trim();

const stripPhonetics = (value) =>
  value.replace(/\s*\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();

const splitVariants = (value) =>
  value
    .split(/\s*\/\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

const splitRussianTranslations = (value) => {
  const cleaned = stripDefinitions(value);
  const parts = [];
  let current = '';
  let depth = 0;

  for (let index = 0; index < cleaned.length; index += 1) {
    const char = cleaned[index];

    if (char === '(') {
      depth += 1;
    }

    if (char === ')') {
      depth = Math.max(0, depth - 1);
    }

    if ((char === ',' || char === ';') && depth === 0) {
      const piece = current.trim();
      if (piece) {
        parts.push(piece);
      }
      current = '';
      continue;
    }

    current += char;
  }

  const last = current.trim();
  if (last) {
    parts.push(last);
  }

  return parts.length > 0 ? parts : [cleaned];
};

const parseTopicHeader = (line) =>
  line.replace(/^\d+\.\s*/, '').trim();

const isTopicHeader = (paragraph) => {
  const { text, isCentered } = paragraph;

  if (text === '---') {
    return false;
  }

  if (isCentered) {
    return true;
  }

  return /^\d+\.\s+/.test(text) && !text.includes(DASH_SEP);
};

const parseWordLine = (line) => {
  if (!line.includes(DASH_SEP)) {
    return null;
  }

  const dashIndex = line.indexOf(DASH_SEP);
  const englishRaw = line.slice(0, dashIndex).replace(/^\d+\.\s*/, '').trim();
  const russianRaw = line.slice(dashIndex + DASH_SEP.length).trim();

  const englishClean = stripPhonetics(stripDefinitions(englishRaw));
  const russianClean = stripDefinitions(russianRaw);
  const enVariants = splitVariants(englishClean);
  const ruVariants = splitRussianTranslations(russianClean);

  if (enVariants.length === 0 || ruVariants.length === 0) {
    return null;
  }

  return {
    en: enVariants,
    ru: ruVariants[0],
    ruVariants: ruVariants.length > 1 ? ruVariants : undefined,
  };
};

const buildVocabulary = (paragraphs) => {
  const topics = [];
  let currentTopic = null;
  let wordCounter = 0;
  const usedIds = new Set();

  const startTopic = (title) => {
    let id = slugify(title);
    let suffix = 1;
    while (usedIds.has(id)) {
      id = `${slugify(title)}-${suffix}`;
      suffix += 1;
    }
    usedIds.add(id);
    currentTopic = { id, title, words: [] };
    topics.push(currentTopic);
  };

  for (const paragraph of paragraphs) {
    const { text } = paragraph;

    if (text === '---') {
      continue;
    }

    if (isTopicHeader(paragraph)) {
      const title = paragraph.isCentered ? text : parseTopicHeader(text);
      startTopic(title);
      continue;
    }

    if (!currentTopic) {
      continue;
    }

    const parsed = parseWordLine(text);
    if (!parsed) {
      continue;
    }

    wordCounter += 1;
    currentTopic.words.push({
      id: `${currentTopic.id}-${wordCounter}`,
      ru: parsed.ru,
      en: parsed.en,
      topic: currentTopic.id,
      ...(parsed.ruVariants ? { ruVariants: parsed.ruVariants } : {}),
    });
  }

  return { topics, wordCounter };
};

const xmlPath = ensureDocumentXml();
const xml = readFileSync(xmlPath, 'utf8');
const paragraphs = extractParagraphs(xml);
const { topics, wordCounter } = buildVocabulary(paragraphs);

const vocabularyTs = `import type { TopicGroup } from '../types/vocabulary';

export const VOCABULARY: TopicGroup[] = ${JSON.stringify(
  topics.map((topic) => ({
    id: topic.id,
    title: topic.title,
    words: topic.words,
  })),
  null,
  2,
)};

export const TOTAL_WORDS = VOCABULARY.reduce(
  (sum, group) => sum + group.words.length,
  0,
);
`;

writeFileSync(resolve(rootDir, 'src/data/vocabulary.ts'), vocabularyTs, 'utf8');
writeFileSync(
  resolve(__dirname, 'parsed-preview.json'),
  JSON.stringify({
    wordCounter,
    topics: topics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      count: topic.words.length,
    })),
  }, null, 2),
  'utf8',
);

console.log(`Parsed ${wordCounter} words in ${topics.length} topics`);
topics.forEach((topic) => {
  console.log(`- ${topic.title}: ${topic.words.length}`);
});
