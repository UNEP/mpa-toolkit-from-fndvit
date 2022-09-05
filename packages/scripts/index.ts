import path from 'path';
import got, { HTTPError } from 'got';
import { getEnvFromFile } from '@mpa/env';
import { logger } from '@mpa/log';
import glob from 'glob';

const log = logger('SCRIPTS');

const env = getEnvFromFile('staging', {
  FASTLY_API_KEY: true,
  FASTLY_SERVICE_ID: true,
  FASTLY_ROUTING_DICTIONARY_ID: true
});

const client = got.extend({
  prefixUrl: `https://api.fastly.com/service/${env.FASTLY_SERVICE_ID}/`,
  headers: {
    'Fastly-Key': env.FASTLY_API_KEY,
    Accept: 'application/json'
  }
});

export async function main() {
  const cwd = path.resolve('../web/.svelte-kit/client/');
  log.info(`Globbing ${cwd}/**/*.js`);
  const files = glob.sync('**/*', { cwd, nodir: true });

  const body = {
    items: files.map(file => ({
      op: 'upsert',
      item_key: `/${file}`,
      item_value: 'static'
    }))
  };

  try {
    const response = await client.patch(`dictionary/${env.FASTLY_ROUTING_DICTIONARY_ID}/items`, {
      json: body
    });
    log.info(`${response.statusCode} - ${response.statusMessage}`);
  } catch (err) {
    if (err instanceof HTTPError) {
      const { statusCode, statusMessage } = err.response;
      log.error(err.response.url);
      log.error(`${statusCode} - ${statusMessage}`);
    } else {
      log.error(err);
    }
  }
}

main()
  .catch(err => log.error(err))
  .then(() => log.info('done'));
