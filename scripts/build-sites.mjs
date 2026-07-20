import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const client = join(dist, 'client');
const server = join(dist, 'server');

rmSync(dist, { recursive: true, force: true });
mkdirSync(join(client, 'photos'), { recursive: true });
mkdirSync(server, { recursive: true });

const index = readFileSync(join(root, 'index.html'), 'utf8')
    .replace(/\n\s*<script defer src="\/_vercel\/insights\/script\.js"><\/script>/, '');

writeFileSync(join(client, 'index.html'), index);

['styles.css', 'noscript.css', 'script.js', 'og.png'].forEach((file) => {
    copyFileSync(join(root, file), join(client, file));
});

copyFileSync(join(root, 'photos', 'headshot.jpeg'), join(client, 'photos', 'headshot.jpeg'));
copyFileSync(join(root, 'sites', 'worker.js'), join(server, 'index.js'));

console.log('Sites build ready in dist/');
