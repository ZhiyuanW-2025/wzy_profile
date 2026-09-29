import test from "node:test";
import assert from "node:assert/strict";
import { loadLocalTS } from "./load-local-ts.mjs";
const { sendVisitorMessage: send, createVisitorLimiter, mailConfigured, visitorRecipient } = await loadLocalTS("server/visitor-mail.ts");
const payload = { name: " 小林 ", emoji: "🙂", message: "你好，城市！", submissionId: "00000000-0000-4000-8000-000000000000", website: "" };
const credentials = { RESEND_API_KEY: "test-only-placeholder", CITY_MAIL_FROM: "City <city@example.com>" };
const request = (body = payload, headers = {}) => new Request("http://localhost/api/visitors", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost", ...headers }, body: JSON.stringify(body),
});
const yes = () => true;

test("missing credentials explicitly return 503 and never attempt delivery", async () => {
  assert.equal(mailConfigured({}), false);
  let calls = 0;
  const response = await send(request(), {}, async () => { calls++; throw new Error("must not send"); }, yes);
  assert.equal(response.status, 503); assert.equal(calls, 0);
  assert.equal((await response.json()).code, "MAIL_UNCONFIGURED");
});
test("server fixes recipient and sends name/emoji/message as plain text, with stable retry key", async () => {
  const calls = [];
  const transport = async (url, init) => { calls.push({ url, ...init }); return Response.json({ id: "test-mail" }); };
  const content = { ...payload, message: "<script>alert('not HTML')</script>", to: "attacker@example.com", from: "fake@example.com" };
  for (let i = 0; i < 2; i++) {
    const response = await send(request(content), credentials, transport, yes);
    assert.deepEqual(await response.json(), { ok: true, status: "accepted" });
  }
  const body = JSON.parse(calls[0].body);
  assert.equal(visitorRecipient, "15216632116@163.com"); assert.deepEqual(body.to, [visitorRecipient]);
  assert.equal(body.from, credentials.CITY_MAIL_FROM); assert.equal(body.html, undefined);
  assert.ok(body.text.includes(content.message) && body.text.includes(payload.emoji));
  assert.ok(body.text.includes("名字：小林\n"));
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].headers["Idempotency-Key"], calls[1].headers["Idempotency-Key"]);
  assert.equal(calls[0].body, calls[1].body, "Idempotent retries must use identical payloads");
});
test("origin, content type, emoji, size, empty text and honeypot are validated before sending", async () => {
  const noNetwork = async () => { throw new Error("validation must prevent network"); };
  const cases = [
    [request(payload, { Origin: "https://elsewhere.example" }), 403],
    [request(payload, { "Content-Type": "text/plain" }), 415],
    [request({ ...payload, name: undefined }), 400],
    [request({ ...payload, name: " " }), 400],
    [request({ ...payload, name: "林".repeat(33) }), 400],
    [request({ ...payload, name: "小林\n新的一行" }), 400],
    [request({ ...payload, emoji: "not-an-option" }), 400],
    [request({ ...payload, message: " " }), 400],
    [request({ ...payload, message: "x".repeat(281) }), 400],
    [request({ ...payload, message: "x".repeat(5000) }), 400],
    [request({ ...payload, website: "bot.example" }), 400],
    [request({ ...payload, submissionId: "anything" }), 400],
    [request(null), 400],
  ];
  for (const [req, status] of cases) assert.equal((await send(req, credentials, noNetwork, yes)).status, status);
});
test("all eighteen emoji choices including the six new moods are accepted", async () => {
  const { cityVisitor } = await loadLocalTS("content/city-visitor.ts");
  for (const { value } of cityVisitor.emojis) {
    const response = await send(request({ ...payload, emoji: value }), credentials, async () => Response.json({ id: "mock-only" }), yes);
    assert.equal(response.status, 200);
  }
});
test("provider rejection, invalid confirmation and timeout never report success", async () => {
  for (const transport of [async () => new Response("no", { status: 403 }), async () => Response.json({}), async () => { throw new Error("timeout"); }]) {
    const response = await send(request(), credentials, transport, yes);
    assert.equal(response.status, 502); assert.equal((await response.json()).ok, undefined);
  }
});
test("abuse limiter caps attempts, expires old windows and rejects excess traffic", async () => {
  const allow = createVisitorLimiter();
  for (let i = 0; i < 5; i++) assert.equal(allow("test-ip", 100), true);
  assert.equal(allow("test-ip", 101), false); assert.equal(allow("other-ip", 101), true);
  assert.equal(allow("test-ip", 600_101), true);
  assert.equal((await send(request(), credentials, fetch, () => false)).status, 429);
});
