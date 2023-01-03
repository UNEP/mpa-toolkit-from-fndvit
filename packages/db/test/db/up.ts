import compose from 'docker-compose';

const opts = {
  composeOptions: ['-p mpa'],
  config: ['docker-compose.yml']
};

async function initDb() {
  await compose.upOne('db-test', { ...opts, commandOptions: ['--force-recreate'] });
  await compose.exec('db-test', 'bash /data/load.sh', opts);
}

initDb()
  .then(() => console.log('done'))
  .catch(err => console.error(err));
