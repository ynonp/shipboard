import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeTag } from "./tags";

test("normalizeTag", () => {
  assert.equal(normalizeTag("  #Mobile App "), "mobile-app");
  assert.equal(normalizeTag("   "), "");
  assert.equal(normalizeTag("x".repeat(50)).length, 30);
});
