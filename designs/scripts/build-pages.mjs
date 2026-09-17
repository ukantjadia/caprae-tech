import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(root, '.pages');
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'caprae-tech';
const prefix = `/${repository}`;

const builds = [
  ['_archive/direction-a-specimen-sheet/code', 'a'],
  ['direction-b-tearsheet/code', 'b'],
  ['direction-c-event-display/code', 'c'],
  ['direction-d-the-core/code', 'd'],
  ['direction-e-origination/code', 'e'],
  ['direction-f-load-bearing/code', 'f'],
  ['direction-e-variants/code', 'e-variants'],
  ['direction-next-four/code', 'next'],
  ['direction-g-glacier/code', 'g'],
  ['direction-h-caprae-tech/code', 'h'],
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

for (const [project, route] of builds) {
  console.log(`Building ${route} from ${project}`);
  const result = Bun.spawnSync({
    cmd: [process.execPath, 'run', 'build'],
    cwd: join(root, project),
    env: { ...process.env, BASE_PATH: `${prefix}/${route}/` },
    stdout: 'inherit',
    stderr: 'inherit',
  });
  if (result.exitCode !== 0) process.exit(result.exitCode);
  cpSync(join(root, project, 'dist'), join(output, route), { recursive: true });
}

cpSync(join(root, 'gallery/index.html'), join(output, 'index.html'));
// Pages has no rewrite rule, so client routes inside a direction land on this.
cpSync(join(root, 'gallery/404.html'), join(output, '404.html'));
cpSync(join(root, '_archive/option-1-institutional/code'), join(output, 'archive/option-1'), { recursive: true });
cpSync(join(root, '_archive/option-4-editorial-hybrid/code'), join(output, 'archive/option-4'), { recursive: true });
cpSync(join(root, '_archive/direction-e-origination-v1/code'), join(output, 'archive/e-v1'), { recursive: true });

console.log(`GitHub Pages artifact assembled at ${output}`);
