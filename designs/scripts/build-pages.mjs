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
  ['direction-h2-operating-signal/code', 'h2'],
  ['direction-h3-caprae-tech-motion/code', 'h3'],
  ['direction-r-resend-structure/code', 'r'],
  // R with the Section Lab content: one build, three pages (r-lab/a/, b/, c/), plus a picker
  ['direction-r-lab/code', 'r-lab'],
];

// New gallery: the Dala-technique builds in ../builds. They sit outside this workspace,
// so each installs its own lockfile before building.
const dalaBuilds = [
  ['../builds/dala-caprae', 'dala/v1'],
  ['../builds/dala-caprae-wordmark', 'dala/wordmark'],
  ['../builds/dala-draft-one', 'dala/draft-one'],
  ['../builds/dala-modified-particles', 'dala/modified-particles'],
  // Section Lab drafts: they import ../dala-lab-engine, whose only dependency (three) resolves
  // to each draft's own copy through its vite.config alias
  ['../builds/dala-lab-a', 'dala/lab-a'],
  ['../builds/dala-lab-b', 'dala/lab-b'],
  ['../builds/dala-lab-c', 'dala/lab-c'],
  // the user's section picks on the Dala engine (D-077); R's version is r-lab/final-draft-1/
  ['../builds/dala-final-draft-1', 'final-draft-1'],
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });

const run = (cmd, cwd, env = process.env) => {
  const result = Bun.spawnSync({ cmd, cwd, env, stdout: 'inherit', stderr: 'inherit' });
  if (result.exitCode !== 0) process.exit(result.exitCode);
};

for (const [project, route] of dalaBuilds) {
  console.log(`Building ${route} from ${project}`);
  run([process.execPath, 'install', '--frozen-lockfile'], join(root, project));
  run([process.execPath, 'run', 'build'], join(root, project), { ...process.env, BASE_PATH: `${prefix}/${route}/` });
  cpSync(join(root, project, 'dist'), join(output, route), { recursive: true });
}

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

// Landing = new gallery (Dala builds); the earlier directions keep their routes, listed at /old/.
cpSync(join(root, 'gallery/index.html'), join(output, 'index.html'));
mkdirSync(join(output, 'old'), { recursive: true });
cpSync(join(root, 'gallery/old/index.html'), join(output, 'old/index.html'));
// Pages has no rewrite rule, so client routes inside a direction land on this.
cpSync(join(root, 'gallery/404.html'), join(output, '404.html'));
cpSync(join(root, '_archive/option-1-institutional/code'), join(output, 'archive/option-1'), { recursive: true });
cpSync(join(root, '_archive/option-4-editorial-hybrid/code'), join(output, 'archive/option-4'), { recursive: true });
cpSync(join(root, '_archive/direction-e-origination-v1/code'), join(output, 'archive/e-v1'), { recursive: true });

console.log(`GitHub Pages artifact assembled at ${output}`);
