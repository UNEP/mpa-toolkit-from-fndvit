import { beforeAll, describe, expect, test } from "vitest";
import { ajv, validate } from "./validation";
import keyValueValid from "./testdata/key-value.valid.json";


describe("KeyValue", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("schemas exist", () => {
    expect(ajv.getSchema('keyValue')).toBeTruthy();
  });

  test("valid value", () => {
    keyValueValid.forEach(v => validate("keyValue", v));
  });

  test("empty", () => {
    expect(() => validate("keyValue", {})).toThrowError();
  });

});
