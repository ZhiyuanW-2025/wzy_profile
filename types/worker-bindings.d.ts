// Optional template database binding; this site does not provision or use D1.
declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    RESEND_API_KEY?: string;
    CITY_MAIL_FROM?: string;
  }
}
