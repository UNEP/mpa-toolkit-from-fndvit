import '../lib/cli';
import env from '@mpa/env';
import chalk from 'chalk';
import { MpaDatabase } from '../db';
import { reset } from '../lib';

const log = console.log;

async function main() {
  const db = new MpaDatabase(env.DATABASE_URL);

  log(chalk.green('Resetting database...'));
  try {
    await reset(db.prisma);
  } catch (e) {
    log(chalk.red('Error resetting database:'));
    log(e);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
