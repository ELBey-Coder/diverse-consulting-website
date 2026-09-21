import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('public');
const destination = resolve('out');

if (!existsSync(source)) {
  throw new Error('The public directory is missing.');
}

rmSync(destination, { recursive: true, force: true });
mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true, force: true });

console.log('Static website copied successfully to out/.');
