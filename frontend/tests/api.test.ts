import assert from "node:assert/strict";
import test from "node:test";

import { parseResponse } from "../lib/api";

test("parseResponse returns parsed JSON for successful responses", async () => {
  const response = new Response(JSON.stringify({ status: "ok" }), {
    headers: { "content-type": "application/json" },
    status: 200
  });

  await assert.doesNotReject(async () => {
    assert.deepEqual(await parseResponse<{ status: string }>(response), { status: "ok" });
  });
});

test("parseResponse throws API detail for failed JSON responses", async () => {
  const response = new Response(JSON.stringify({ detail: "Uploaded image is too large." }), {
    headers: { "content-type": "application/json" },
    status: 413
  });

  await assert.rejects(
    () => parseResponse(response),
    (error) => error instanceof Error && error.message === "Uploaded image is too large."
  );
});

test("parseResponse falls back to status text for non-JSON failures", async () => {
  const response = new Response("not json", {
    status: 502,
    statusText: "Bad Gateway"
  });

  await assert.rejects(
    () => parseResponse(response),
    (error) => error instanceof Error && error.message === "Bad Gateway"
  );
});
