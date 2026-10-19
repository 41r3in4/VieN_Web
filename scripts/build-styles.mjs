import fs from 'node:fs/promises';
import path from 'node:path';
import { compile } from '@tailwindcss/node';
import { Scanner } from '@tailwindcss/oxide';

const root = process.cwd();
const input = path.join(root, 'src/app/globals.css');
const source = await fs.readFile(input, 'utf8');
const compiler = await compile(source, { base: path.dirname(input), onDependency() {} });
const scanner = new Scanner({ sources: [{ base: root, pattern: 'src/**/*.{ts,tsx}', negated: false }] });
await fs.writeFile(path.join(root, 'src/app/generated.css'), compiler.build(scanner.scan()));
console.log('Compiled heritage styles.');
