import { beforeEach, describe, expect, test } from 'vitest';
import { validate } from '../validation';
import authorValid from './testdata/author.valid.json';
import authorInvalid from './testdata/author.invalid.json';
import { schemaExpectInvalid } from './testutil';

describe('Author', () => {
  beforeEach(() => {
    validate.errors = undefined;
  });

  test('empty', () => {
    expect(() => validate('author', {})).toThrowError();
  });

  test('invalid', () => {
    authorInvalid.forEach(author => schemaExpectInvalid('author', author));
  });

  test('valid', () => {
    authorValid.forEach(author => {
      validate('author', author);
    });
  });
});
