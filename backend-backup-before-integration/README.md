# Ben's Part — Backend Auth & Security

This covers everything assigned to Ben in section 6 of the Team Task Guide:
"Who is this user, and what is this user allowed to do?"

## What's in here

```
backend/src/
├── validators/auth.validators.js   Zod schemas: what a valid register/login body looks like
├── middleware/validate.js          Runs a Zod schema against req.body -> 400 on failure
├── middleware/auth.js              Reads the JWT, sets req.user -> 401 if missing/invalid
├── middleware/role.js              Checks req.user.role against an allow-list -> 403 if not allowed
├── middleware/errorHandler.js      The one place that turns any error into a JSON response
├── utils/jwt.js                    sign/verify a JWT
├── utils/password.js               bcrypt hash/compare
├── utils/ApiError.js               error type controllers/services throw on purpose
├── utils/ApiResponse.js            enforces the { success, data, message } response shape
├── repositories/user.repository.js parameterized SQL against the users table
├── services/auth.service.js        the actual rules: no duplicate emails, wrong password -> 401, etc.
├── controllers/auth.controller.js  thin HTTP layer: req in, service call, response out
├── routes/auth.routes.js           POST /register, POST /login, GET /me
└── config/db.js                    REFERENCE ONLY (this is John's file — delete once his is merged)

backend/_reference/app.example.js   REFERENCE ONLY — shows how to mount the above in app.js
backend/tests/auth.test.js          Jest + Supertest, 12 tests, all passing
```

## Why it's split this way

This follows the layered architecture from section 5 of the technical doc —
**routes → controllers → services → repositories**, plus middleware that runs
before any of that:

- **Routes** just map an HTTP verb+path to a controller function.
- **Controllers** read the request and format the response. No SQL, no business rules.
- **Services** hold the actual rules ("a duplicate email is a 409", "wrong password is a 401").
- **Repositories** are the only files that touch the database, and every query is parameterized.
- **Middleware** (`auth.js`, `role.js`, `validate.js`) runs *before* any of the above and can
  reject a request early.

That separation is also why the tests can run without a live Postgres connection —
`user.repository.js` is mocked, so the tests check Ben's logic (hashing, JWT, role checks),
not the database.

## Endpoints delivered

| Method | Endpoint | Access | What it does |
|---|---|---|---|
| POST | `/api/auth/register` | Public/dev seed | Creates a user with a bcrypt-hashed password |
| POST | `/api/auth/login` | Public | Verifies credentials, returns a JWT |
| GET | `/api/auth/me` | Authenticated | Returns the profile of whoever the token belongs to |

Every response follows the shared shape: `{ "success": true/false, "data": {...}, "message": "..." }`.

## Environment variables this code needs

Add these to `backend/.env` (John owns `.env.example`; these are the two names Ben's code reads):

```
JWT_SECRET=<a long random string, dev only>
JWT_EXPIRES_IN=8h        # optional, defaults to 8h
```

## Running the tests

From `backend/`, with the team's normal dependencies installed (`npm install` —
everything needed, `bcrypt`, `jsonwebtoken`, `zod`, `jest`, `supertest`, is already
in the shared package list in section 13.3 of the tech doc):

```
npx jest tests/auth.test.js
```

All 12 tests pass as of this handoff. They cover exactly the "Confirm when done"
line from the team guide:

| Requirement | Covered by |
|---|---|
| Missing/invalid auth → 401 | `GET /me` with no token, `GET /me` with a garbage token, dispatcher-only route with no token |
| Authenticated but wrong role → 403 | dispatcher-only route hit with a RIDER token |
| Passwords are hashed | register test asserts the value sent to the repository matches bcrypt's `$2a$/$2b$` prefix and is never the plaintext password |
| No plaintext password ever returned | register/login/me responses asserted to not contain `password` or `password_hash` |

## Security decisions worth explaining to the panel

- **bcrypt, 12 salt rounds.** Slow enough to resist offline cracking of a leaked
  hash, cheap enough not to make login feel slow.
- **Login returns the same "Invalid email or password" for both a wrong password
  and a nonexistent email.** If those were different, the endpoint could be used
  to check which emails are registered.
- **The JWT payload only holds `sub` (user id), `role`, and `email`** — nothing
  sensitive, because a JWT is signed but not encrypted; anyone holding it can
  decode and read it.
- **`req.user.role` always comes from the verified token, never from the request
  body.** A client editing a form field can't grant themselves a different role.
- **`authenticate` always returns 401; `requireRole` always returns 403.** Mixing
  those up is a common bug — 401 means "I don't know who you are", 403 means
  "I know who you are, and the answer is no."
- **The error handler never sends a stack trace, raw SQL, or a secret to the
  client** — unexpected errors are logged server-side and replaced with a
  generic message.
- **Every SQL query in `user.repository.js` is parameterized** (`$1`, `$2`, ...),
  never string-concatenated, so user input can't be injected into a query.
- **`password_hash` is excluded from every `SELECT` except the one inside `login`**,
  and even there it's stripped off before the response leaves `auth.service.js`.

## Likely panel questions on this part specifically

- *"Why JWT and not sessions?"* — Stateless: any instance of the API can verify a
  token without a shared session store, which matches the modular-monolith,
  single-process MVP described in the docs.
- *"What if a token is stolen?"* — It's valid until it expires (`JWT_EXPIRES_IN`,
  8h by default). The roadmap item for this is refresh-token rotation and a
  revocation strategy (see section 24 of the tech doc) — not built for the MVP.
- *"Why 401 vs 403, and does it actually matter?"* — Yes: 401 tells the client
  "log in (again)", 403 tells the client "you're logged in, but this action isn't
  yours." A frontend that conflates them can't decide whether to redirect to
  login or just show "not allowed."
- *"How do you know passwords are actually hashed and not just obfuscated?"* — The
  register test inspects what was about to be written to the database and asserts
  it matches bcrypt's own hash format, not just "isn't equal to the input."

## What is *not* in this handoff (and whose part it is)

- Creating the `users` table/migration and the shared `.env.example` — **John**.
- `/api/deliveries`, `/api/deliveries/:id/assign`, status transitions — **Adineke**.
- Socket.IO events, QR token generation/confirmation — **Said**.
- The Login page UI, the "create account" flip-card, and the three dashboards —
  **Ntombela**. Ben's `/register` and `/login` endpoints are what that page will
  call, but building the page itself isn't part of the Backend – Auth & Security
  assignment.