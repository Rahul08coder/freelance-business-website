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


## GET /api/admin/dashboard

- Purpose: summary numbers and the 5 newest inquiries for the admin dashboard.
- Auth: admin session cookie.
- Success (200):

      {
        "success": true,
        "data": {
          "inquiries": {
            "total": 12,
            "last7Days": 3,
            "byStatus": { "new": 4, "under-review": 2, "contacted": 1, "accepted": 0, "in-progress": 0, "completed": 5, "rejected": 0 },
            "recent": [ { "inquiryId": "INQ-K7M2X9PQ", "name": "Test Client", "projectType": "business-website", "status": "new", "createdAt": "2026-11-03T10:00:00.000Z" } ]
          },
          "projects": { "total": 3, "featured": 3 },
          "services": { "total": 8, "enabled": 8 }
        }
      }

- Errors: 401 not logged in.

## GET /api/admin/inquiries

- Purpose: list inquiries, newest first, with search, status filter and pages.
- Auth: admin session cookie.
- Query (all optional):

| Name | Rule |
|---|---|
| search | text, at most 100 characters. Matches reference ID, name, email, company and description (case-insensitive). Special characters are treated as plain text. |
| status | one of `new`, `under-review`, `contacted`, `accepted`, `in-progress`, `completed`, `rejected` |
| page | whole number from 1 to 10000. Default 1. |
| limit | whole number from 1 to 50. Default 10. |

- Success (200):

      {
        "success": true,
        "data": {
          "inquiries": [ { "id": "6720...", "inquiryId": "INQ-K7M2X9PQ", "name": "Test Client", "email": "client@example.com", "company": "", "projectType": "business-website", "budget": "10k-25k", "deadline": "1-month", "status": "new", "createdAt": "2026-11-03T10:00:00.000Z" } ],
          "pagination": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 }
        }
      }

- Errors: 400 invalid query (for example `status=bogus`, `limit=500`, `page=0`, or a repeated key), 401.

## GET /api/admin/inquiries/:id

- Purpose: get one inquiry with all its details.
- Auth: admin session cookie. `:id` must be a 24 character hex id.
- Success (200): `{ "success": true, "data": { "inquiry": { ...list fields, "description": "...", "referenceUrl": "", "notes": "", "updatedAt": "..." } } }`
- Errors: 400 invalid id, 401, 404 inquiry not found.

## PATCH /api/admin/inquiries/:id

- Purpose: change the status of an inquiry. Nothing else can be changed.
- Auth: admin session cookie and `X-CSRF-Token`. Content-Type must be JSON.
- Request body: `{ "status": "contacted" }`
- Success (200): the updated inquiry, same shape as GET /api/admin/inquiries/:id.
- Errors: 400 invalid id or status, 401, 403 missing or wrong CSRF token, 404, 415.

## DELETE /api/admin/inquiries/:id

- Purpose: permanently delete an inquiry. The admin screen asks for confirmation first.
- Auth: admin session cookie and `X-CSRF-Token`.
- Success (200): `{ "success": true, "data": { "deleted": true } }`
- Errors: 400 invalid id, 401, 403, 404.


## Projects

All project routes need an admin session cookie. POST, PATCH and DELETE also need `X-CSRF-Token`.
Changes show on the public website straight away (the public project endpoints read the same data).

### GET /api/admin/projects

- Purpose: list all projects with their ids, sorted by `order`, then newest first.
- Success (200): `{ "success": true, "data": { "projects": [ { "id": "...", "slug": "taskflow", "title": "...", "category": "Full-stack", "description": "...", "tech": ["..."], "githubUrl": "", "liveUrl": "", "featured": true, "order": 0, "updatedAt": "..." } ] } }`

### GET /api/admin/projects/:id

- Purpose: get one project. Same fields as the list, plus `overview`, `features` and `createdAt`.
- Errors: 400 invalid id, 404 not found.

### POST /api/admin/projects

- Purpose: create a project. Content-Type must be JSON.
- Request body (unknown fields are ignored):

| Field | Required | Rule |
|---|---|---|
| title | Yes | 2 to 100 characters |
| slug | Yes | lowercase letters, numbers and hyphens, at most 80. Must be unique. It becomes the public address `/portfolio/<slug>`. |
| category | Yes | `Full-stack`, `Frontend` or `Backend` |
| description | Yes | at most 300 characters (shown on cards) |
| overview | Yes | at most 3000 characters (shown on the detail page) |
| features | No | list of up to 15 texts, each at most 200 characters |
| tech | No | list of up to 15 texts, each at most 40 characters |
| githubUrl, liveUrl | No | empty, or a link starting with `http://` or `https://`, at most 300 characters |
| featured | No | `true` or `false`. Default `false`. |
| order | No | whole number 0 to 9999. Default: after the last project. |

- Success (201): `{ "success": true, "data": { "project": { ...detail } } }`
- Errors: 400 validation failed (with `details`), 401, 403, 409 slug already used (`details` points to `slug`), 415.

### PATCH /api/admin/projects/:id

- Purpose: change some fields of a project. Only the fields you send are changed. Same rules as POST.
- Request body: for example `{ "featured": true }` or `{ "liveUrl": "https://example.com" }`
- Success (200): the updated project (detail).
- Errors: 400 invalid id, invalid field, or an empty body (`No changes were sent.`), 401, 403, 404, 409 slug already used, 415.

### DELETE /api/admin/projects/:id

- Purpose: permanently delete a project. The admin screen asks for confirmation first.
- Success (200): `{ "success": true, "data": { "deleted": true } }`
- Errors: 400 invalid id, 401, 403, 404.