import { resolve as resolvePath } from 'path';

import { defineConfig } from 'vite';
import { rm, mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'path'
import { CopyFilePlugin } from './plugins';

const __dirname = new URL('.', import.meta.url).pathname;
const getEntries = (entries): any => { const out = {}; entries.forEach(entry => { out[entry.name] = entry.source; }); return out; };

const entries = [
  { name: 'index', source: './ts/index.ts', type: 'js' },
  { name: 'style', source: './scss/style.ts', type: 'css' },
];

export default defineConfig({
  plugins: [
    ...entries.map(entry => CopyFilePlugin({
      sourceFileName: entry.type === 'css' ? `${entry.name}.css` : entry.name,
      absolutePathToDestination: entry.type === 'css' ? resolvePath(__dirname, '../dist/style/') : resolvePath(__dirname, '../dist/js/'),
    })),
    {
      name: "Cleaning theme folder",
      async buildStart() {
        await rm(resolve(__dirname, '../dist/js'), { recursive: true, force: true });
        await rm(resolve(__dirname, '../dist/style'), { recursive: true, force: true });
        await mkdir(resolve(__dirname, '../dist/js'), { recursive: true });
        await mkdir(resolve(__dirname, '../dist/style'), { recursive: true });
      }
    },
    {
      name: "Create Manifest",
      writeBundle: async (data: any, output) => {
        const out = {};
        entries.map(entry => {
          const isStyle = entry.type === 'css';
          const sourceName = isStyle ? `${entry.name}.css` : entry.name;
          const destination = isStyle ? '/dist/style' : '/dist/js';
          const item = Object.values(output).find(({ name }) => name === sourceName);
          if (!item) return;
          out[sourceName] = item.fileName.replace('assets', destination);
        });
        const jsonData = JSON.stringify(out);
        await rm(resolve(__dirname, '../manifest.json'), { force: true });
        await writeFile(resolve(__dirname, '../manifest.json'), jsonData);
      }
    },
  ],
  build: {
    target: 'modules',
    outDir: '.vite-dist',
    rollupOptions: { input: getEntries(entries) },
  },
  server: {
    port: 1337,
    host: '0.0.0.0',
  },
});
