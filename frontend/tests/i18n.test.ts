import assert from "node:assert/strict";
import test from "node:test";

import { dictionary } from "../lib/i18n";

test("Vietnamese and English dictionaries expose the same translation keys", () => {
  assert.deepEqual(Object.keys(dictionary.vi).sort(), Object.keys(dictionary.en).sort());
});

test("Vietnamese dictionary contains readable UTF-8 text", () => {
  assert.equal(dictionary.vi.navIdentify, "Nhận diện");
  assert.equal(dictionary.vi.loginTitle, "Đăng nhập");
  assert.equal(dictionary.vi.unknown, "Không rõ");
});
