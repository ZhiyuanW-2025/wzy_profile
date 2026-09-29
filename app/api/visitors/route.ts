import { mailConfigured, sendVisitorMessage, type MailEnvironment } from "@/server/visitor-mail";

// nodejs_compat on this Worker's 2026 compatibility date exposes secret bindings
// through process.env. Read only on the server and at request time.
const mailEnvironment = (): MailEnvironment => ({ RESEND_API_KEY: process.env.RESEND_API_KEY, CITY_MAIL_FROM: process.env.CITY_MAIL_FROM });

export async function POST(request: Request) {
  return sendVisitorMessage(request, mailEnvironment());
}

export function GET(request: Request) {
  const host = new URL(request.url).hostname;
  return Response.json({
    configured: mailConfigured(mailEnvironment()),
    localDemo: ["localhost", "127.0.0.1", "[::1]"].includes(host),
  }, { headers: { "Cache-Control": "no-store" } });
}
