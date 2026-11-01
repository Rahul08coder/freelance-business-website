# API Design

Base URL (local): `http://localhost:5000/api`

This is the planned API. Only endpoints marked **Implemented** exist right now.
Detailed request and response examples for each endpoint are added on the day it is built.

## Response format

Success:

    { "success": true, "data": { } }

Error:

    { "success": false, "error": { "message": "What went wrong" } }

Validation errors can also include `details`:

    { "success": false, "error": { "message": "Validation failed.", "details": [ { "field": "email", "message": "..." } ] } }

## Status codes used

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Invalid input (validation failed, invalid id or slug) |
| 401 | Not logged in |
| 403 | Not allowed (origin not allowed, failed CSRF check) |
| 404 | Not found |
| 409 | Duplicate record |
| 413 | Request body too large |
| 429 | Too many requests (rate limit) |
| 500 | Server error |
| 503 | Service unavailable (for example, database not connected) |

## Public endpoints

| Method | URL | Purpose | Auth | Planned day | Status |
|---|---|---|---|---|---|
| GET | /api/health | Check that the server and database are running | None | 12, 13 | Implemented |
| GET | /api/services | List enabled services | None | 16 | Implemented |
| GET | /api/projects | List projects (optional `?featured=true`) | None | 16 | Implemented |
| GET | /api/projects/:slug | Get one project | None | 16 | Implemented |
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

- Purpose: confirm the server is up and connected to the database.
- Auth: none. Request body: none.
- Success (200):

      { "success": true, "data": { "status": "ok", "database": "connected", "uptimeSeconds": 42, "timestamp": "2026-11-01T12:00:00.000Z" } }

- Error (503) when the database is not connected:

      { "success": false, "error": { "message": "Database is not connected." } }

### GET /api/services

- Purpose: list the services shown on the website. Only enabled services, sorted by `order`.
- Auth: none. Request body: none. Query: none.
- Success (200):

      { "success": true, "data": { "services": [ { "id": "business-website", "title": "Business Website Development", "description": "...", "icon": "Globe" } ] } }

  `id` is the service slug. It is also used by `/start-project?service=<id>`.
- Errors: 429 (rate limit), 500.

### GET /api/projects

- Purpose: list projects, sorted by `order`, then newest first.
- Auth: none. Request body: none.
- Query: `featured` (optional). Must be `true` or `false`.
- Success (200):

      { "success": true, "data": { "projects": [ { "slug": "taskflow", "title": "Taskflow", "category": "Full-stack", "description": "...", "tech": ["FastAPI"], "githubUrl": "https://...", "liveUrl": "", "featured": true } ] } }

- Errors: 400 if `featured` is not `true` or `false`, 429, 500.

### GET /api/projects/:slug

- Purpose: get one project with its overview and features.
- Auth: none. Request body: none.
- Validation: slug must be lowercase letters, numbers and hyphens, at most 80 characters.
- Success (200): same fields as the list, plus `overview` (string) and `features` (array of strings):

      { "success": true, "data": { "project": { "slug": "taskflow", "...": "...", "overview": "...", "features": ["..."] } } }

- Errors: 400 invalid slug, 404 project not found, 429, 500.

### Any unknown route

- Response (404): `{ "success": false, "error": { "message": "Route not found." } }`