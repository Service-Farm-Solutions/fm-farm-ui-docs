import test from "node:test";
import assert from "node:assert/strict";
import { shouldBypassAuth } from "../src/auth/bypassPolicy.js";

const local = { dev: true, production: false, flag: "true", hostname: "localhost" };

test("explicit opt-in enables bypass only on exact loopback hosts in development", () => {
  for (const hostname of ["localhost", "127.0.0.1", "::1", "[::1]"]) {
    assert.equal(shouldBypassAuth({ ...local, hostname }), true);
  }
});

test("missing, false, and non-exact flag values never enable bypass", () => {
  for (const flag of [undefined, "", "false", "TRUE", "1", true]) {
    assert.equal(shouldBypassAuth({ ...local, flag }), false);
  }
});

test("production and non-development environments never bypass, even on localhost", () => {
  for (const dev of [true, false, undefined]) {
    assert.equal(shouldBypassAuth({ ...local, dev, production: true }), false);
  }
  assert.equal(shouldBypassAuth({ ...local, dev: false }), false);
  assert.equal(shouldBypassAuth({ ...local, production: undefined }), false);
});

test("LAN, deployed and lookalike hostnames never bypass authentication", () => {
  for (const hostname of ["192.168.1.10", "0.0.0.0", "docs.service.farm", "localhost.example.com", "127.0.0.1.example.com", ""]) {
    assert.equal(shouldBypassAuth({ ...local, hostname }), false);
  }
});
