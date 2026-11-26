import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./wait-for-dev.sh", import.meta.url));

async function serve(t, getStatus) {
  const server = createServer((_, response) => {
    response.writeHead(getStatus()).end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}/`;
}

test("requires two consecutive HTTP 200 responses", async (t) => {
  const statuses = [503, 200, 503, 200, 200];
  let requests = 0;
  const url = await serve(t, () => statuses[requests++]);
  const { stdout } = await run("bash", [script, url, "10"]);
  assert.equal(requests, statuses.length);
  assert.match(stdout, /Shipboard is ready/);
});

test("fails with the last status when the homepage stays unavailable", async (t) => {
  const url = await serve(t, () => 503);
  await assert.rejects(run("bash", [script, url, "1"]), {
    code: 1,
    stderr: /Last curl result: 503/,
  });
});
