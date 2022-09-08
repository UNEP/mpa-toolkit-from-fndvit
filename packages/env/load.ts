import path from 'path';
import * as dotenv from 'dotenv';

const IS_LAMBDA = process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV;
if (!IS_LAMBDA) {
  const filename = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.local';
  dotenv.config({ path: path.join(process.cwd(), '../..', filename) });
}
