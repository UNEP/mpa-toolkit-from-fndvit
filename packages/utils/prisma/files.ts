import path from 'path';
import shell from 'shelljs';
import fs from 'fs-extra';
import { globby } from 'globby';
import projectRoot from '../projectRoot';

export async function copyPrismaEngineFiles(dest: string) {
  const cache = `${await projectRoot()}/node_modules/.cache/prisma@4.2.1`;

  fs.mkdirpSync(dest);

  if (!fs.pathExistsSync(cache)) {
    fs.mkdirpSync(cache);
    shell.exec(`PRISMA_CLI_BINARY_TARGETS=rhel-openssl-1.0.x npm install --prefix ${cache} prisma@4.2.1`, {
      silent: true
    });
  }

  const engineFiles = await globby(`${cache}/**/engines/*rhel*`);
  engineFiles.forEach(file => shell.cp(file, dest));
}

export async function copyPrismaClientFiles(dest: string) {
  const dir = await globby('node_modules/**/.prisma/client', {
    cwd: await projectRoot(),
    dot: true,
    onlyDirectories: true,
    absolute: true
  });

  if (!dir.length) throw new Error('Could not find prisma client directory');

  const files = await globby('**/*', { cwd: dir[0], ignore: ['**/*.node'] });

  fs.mkdirSync(dest, { recursive: true });
  files.forEach(file => {
    fs.mkdirpSync(path.dirname(`${dest}/${file}`));
    fs.copyFileSync(`${dir[0]}/${file}`, `${dest}/${file}`);
  });
}
