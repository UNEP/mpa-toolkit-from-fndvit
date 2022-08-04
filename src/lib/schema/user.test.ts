import { beforeAll, describe, expect, test } from 'vitest';
import { validate } from './validation';
import userValid from './testdata/user.valid.json';
import userInvalid from './testdata/user.invalid.json';
import { schemaExpectInvalid } from './testutil';

describe('User', () => {
  beforeAll(() => {
    validate.errors = undefined;
  });

  test('empty', () => {
    expect(() => validate('user', {})).toThrowError();
  });

  test('invalid', () => {
    userInvalid.forEach((user) => schemaExpectInvalid('user', user));
  });

  test('valid', () => {
    userValid.forEach((user) => {
      validate('user', user);
    });
  });
});
