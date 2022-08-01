import { beforeAll, describe, expect, test } from "vitest";
import { ajv, validate } from "./validation";
import pageOrderingInvalidComponents from './testdata/page-ordering.invalid.components.json';
import { schemaExpectInvalid } from "./testutil";


describe("PageOrdering", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("schemas exist", () => {
    expect(ajv.getSchema('pageOrdering')).toBeTruthy();
    expect(ajv.getSchema('pageOrdering#/$defs/components')).toBeTruthy();
  });

  test("invalid components", () => {
    pageOrderingInvalidComponents.forEach(component => schemaExpectInvalid("page#/$defs/components", component));
  });

  test("empty", () => {
    expect(() => validate("pageOrdering", {})).toThrowError();
  });

});
