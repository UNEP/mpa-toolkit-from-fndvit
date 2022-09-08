import type { Handler } from 'aws-lambda';
import { MpaDatabase } from '@mpa/db';
import { DevSeeder, ProdSeeder, reset, prismaCmd } from '@mpa/db/src/lib';
import { logger } from '@mpa/log';
import { getEnv } from '@mpa/env';

export const env = getEnv({ DATABASE_URL: true });

const log = logger('migration-runner');
// example cmd to invoke using aws cli:
// aws lambda invoke --function-name AppStack-MigrationRunner07C61515-63HtCcSdD3K6 response.json

export const handler: Handler = async event => {
  // Available commands are:
  //   deploy: create new database if absent and apply all migrations to the existing database.
  //   reset: delete existing database, create new one, and apply all migrations. NOT for production environment.
  // If you want to add commands, please refer to: https://www.prisma.io/docs/concepts/components/prisma-migrate
  const command: string = event.command ?? 'deploy';

  const db = new MpaDatabase(env.DATABASE_URL);

  log.info(`Running migration command: ${command}`);

  if (command === 'seed') {
    const seeder = new ProdSeeder(db);
    await seeder.migrate();
  } else if (command === 'seed:dev') {
    const seeder = new DevSeeder(db);
    await seeder.seed();
  } else if (command === 'nuke') {
    const seeder = new ProdSeeder(db);
    await reset(db.prisma);
    await seeder.migrate();
  } else if (command === 'reset') {
    await prismaCmd('migrate reset --force --skip-generate');
  } else if (command === 'deploy') {
    await prismaCmd('migrate deploy');
  }

  log.info(`Finished`);
};
