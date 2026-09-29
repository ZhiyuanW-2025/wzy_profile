import { cityVisitor } from "../content/city-visitor";

export type MailEnvironment = { RESEND_API_KEY?: string; CITY_MAIL_FROM?: string };
export const visitorRecipient = "15216632116@163.com";
export const mailConfigured = (env: MailEnvironment) => Boolean(env.RESEND_API_KEY?.trim() && env.CITY_MAIL_FROM?.trim());

// Small per-isolate abuse guard. For a high-traffic public deployment, add an
// edge/global rate-limit rule; this is not a durable cross-region counter.
export function createVisitorLimiter() {
  const attempts = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()) => {
    for (const [k, entry] of attempts) if (entry.expires <= now) attempts.delete(k);
    const entry = attempts.get(key) ?? { count: 0, expires: now + 600_000 };
    if (entry.count >= 5 || (!attempts.has(key) && attempts.size >= 2000)) return false;
    entry.count++; attempts.set(key, entry); return true;
  };
}
const allowAttempt = createVisitorLimiter();
const json = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });

async function smallJSON(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty");
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); throw new Error("large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}

export async function sendVisitorMessage(request: Request, env: MailEnvironment, transport: typeof fetch = fetch, allow = allowAttempt) {
  if (request.method !== "POST") return json({ error: "请通过留言窗口提交。" }, 405);
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "请求来源无效。" }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return json({ error: "留言格式不正确。" }, 415);
  const ip = request.headers.get("cf-connecting-ip") ?? "local";
  if (!allow(ip)) return json({ error: "留言太频繁，请十分钟后再试。" }, 429);
  let input: unknown;
  try { input = await smallJSON(request); } catch { return json({ error: "留言格式不正确或内容过长。" }, 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return json({ error: "留言格式不正确。" }, 400);
  const { name, emoji, message, submissionId, website } = input as Record<string, unknown>;
  if (typeof name !== "string" || !name.trim() || name.trim().length > cityVisitor.maxNameLength || /[\r\n\t\u2028\u2029]/u.test(name)) {
    return json({ error: `请填写 1–${cityVisitor.maxNameLength} 字的名字或昵称。` }, 400);
  }
  if (website || typeof emoji !== "string" || !cityVisitor.emojis.some(item => item.value === emoji)
    || typeof message !== "string" || !message.trim() || message.trim().length > cityVisitor.maxLength
    || typeof submissionId !== "string" || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(submissionId)) {
    return json({ error: `请选择一个表情，并填写 1–${cityVisitor.maxLength} 字的留言。` }, 400);
  }
  if (!mailConfigured(env)) return json({ error: "留言通道尚未配置，留言没有发送。请稍后再来，你填写的内容仍在。", code: "MAIL_UNCONFIGURED" }, 503);
  try {
    const response = await transport("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(12_000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `city-visitor/${submissionId}` },
      body: JSON.stringify({
        from: env.CITY_MAIL_FROM, to: [visitorRecipient], subject: `城市旅客来信 ${emoji}`,
        // Plain text only. Untrusted content cannot create markup/headers or
        // change the recipient. No IPs, keys or private prompts are forwarded.
        text: `一位城市旅客留下了消息。\n\n名字：${name.trim()}\n表情：${emoji}\n留言：\n${message.trim()}\n\n来信编号：${submissionId}\n来源：吴致远的个人城市主页`,
      }),
    });
    if (!response.ok) return json({ error: "邮件服务暂时未接受留言，请稍后重试。内容已保留。" }, 502);
    const result = await response.json() as { id?: string };
    if (!result.id) return json({ error: "邮件服务未确认提交，请稍后重试。" }, 502);
    // Provider acceptance is not proof of delivery into the 163 inbox.
    return json({ ok: true, status: "accepted" });
  } catch {
    return json({ error: "暂时无法确认发送结果，请重试；同一留言重试不会重复寄出。" }, 502);
  }
}
