# Security Notes (backend)

Status: **built, not yet fully tested.** Automated and manual security tests, and a full review,
are planned for Days 23 to 25. This project is not claimed to be production-secure until
those are done.

## What is in place

| Area | Protection | Where |
|---|---|---|
| Headers | `helmet()`, and `X-Powered-By` disabled | `src/app.js` |
| Browser access | CORS allowlist from `CLIENT_ORIGINS`. Unknown origins get 403 on every method. | `src/config/cors.js` |
| Request size | JSON body limit 20 KB | `src/app.js` |
| Rate limits | General API: 300 per 15 min per IP (health excluded). Inquiry: 5 per hour (30 in development). Login: 5 failed attempts per 15 min. | `src/middleware/rateLimiters.js` |
| Input validation | Zod schemas, unknown fields dropped, control characters removed, types checked (blocks `{"$ne": null}` style input) | `src/validation/` |
| Database rules | Mongoose schemas as a second layer of validation | `src/models/` |
| Passwords | bcryptjs (cost 12). Never stored or logged in plain text. Hash never returned by the API. | `src/utils/password.js`, `src/models/Admin.js` |
| Admin creation | One-time script with hidden password input. No public registration. | `src/scripts/createAdmin.js` |
| Sessions | Random 256-bit token in an HTTP-only cookie. Only its SHA-256 hash is stored. 12 hour lifetime, TTL index, real logout. | `src/services/sessionService.js` |
| Cookie | HttpOnly, SameSite=Lax, Secure in production, path `/api/admin` | `src/config/auth.js` |
| CSRF | `X-CSRF-Token` header (HMAC of the session token, constant-time compare) on every POST, PATCH and DELETE after login | `src/middleware/requireCsrf.js` |
| Admin access | `requireAdmin` runs on the server for every admin route. Fails closed. Admin responses use `no-store`. | `src/middleware/requireAdmin.js` |
| Login | Same error for wrong email and wrong password. A dummy hash check keeps timing similar. | `src/controllers/adminAuthController.js` |
| Errors | Internal error details are never sent to the client | `src/middleware/errorHandler.js` |
| Logging | Only method, path, status and time. No body, query, headers or cookies. | `src/middleware/requestLogger.js` |
| Startup checks | Server refuses to start with missing or invalid settings | `src/config/env.js` |
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
| DNS_SERVERS | No | Local workaround for networks that cannot resolve Atlas |

## Error response format

    { "success": false, "error": { "message": "Validation failed.", "details": [ { "field": "email", "message": "..." } ] } }

`details` is only present for validation errors. Status codes used: 400, 401, 403, 404, 409, 413, 415, 429, 500, 503.

## Known limitations and risks

- CORS and the Origin check only affect browsers. Scripts and `curl` can still call the API, so
  validation, rate limits and authentication are the real protection.
- Requests without an `Origin` header are allowed (needed for Thunder Client and server tools).
  Browsers always send `Origin` on cross-site POST, PATCH and DELETE, and the CSRF token is also required.
- Rate limit counters are kept in memory. They reset when the server restarts and are not shared
  between several server instances. The login limit is per IP only, so an attacker using many IPs
  against one account is not stopped.
- There is no email alert for new inquiries.
- MongoDB Atlas currently allows connections from any IP (`0.0.0.0/0`) for development. The
  database user should be limited to `readWrite` on the development database. Review before launch.
- Cookies in production: the frontend (Vercel) and API (Render) will be on different sites. The plan is a
  Vercel rewrite so the browser talks to one site. This is not set up or tested yet.
- A session cannot be revoked remotely, except by logging out or by resetting the admin password
  (which deletes all sessions).