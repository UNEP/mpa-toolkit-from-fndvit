import path from 'path';
import * as dotenv from 'dotenv';

const envPath = (file: string) => path.join(process.cwd(), '../..', file);

dotenv.config({ path: envPath('.env.base') });
dotenv.config({ path: envPath('.env.local'), override: true });

if (process.env.TEST) dotenv.config({ path: envPath('.env.test'), override: true });
