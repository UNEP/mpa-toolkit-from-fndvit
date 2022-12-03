import * as fs from 'fs';
import * as path from 'path';
import { posix } from 'path';
import { fileURLToPath } from 'url';
import type { Adapter } from '@sveltejs/kit';
import * as esbuild from 'esbuild';
import { copyPrismaEngineFiles, copyPrismaClientFiles } from '@mpa/utils/prisma/files';
import type { RouteDefinition } from '@sveltejs/kit/types/private';
import replace from 'replace-in-file';
import * as os from 'os';
import shell from 'shelljs';
import { globbySync as glob } from 'globby';
import { getPath } from './util/dirs';

const writeSharpBinaries = async (outDir: string) => {
  const tmpDir = path.resolve(os.tmpdir(), 'sharp-binaries');
  fs.mkdirSync(tmpDir, { recursive: true });
  const version = shell.exec('pnpm -w list sharp -pl', { silent: true }).stdout.match(/sharp@(?<version>\d.*?)\//)
    ?.groups?.version;
  if (!version) throw new Error('Could not find sharp version');
  shell.exec('SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp@' + version, {
    cwd: tmpDir,
    silent: true
  });
  const binary = glob('**/sharp-linux-x64.node', { cwd: tmpDir, absolute: true });
  if (binary.length !== 1) throw new Error('Could not find sharp binary');
  fs.mkdirSync(outDir, { recursive: true });
  fs.copyFileSync(binary[0], path.join(outDir, 'sharp-linux-x64.node'));
};

export default function (): Adapter {
  return {
    name: 'adapter-awscdk',
    async adapt(builder) {
      const lambda = fileURLToPath(new URL('./lambda', import.meta.url).href);
      const server = builder.getBuildDirectory('server');
      const lambdaOut = builder.getBuildDirectory('lambda');
      const client = builder.getBuildDirectory('client');
      const prismaClient = builder.getBuildDirectory('prisma-client');
      const prismaEngine = builder.getBuildDirectory('prisma-engine');
      const router = builder.getBuildDirectory('router');
      const tmp = builder.getBuildDirectory('tmp');

      builder.rimraf(server);
      builder.rimraf(tmp);
      builder.mkdirp(tmp);
      builder.mkdirp(server);
      builder.mkdirp(router);
      builder.writeClient(client);

      await builder.createEntries(route => {
        const getId = (route: RouteDefinition) => {
          if (route.id.startsWith('/api') || route.id === '/globe.svg') return 'api';
          if (route.id.startsWith('/cms')) return 'cms';
          return 'rest';
        };
        const id = getId(route);
        return {
          id,
          filter: other => id === getId(other),
          complete: entry => {
            const tmpFnDir = path.join(tmp, 'lambda', id);
            builder.mkdirp(tmpFnDir);
            const relativePath = posix.relative(tmpFnDir, builder.getServerDirectory());

            // write the lambda entrypoint
            builder.copy(`${lambda}/server.js`, `${tmpFnDir}/index.js`, {
              replace: {
                SERVER: `${relativePath}/index.js`,
                MANIFEST: './manifest.js'
              }
            });

            // write the manifest
            fs.writeFileSync(
              `${tmpFnDir}/manifest.js`,
              `export const manifest = ${entry.generateManifest({ relativePath })};\n\n`
            );

            const outDir = path.join(lambdaOut, id);
            // build
            esbuild.buildSync({
              entryPoints: [`${tmpFnDir}/index.js`],
              outfile: `${outDir}/index.js`,
              format: 'cjs',
              bundle: true,
              target: 'node16',
              platform: 'node',
              minify: true,
              external: ['aws-sdk']
            });

            builder.copy(getPath('packages/db/prisma/schema.prisma'), `${outDir}/schema.prisma`);

            const results = replace.sync({
              files: `${outDir}/index.js`,
              from: '../build/Release/sharp-',
              to: './sharp-'
            });

            if (results[0].hasChanged) writeSharpBinaries(outDir);
          }
        };
      });

      await copyPrismaEngineFiles(prismaEngine, {
        query: /libquery_engine/,
        other: /(migration|prisma-fmt|introspection)/
      });

      await copyPrismaClientFiles(prismaClient);

      const buildRouter = async () => {
        builder.copy(`${lambda}/router.js`, `${tmp}/_router.js`, { replace: { STATIC: './static.js' } });

        const staticFiles = [...getAllFiles(builder.getClientDirectory()), ...builder.prerendered.paths];

        fs.writeFileSync(`${tmp}/static.js`, `export const staticFiles = new Set(${JSON.stringify(staticFiles)});\n`);

        esbuild.buildSync({
          entryPoints: [`${tmp}/_router.js`],
          outfile: `${router}/index.js`,
          format: 'cjs',
          bundle: true,
          platform: 'node'
        });
      };

      await buildRouter();

      builder.log.minor('Done.');
    }
  };
}

const getAllFiles = function (dirPath: string, basePath?: string, arrayOfFiles: string[] = []) {
  basePath = basePath || dirPath;

  fs.readdirSync(dirPath).forEach(function (file) {
    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + '/' + file, basePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join('/', dirPath.replace(basePath!, ''), '/', file));
    }
  });

  return arrayOfFiles;
};
