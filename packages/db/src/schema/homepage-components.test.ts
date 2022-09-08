import { beforeEach, describe, expect, test } from 'vitest';
import { ajv, validate } from '../validation';
import valid from './testdata/homepagecomponents.valid.json';
import invalid from './testdata/homepagecomponents.invalid.json';
import { schemaExpectInvalid } from './testutil';

describe('Homepage components', () => {
  beforeEach(() => {
    validate.errors = undefined;
  });

  test('schema exists', () => {
    expect(ajv.getSchema('homepage-components')).toBeTruthy();
  });

  test('valid', () => {
    valid.forEach(v => validate('homepage-components', v));
  });

  test('invalid', () => {
    invalid.forEach(author => schemaExpectInvalid('homepage-components', author));
  });
});
