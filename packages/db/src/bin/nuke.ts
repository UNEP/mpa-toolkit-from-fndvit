import chalk from 'chalk';
import { MpaDatabase } from '../db';
import { env } from '../env';
import '../lib/cli';
import { reset } from '../lib/reset';
import { Seeder } from '../lib/seed';

const log = console.log;

async function nuke(db: MpaDatabase) {
  log(chalk.green('Resetting database...'));
  try {
    await reset(db.prisma);
  } catch (e) {
    log(chalk.red('Error resetting database:'));
    log(e);
    process.exit(1);
  }

  const seeder = new Seeder(db);
  log(chalk.green('Seeding database...'));
  try {
    await seeder.seed(true);
  } catch (e) {
    log(chalk.red('Error seeding database:'));
    log(e);
    process.exit(1);
  }
}

async function main() {
  const db = new MpaDatabase(env.DATABASE_URL);
  try {
    await nuke(db);
  } finally {
    await db.disconnect();
  }
}

main().catch(console.error);
