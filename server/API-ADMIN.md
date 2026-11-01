# Admin API

All admin endpoints live under `/api/admin`. Responses are never cached (`Cache-Control: no-store`).
Everything except login and logout needs a valid admin session cookie.

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

CSRF protection for state-changing admin requests is added on Day 19.

## POST /api/admin/login

- Purpose: log in. Sets the session cookie.
- Auth: none. Rate limit: 5 failed attempts per 15 minutes per IP.
- Request header: `Content-Type: application/json`
- Request body:

      { "email": "admin@example.com", "password": "..." }

- Success (200): the cookie is set.

      { "success": true, "data": { "admin": { "email": "admin@example.com", "name": "Admin" } } }

- Errors:
  - 400 email or password missing, or not text
  - 401 `Invalid email or password.` (same message for a wrong email and a wrong password)
  - 415 content type is not JSON
  - 429 too many failed attempts

## POST /api/admin/logout

- Purpose: log out. Deletes the session from the database and clears the cookie.
- Auth: none needed (it works even if the session already expired).
- Success (200):

      { "success": true, "data": { "loggedOut": true } }

## GET /api/admin/me

- Purpose: get the logged-in admin.
- Auth: admin session cookie.
- Success (200):

      { "success": true, "data": { "admin": { "email": "admin@example.com", "name": "Admin", "lastLoginAt": "2026-11-02T10:00:00.000Z" } } }

- Errors: 401 `Please log in.`

## Creating the first admin

There is no public registration. Run this on the server machine, in the `server` folder:

    node --env-file=.env src/scripts/createAdmin.js

The script asks for an email, asks you to confirm the database name, and asks for the password with hidden typing.
It refuses to run if an admin already exists. To change the password:

    node --env-file=.env src/scripts/createAdmin.js --reset-password