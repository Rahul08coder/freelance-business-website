# Security Notes (backend)

Status: **reviewed on Day 23, automated and manual tests continue on Days 24 and 25.**
This project is not claimed to be production-secure until those tests pass and the
deployment checklist at the bottom is done and verified on the live site.

## What is in place

| Area | Protection | Where |
|---|---|---|
| Headers | `helmet()`, and `X-Powered-By` disabled | `src/app.js` |
| Browser access | CORS allowlist from `CLIENT_ORIGINS`. Unknown origins get 403 on every method. | `src/config/cors.js` |
| Request size | JSON body limit 20 KB | `src/app.js` |
| Rate limits | General API: 300 per 15 min per IP (health excluded). Inquiry: 5 per hour (30 in development). Login: 5 failed attempts per 15 min per IP. | `src/middleware/rateLimiters.js` |
| Input validation | Zod schemas, unknown fields dropped, control characters removed, types checked | `src/validation/` |
| Operator keys | Request bodies containing field names that start with `$`, or `__proto__`, are rejected (400) | `src/middleware/blockOperatorKeys.js` |
| Database rules | Mongoose schemas as a second layer of validation | `src/models/` |
| Search | User text is escaped before it is used in a regular expression | `src/utils/escapeRegex.js` |
| IDs | Admin route ids must be 24 hex characters, otherwise 400 | `src/middleware/validateObjectId.js` |
| Passwords | bcryptjs (cost 12). Never stored or logged in plain text. Hash never returned by the API. | `src/utils/password.js` |
| Admin creation | One-time script with hidden password input. No public registration. | `src/scripts/createAdmin.js` |
| Account lock | 10 failed passwords within 15 minutes lock the account for 15 minutes. The lock gives the same error as a wrong password. | `src/controllers/adminAuthController.js` |
| Sessions | Random 256-bit token in an HTTP-only cookie. Only its SHA-256 hash is stored. 12 hour lifetime, TTL index, real logout, at most 5 sessions per admin. | `src/services/sessionService.js` |
| Cookie | HttpOnly, SameSite=Lax, Secure in production, path `/api/admin` | `src/config/auth.js` |
| CSRF | `X-CSRF-Token` header (HMAC of the session token, constant-time compare) on every POST, PATCH and DELETE after login | `src/middleware/requireCsrf.js` |
| Admin access | `requireAdmin` runs on the server for every admin route. Fails closed. Admin responses use `no-store`. | `src/middleware/requireAdmin.js` |
| Login | Same error for wrong email, wrong password and locked account. A dummy hash check keeps timing similar. | `src/controllers/adminAuthController.js` |
| Errors | Internal error details are never sent to the client | `src/middleware/errorHandler.js` |
| Logging | Only method, path, status and time. No body, query, headers or cookies. | `src/middleware/requestLogger.js` |
| Startup checks | The server refuses to start with missing or invalid settings. In production it also refuses a database name ending in `_dev` or `_test`, and warns about `TRUST_PROXY=0`, localhost origins and `DNS_SERVERS`. | `src/config/env.js`, `src/config/productionChecks.js` |
| Secrets | `.env` is ignored by Git. `.env.example` has placeholders only. | `.gitignore` |
| Privacy | Inquiries have no public read endpoint. No IP address is stored. | `src/routes/` |

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| NODE_ENV | No | `development` (default) or `production` |
| PORT | No | Server port, default 5000 |
| MONGODB_URI | Yes | Atlas connection string (secret) |
| MONGODB_DB_NAME | Required in production | Separate database per environment |
| CLIENT_ORIGINS | Required in production | Comma-separated list of allowed website origins |
| TRUST_PROXY | No | Number of proxies in front of the server (0 locally, usually 1 on Render) |
| DNS_SERVERS | No | Local workaround for networks that cannot resolve Atlas. Do not set in production. |

## Error response format

    { "success": false, "error": { "message": "Validation failed.", "details": [ { "field": "email", "message": "..." } ] } }

`details` is only present for validation errors. Status codes used: 400, 401, 403, 404, 409, 413, 415, 429, 500, 503.

## Known limitations and risks

- CORS and the Origin check only affect browsers. Scripts and `curl` can still call the API, so
  validation, rate limits and authentication are the real protection.
- Requests without an `Origin` header are allowed (needed for Thunder Client and server tools).
  Browsers always send `Origin` on cross-site POST, PATCH and DELETE, and the CSRF token is also required.
- Rate limit counters are kept in memory. They reset when the server restarts and are not shared
  between several server instances.
- The account lock can be used to annoy the admin: someone who knows the admin email can keep the
  account locked by sending wrong passwords from two or more IPs. The lock lasts only 15 minutes and
  `src/scripts/unlockAdmin.js` clears it.
- `createAdmin.js --reset-password` signs out all sessions but does not clear an account lock.
  Use `unlockAdmin.js` for that.
- There is no two-factor login and no email alert for new inquiries or logins.
- A session cannot be revoked remotely, except by logging out or by resetting the admin password.
- Frontend security headers (CSP and others) are set in `client/vercel.json`. They must be updated
  when the API address is known (see the deployment checklist).

## Deployment checklist (not done yet)

- [ ] Use a separate production database (for example `devlance_prod`) and a separate Atlas user
      limited to `readWrite` on that database only.
- [ ] Decide the Atlas IP access list. Render has no fixed IP on the free plan, so `0.0.0.0/0`
      may be needed. If so, the strong password and the limited database user are the protection.
- [ ] Set `NODE_ENV=production`, `CLIENT_ORIGINS` (https only), `TRUST_PROXY=1`. Do not set `DNS_SERVERS`.
- [ ] Make the frontend and the API look like one site (for example with a rewrite for `/api`),
      so the admin cookie is not blocked as a third-party cookie. Then `connect-src 'self'` in
      `client/vercel.json` is enough.
- [ ] Create the production admin with `createAdmin.js` using a new, long, unique password.
- [ ] After deploying, test login, logout, the CSRF check, the rate limit and the security headers on the live site.
- [ ] Re-run `npm audit` before every release.