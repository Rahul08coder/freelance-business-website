# Security Notes (backend)

Status: **base layer only (Day 15).** Admin authentication, CSRF protection and a full
security review are planned for Days 18, 19 and 23. This project is not claimed to be
production-secure until those are done and tested.

## What is in place now

| Protection | How | File |
|---|---|---|
| Security headers | `helmet()` | `src/app.js` |
| Hidden framework header | `x-powered-by` disabled | `src/app.js` |
| CORS allowlist | Only origins in `CLIENT_ORIGINS` can call the API from a browser | `src/config/cors.js` |
| Request body limit | `express.json({ limit: '10kb' })` | `src/app.js` |
| Rate limit (all API routes) | 300 requests per 15 minutes per IP, `/api/health` excluded | `src/middleware/rateLimiters.js` |
| Inquiry rate limit | 5 per hour per IP (defined, applied on Day 17) | `src/middleware/rateLimiters.js` |
| Login rate limit | 5 failed attempts per 15 minutes per IP (defined, applied on Day 18) | `src/middleware/rateLimiters.js` |
| Safe error responses | Internal error details are never sent to the client | `src/middleware/errorHandler.js` |
| Safe logging | Only method, path, status and time. No body, query, headers or cookies | `src/middleware/requestLogger.js` |
| Strict env checks | Server refuses to start with missing or invalid settings | `src/config/env.js` |
| Secrets out of Git | `.env` is ignored, `.env.example` has placeholders only | `.gitignore` |

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

    { "success": false, "error": { "message": "Validation failed.", "details": [ { "field": "email", "message": "Please enter a valid email address." } ] } }

`details` is only present for validation errors.

| Status | When |
|---|---|
| 400 | Invalid JSON, validation failed, invalid id |
| 403 | Origin not allowed |
| 404 | Route not found |
| 409 | Duplicate record |
| 413 | Request body too large |
| 429 | Rate limit exceeded |
| 500 | Server error (generic message only) |

## Known limitations and risks

- CORS only stops browsers. Scripts and `curl` can still call the API, so validation,
  rate limits and authentication are the real protection.
- Requests without an `Origin` header are allowed (needed for Thunder Client and server tools).
  CSRF protection for admin actions comes on Day 19.
- Rate limit counters are kept in memory. They reset when the server restarts and are not
  shared between multiple server instances.
- MongoDB Atlas currently allows connections from any IP (`0.0.0.0/0`) for development.
  The database user should be limited to `readWrite` on the development database, and this
  must be reviewed before going live.