import { beforeEach, describe, expect, test } from 'vitest';
import { validate } from '../validation';
import tagValid from './testdata/tag.valid.json';
import tagInvalid from './testdata/tag.invalid.json';
import { schemaExpectInvalid } from './testutil';

describe('Tag', () => {
  beforeEach(() => {
    validate.errors = undefined;
  });

  test('empty', () => {
    expect(() => validate('tag', {})).toThrowError();
  });

  test('invalid', () => {
    tagInvalid.forEach(tag => schemaExpectInvalid('tag', tag));
  });

  test('valid', () => {
    tagValid.forEach(tag => {
      validate('tag', tag);
    });
  });
});
