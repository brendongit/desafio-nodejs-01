import fs from 'fs';
import { parse } from 'csv-parse';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const processFile = async () => {
  const records = [];
  const parser = parse({
    delimiter: ',',
    skipEmptyLines: true,
    fromLine: 2,
  });
  const fileStream = fs.createReadStream(`${__dirname}/file.csv`);

  for await (const chunk of fileStream) {
    parser.write(chunk);
  }

  parser.end();

  for await (const record of parser) {
    records.push(record);
  }

  return records;
};

(async () => {
  try {
    const records = await processFile();
    console.info(records);
  } catch (error) {
    console.error('Erro na leitura do arquivo CSV:', error);
  }
})();
