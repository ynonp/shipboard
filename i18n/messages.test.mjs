import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const locales = ["en", "he", "fr", "ru", "ar", "de", "es"];
const load = (l) =>
  JSON.parse(readFileSync(new URL(`./messages/${l}.json`, import.meta.url)));

function keys(obj, prefix = "") {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

function placeholders(s) {
  return [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
}

for (const l of locales.filter((l) => l !== "en")) {
  test(`${l} has the same keys and placeholders as en`, () => {
    const en = load("en");
    const other = load(l);
    assert.deepEqual(keys(other).sort(), keys(en).sort());
    for (const k of keys(en)) {
      const get = (o) => k.split(".").reduce((a, p) => a[p], o);
      assert.equal(placeholders(get(other)), placeholders(get(en)), k);
    }
  });
}
