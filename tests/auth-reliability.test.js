import test from "node:test";
import assert from "node:assert/strict";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { authErrorMessage, selectAccount } from "../src/auth/accountPolicy.js";
import { callMsGraph, GraphError } from "../src/auth/graph.js";
import { loadProfile, needsReconnect } from "../src/auth/profile.js";

const first = { homeAccountId: "first", localAccountId: "one", tenantId: "tenant" };
const second = { homeAccountId: "second", localAccountId: "two", tenantId: "tenant" };

test("use the active cached account, automatically select a sole account, never guess among multiple accounts", () => {
  assert.equal(selectAccount([first, second], { ...second }), second);
  assert.equal(selectAccount([first], null), first);
  assert.equal(selectAccount([first], second), first);
  assert.equal(selectAccount([first, second], null), null);
  assert.equal(selectAccount([first, second], { ...first, tenantId: "other" }), null);
  assert.equal(selectAccount([], first), null);
});

test("popup cancellation is quiet; other authentication failures have safe actionable messages", () => {
  assert.equal(authErrorMessage({ errorCode: "user_cancelled" }, "signIn"), null);
  assert.match(authErrorMessage({ errorCode: "popup_window_error" }, "signIn"), /Allow popups/);
  assert.match(authErrorMessage({ errorCode: "interaction_in_progress" }, "signIn"), /Wait/);
  assert.match(authErrorMessage(new Error("sensitive server message"), "signOut"), /session may still be active/);
  assert.match(authErrorMessage(null, "reconnect"), /reconnection failed/);
  assert.ok(!authErrorMessage(new Error("sensitive server message"), "signIn").includes("sensitive"));
});

test("Graph requests carry the token and cancellation signal and return valid profile data", async t => {
  const controller = new AbortController();
  const profile = { id: "1", givenName: "Test", surname: null };
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.match(url, /^https:\/\/graph.microsoft.com\/v1.0\/me/);
    assert.equal(options.headers.Authorization, "Bearer example-token");
    assert.equal(options.signal, controller.signal);
    return Response.json(profile);
  });
  assert.deepEqual(await callMsGraph("example-token", controller.signal), profile);
});

test("Graph HTTP failures retain status without trusting error bodies", async t => {
  for (const status of [401, 403, 429, 500]) {
    t.mock.method(globalThis, "fetch", async () => new Response("not JSON; sensitive", { status }));
    await assert.rejects(callMsGraph("token"), error =>
      error instanceof GraphError && error.status === status && !error.message.includes("sensitive"));
  }
});

test("network failures and aborts propagate rather than becoming undefined successes", async t => {
  for (const failure of [new TypeError("Network unavailable"), new DOMException("Aborted", "AbortError")]) {
    t.mock.method(globalThis, "fetch", async () => { throw failure; });
    await assert.rejects(callMsGraph("token"), error => error === failure);
  }
});

test("invalid JSON and invalid profile shapes are explicit failures", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>error</html>"));
  await assert.rejects(callMsGraph("token"), /invalid JSON/);
  for (const profile of [null, [], {}, { id: "" }, { id: "1", givenName: {} }]) {
    t.mock.method(globalThis, "fetch", async () => Response.json(profile));
    await assert.rejects(callMsGraph("token"), /invalid profile/);
  }
});

test("profile loading requests a token for the selected account", async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async () => Response.json({ id: "1" }));
  const instance = {
    acquireTokenSilent: async request => {
      assert.equal(request.account, second);
      assert.deepEqual(request.scopes, ["User.Read"]);
      return { accessToken: "example" };
    },
  };
  assert.deepEqual(await loadProfile(instance, second, ["User.Read"], controller.signal), { id: "1" });
});

test("cleanup during silent token acquisition prevents a stale Graph request", async t => {
  const controller = new AbortController();
  const fetchMock = t.mock.method(globalThis, "fetch", async () => { throw new Error("Must not fetch"); });
  let resolveToken;
  const instance = { acquireTokenSilent: () => new Promise(resolve => { resolveToken = resolve; }) };
  const pending = loadProfile(instance, first, ["User.Read"], controller.signal);
  controller.abort();
  resolveToken({ accessToken: "obsolete" });
  await assert.rejects(pending, { name: "AbortError" });
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("silent token errors propagate and only interaction/401 failures require reconnection", async () => {
  const failure = new InteractionRequiredAuthError("interaction_required");
  await assert.rejects(loadProfile({
    acquireTokenSilent: async () => { throw failure; },
  }, first, ["User.Read"], new AbortController().signal), error => error === failure);
  assert.equal(needsReconnect(failure), true);
  assert.equal(needsReconnect(new GraphError("Unauthorized", 401)), true);
  for (const error of [new GraphError("Forbidden", 403), new GraphError("Unavailable", 503), new TypeError("Offline")]) {
    assert.equal(needsReconnect(error), false);
  }
});
