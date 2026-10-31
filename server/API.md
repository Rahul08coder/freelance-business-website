# API Design

Base URL (local): `http://localhost:5000/api`

This is the planned API. Only endpoints marked **Implemented** exist right now.
Detailed request and response examples for each endpoint are added on the day it is built.

## Response format

Success:

    { "success": true, "data": { } }

Error:

    { "success": false, "error": { "message": "What went wrong" } }

## Status codes used

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Invalid input (validation failed) |
| 401 | Not logged in |
| 403 | Not allowed (for example, failed CSRF check) |
| 404 | Not found |
| 429 | Too many requests (rate limit) |
| 500 | Server error |

## Public endpoints

| Method | URL | Purpose | Auth | Planned day | Status |
|---|---|---|---|---|---|
| GET | /api/health | Check that the server is running | None | 12 | Implemented |
| GET | /api/services | List active services | None | 16 | Planned |
| GET | /api/projects | List projects (optional `?featured=true`) | None | 16 | Planned |
| GET | /api/projects/:slug | Get one project | None | 16 | Planned |
| POST | /api/inquiries | Submit a project inquiry (rate limited) | None | 17 | Planned |

## Admin endpoints (all require login except login itself)

| Method | URL | Purpose | Planned day | Status |
|---|---|---|---|---|
| POST | /api/admin/login | Log in (sets HTTP-only cookie, rate limited) | 18 | Planned |
| POST | /api/admin/logout | Log out | 18 | Planned |
| GET | /api/admin/me | Get the logged-in admin | 18 | Planned |
| GET | /api/admin/dashboard | Dashboard summary counts | 20 | Planned |
| GET | /api/admin/inquiries | List inquiries (search, status filter, pages) | 20 | Planned |
| GET | /api/admin/inquiries/:id | Get one inquiry | 20 | Planned |
| PATCH | /api/admin/inquiries/:id | Update inquiry status | 20 | Planned |
| DELETE | /api/admin/inquiries/:id | Delete an inquiry | 20 | Planned |
| POST | /api/admin/projects | Create a project | 21 | Planned |
| PATCH | /api/admin/projects/:id | Update a project (including featured) | 21 | Planned |
| DELETE | /api/admin/projects/:id | Delete a project | 21 | Planned |
| POST | /api/admin/services | Create a service | 22 | Planned |
| PATCH | /api/admin/services/:id | Update a service | 22 | Planned |
| DELETE | /api/admin/services/:id | Delete a service | 22 | Planned |

Site settings endpoints are optional and will be decided on Day 22.

## Implemented endpoint details

### GET /api/health

- Purpose: confirm the server is up.
- Auth: none.
- Request body: none.
- Success response (200):

      {
        "success": true,
        "data": {
          "status": "ok",
          "uptimeSeconds": 42,
          "timestamp": "2026-10-31T12:00:00.000Z"
        }
      }

- Possible errors: none expected.

### Any unknown route

- Response (404): `{ "success": false, "error": { "message": "Route not found." } }`