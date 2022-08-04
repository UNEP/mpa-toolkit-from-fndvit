import { logger } from "../log";
import Ajv from "ajv";
import type { AnyValidateFunction } from "ajv/dist/core";
import * as schemaPage from "./page.json";
import * as schemaUser from "./user.json";
import * as schemaTag from "./tag.json";
import * as schemaPageOrdering from "./page-ordering.json";
import * as schemaAuthor from "./author.json";

export const ajv = new Ajv({removeAdditional: true});

const log = logger.child({scope: 'validate'});

ajv.addSchema(schemaPage);
ajv.addSchema(schemaUser);
ajv.addSchema(schemaTag);
ajv.addSchema(schemaPageOrdering);
ajv.addSchema(schemaAuthor);

interface Validate {
  (schema: string, data: unknown): void;
  errors?: AnyValidateFunction<unknown>['errors'];
}

export const validate: Validate = (schema: string, data: unknown) => {
  const _validate = ajv.getSchema(schema);
  if (!_validate) throw new Error(`Schema not found: ${schema}`);
  const valid = _validate(data);
  if (!valid) {
    validate.errors = _validate.errors;
    log.error(_validate.errors);
    log.error(JSON.stringify(data, null, 2));
    throw new Error(_validate.errors.map(e => e.message).join(', '));
  }
};
