import './load';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';
import type { Expand, Without } from '@mpa/utils';

type Environment = 'test' | 'dev' | 'staging' | 'prod';

type EnvConfig = { [key: string]: boolean };
type ConfigToEnvRequired<C extends EnvConfig> = { [K in keyof C]: C[K] extends true ? string : never };
type ConfigToEnvOptional<C extends EnvConfig> = { [K in keyof C]?: C[K] extends false ? string : never };
export type ConfigToEnvClean<C extends EnvConfig> = Expand<
  Without<never, ConfigToEnvRequired<C>> & Without<never, ConfigToEnvOptional<C>>
>;

export function processEnv(env: Record<string, string>, config: EnvConfig) {
  const required = Object.entries(config)
    .filter(([, value]) => value)
    .map(([key]) => key);

  const optional = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const missing = {
    required: required.filter(k => !env[k]),
    optional: optional.filter(k => !env[k])
  };

  if (missing.required.length > 0) {
    const msg = `Required env vars missing: ${missing.required.join(', ')}`;
    console.error(msg);
    throw new Error(msg);
  }

  return [...required, ...optional].filter(k => env[k]).reduce((acc, k) => ({ ...acc, [k]: env[k] }), {});
}

export function getEnv<C extends EnvConfig>(config: C) {
  return processEnv(process.env as Record<string, string>, config) as ConfigToEnvClean<C>;
}

export function getEnvFromFile<C extends EnvConfig>(env: Environment, config: C) {
  const _env = dotenv.parse(fs.readFileSync(path.join(process.cwd(), '../..', `.env.${env}`), 'utf-8'));
  return processEnv(_env as Record<string, string>, config) as ConfigToEnvClean<C>;
}
