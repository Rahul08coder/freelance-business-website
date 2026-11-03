# Admin API

All admin endpoints live under `/api/admin`. Responses are never cached (`Cache-Control: no-store`).
Everything except login needs a valid admin session cookie. Every request that changes data
(POST, PATCH, DELETE) also needs a CSRF token header.

## Session cookie

| Property | Value |
|---|---|
| Name | `devlance_admin_session` |
| Value | Random 43 character token. Only its SHA-256 hash is stored in the database. |
| HttpOnly | Yes (JavaScript cannot read it) |
| Secure | Yes in production (HTTPS only) |
| SameSite | Lax |
| Path | `/api/admin` |
| Lifetime | 12 hours. Expired sessions are removed by a MongoDB TTL index. |

## CSRF protection

State-changing admin requests (POST, PATCH, DELETE) must send the header `X-CSRF-Token: <token>`.

- The token comes from the `csrfToken` field of the login response and of `GET /api/admin/me`.
- It is an HMAC of the session token, so every session has a different token.
- Keep it in memory only. Never store it in `localStorage`.
- GET, HEAD and OPTIONS do not need it. GET requests must never change data.
- A missing or wrong token gives `403 Invalid or missing CSRF token.`
- Requests from an origin that is not in `CLIENT_ORIGINS` are rejected with `403 This origin is not allowed.` before they reach any route.

## POST /api/admin/login

- Purpose: log in. Sets the session cookie and returns the CSRF token.
- Auth: none. Rate limit: 5 failed attempts per 15 minutes per IP.
- Request header: `Content-Type: application/json`
- Request body:

      { "email": "admin@example.com", "password": "..." }

- Success (200):

      {
        "success": true,
        "data": {
          "admin": { "email": "admin@example.com", "name": "Admin" },
          "csrfToken": "..."
        }
      }

- Errors:
  - 400 email or password missing, or not text
  - 401 `Invalid email or password.` (same message for a wrong email and a wrong password)
  - 403 origin not allowed
  - 415 content type is not JSON
  - 429 too many failed attempts

## POST /api/admin/logout

- Purpose: log out. Deletes the session from the database and clears the cookie.
- Auth: admin session cookie, plus `X-CSRF-Token`.
- Success (200):

      { "success": true, "data": { "loggedOut": true } }

- Errors: 401 not logged in (the stale cookie is cleared), 403 missing or wrong CSRF token.

## GET /api/admin/me

- Purpose: get the logged-in admin and a fresh copy of the CSRF token (used after a page reload).
- Auth: admin session cookie.
- Success (200):

      {
        "success": true,
        "data": {
          "admin": { "email": "admin@example.com", "name": "Admin", "lastLoginAt": "2026-11-02T10:00:00.000Z" },
          "csrfToken": "..."
        }
      }

- Errors: 401 `Please log in.`

## Creating the first admin

There is no public registration. Run this on the server machine, in the `server` folder:

    node --env-file=.env src/scripts/createAdmin.js

The script asks for an email, asks you to confirm the database name, and asks for the password with hidden typing.
It refuses to run if an admin already exists. To change the password (this also signs out every existing login):

    node --env-file=.env src/scripts/createAdmin.js --reset-password