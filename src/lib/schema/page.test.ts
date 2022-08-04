import { beforeAll, describe, expect, test } from "vitest";
import { ajv, validate } from "./validation";
import pageValidChapter from './testdata/page.valid.chapter.json';
import pageValidCaseStudy from './testdata/page.valid.casestudy.json';
import pageInvalidTags from './testdata/page.invalid.tags.json';
import pageInvalidCaseStudies from './testdata/page.invalid.casestudies.json';
import pageInvalidChapters from './testdata/page.invalid.chapters.json';
import pageInvalid from './testdata/page.invalid.json';
import pageInvalidMilestones from './testdata/page.invalid.milestones.json';
import { schemaExpectInvalid } from "./testutil";

describe("Page", () => {

  beforeAll(() => {
    validate.errors = undefined;
  });

  test("schemas exist", () => {
    expect(ajv.getSchema('page')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/chapter')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/caseStudy')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/tag')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/milestones')).toBeTruthy();
    expect(ajv.getSchema('page#/$defs/keyLearnings')).toBeTruthy();
  });

  test("valid chapter", () => {
    validate("page", pageValidChapter);
  });

  test("valid casestudy", () => {
    validate("page", pageValidCaseStudy);
  });

  test("empty", () => {
    expect(() => validate("page", {})).toThrowError();
  });

  test("invalid tags", () => {
    pageInvalidTags.forEach(tag => schemaExpectInvalid("page#/$defs/tag", tag));
  });

  test("invalid case studies", () => {
    pageInvalidCaseStudies.forEach(cs => schemaExpectInvalid("page#/$defs/caseStudy", cs));
  });

  test("invalid chapters", () => {
    pageInvalidChapters.forEach(chapter => schemaExpectInvalid("page#/$defs/chapter", chapter));
  });

  test("invalid pages", () => {
    pageInvalid.forEach(page => schemaExpectInvalid("page", page));
  });

  test("invalid milestones", () => {
    pageInvalidMilestones.forEach(ms => schemaExpectInvalid("page#/$defs/milestones", ms));
  });

});
