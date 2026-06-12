import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = resolve(process.argv[2] ?? 'tools/words-template.txt');
const outputPath = resolve(__dirname, '../src/data/vocabulary.ts');

const raw = readFileSync(inputPath, 'utf8');
const lines = raw.split(/\r?\n/);

const topics = [];
let currentTopic = null;
let wordCounter = 0;

for (const line of lines) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith('#')) {
    continue;
  }

  const topicMatch = trimmed.match(/^\[([^\]]+)\]\s*(.+)$/);

  if (topicMatch) {
    currentTopic = {
      id: topicMatch[1].trim(),
      title: topicMatch[2].trim(),
      words: [],
    };
    topics.push(currentTopic);
    continue;
  }

  if (!currentTopic) {
    continue;
  }

  const [ruPart, enPart] = trimmed.split('|').map((part) => part.trim());

  if (!ruPart || !enPart) {
    continue;
  }

  wordCounter += 1;
  const en = enPart.split(',').map((item) => item.trim()).filter(Boolean);

  currentTopic.words.push({
    id: `${currentTopic.id}-${wordCounter}`,
    ru: ruPart,
    en,
    topic: currentTopic.id,
  });
}

const fileContent = `import type { TopicGroup } from '../types/vocabulary';

export const VOCABULARY: TopicGroup[] = ${JSON.stringify(topics, null, 2)};

export const TOTAL_WORDS = VOCABULARY.reduce(
  (sum, group) => sum + group.words.length,
  0,
);
`;

writeFileSync(outputPath, fileContent, 'utf8');

console.log(`Imported ${wordCounter} words into ${outputPath}`);
