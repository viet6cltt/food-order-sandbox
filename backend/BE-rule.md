# Backend (Node.js) — Coding & AI Agent Guidelines

Phiên bản: 1.1  
Ngày sửa đổi: 2025-11-16

Mục tiêu: tài liệu này cập nhật BE-rule dựa trên codebase hiện tại (Express v5, Mongoose, Passport, CommonJS). Hướng dẫn rõ ràng cho dev và AI Agent để tạo code tương thích với repo.

---

## 0. Môi trường & bản nhạc
- Node.js: repo chạy tốt trên Node 18+; trong môi trường dev hiện tại dùng Node 22.11.0 — test với cùng major khi deploy.
- Package manager: npm.
- Frameworks: Express v5, Mongoose (v8), Passport, JWT, Swagger (OpenAPI YAML at `src/docs/swagger.yaml`).

---

## 1. Kiến trúc & pattern cố định
Giữ pattern existing: routes → controllers → services → repositories → models → utils → middlewares.

- routes: `src/routes/*.routes.js` — export `Router`.
- controller: `src/controllers/*` — nhẹ, validate input, gọi service, trả response.
- services: `src/services/*` — business logic, throw `AppError` cho lỗi mong đợi.
- repositories: `src/repositories/*` — truy vấn DB (Mongoose) hoặc I/O, trả dữ liệu thô.
- models: `src/models/*.js` — Mongoose schemas.
- utils/middlewares: tái sử dụng (ví dụ `asyncHandler`, `AppError`, `error.middleware`).

---

## 2. Module system
- Duy trì CommonJS (require/module.exports). Không convert toàn repo sang ESM trong 1 PR.
- Nếu cần dùng 1 dependency ESM-only (ví dụ uuid v8+), AI/Dev phải:
  - Dùng dynamic import() trong runtime hoặc
  - Dùng fallback (Node `crypto.randomUUID()`), hoặc
  - Cài phiên bản CommonJS của package (ví dụ `uuid@3`/`uuid@8` với CJS build).
- Ví dụ fallback cho `uuid`:
```js
let uuidv4;
try {
  uuidv4 = require('uuid').v4;
} catch (e) {
  const { randomUUID } = require('crypto');
  uuidv4 = () => randomUUID();
}
```

---

## 3. Tổng quan dự án

- Tech stack: Node.js (v14+/v16+), Express, Firebase config tồn tại (firebase.json), MongoDB/Mongoose (kiến trúc repo có models), Passport (auth), JWT tokens.
- Kiến trúc chính: routes -> controllers -> services -> repositories -> models. Có `src/utils/AppError.js` và `src/middlewares/error.middleware.js` để xử lý lỗi chung.

---

## 4. Mục tiêu tài liệu

- Chuẩn hóa patterns cho API, error handling, auth và token flows.
- Định nghĩa conventions cho AI Agent để tự động sinh code an toàn, đúng chỗ và dễ review.
- Cung cấp snippet mẫu cho controller/service/repository và response contract.

---

## 5. Cấu trúc thư mục (hiện có)

```
src/
  controllers/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  config/
  index.js
server.js
```

Ghi chú: giữ pattern `routes -> controllers -> services -> repositories` để logic kinh doanh nằm trong services, repository chỉ thao tác DB, controller chịu request/response và gọi service.

---

## 6. Quy ước đặt tên & file

- Files JS: `camelCase` cho functions, `PascalCase` cho model constructors (e.g., `User.js`).
- Controller file: `<feature>.controller.js` (ví dụ `auth.controller.js`).
- Service file: `<feature>.service.js`.
- Repository file: `<feature>.repository.js`.
- Routes: `<feature>.routes.js` export một router.
- Middlewares: `<name>.middleware.js`.
- Config: `src/config/*.js`.

---

## 7. Contract API (format response)

Luôn trả về JSON theo contract chuẩn:

```
{
  success: boolean,
  data?: any,
  message?: string,
  errors?: any
}
```

- Errors: trả về HTTP status phù hợp và `message` rõ ràng; dùng `AppError` để bọc lỗi. Error middleware sẽ uniform response.

---

## 8. Patterns mã mẫu

- Controller (nhẹ, chỉ validate request body/query/params, gọi service, trả response):

```js
// src/controllers/example.controller.js
const asyncHandler = require('../middlewares/asyncHandler');
const ExampleService = require('../services/example.service');

exports.create = asyncHandler(async (req, res) => {
  const result = await ExampleService.create(req.body);
  res.status(201).json({ success: true, data: result });
});
```

- Service (business logic, validation orchestration, call repository):

```js
// src/services/example.service.js
const ExampleRepo = require('../repositories/example.repository');
const AppError = require('../utils/AppError');

exports.create = async (payload) => {
  // business rules, checks
  if (!payload.name) throw new AppError('Name is required', 400);
  const created = await ExampleRepo.create(payload);
  return created;
};
```

- Repository (DB access only):

```js
// src/repositories/example.repository.js
const ExampleModel = require('../models/Example');

exports.create = (payload) => ExampleModel.create(payload);
exports.findById = (id) => ExampleModel.findById(id).lean();
```

---

## 9. Validation & Sanitation

- Dùng runtime validation cho tất cả input từ client (request body, query, params). Giáo trình hiện tại không bắt buộc thư viện cụ thể, nhưng khuyến nghị dùng `joi` hoặc `zod`.
- Nếu dùng `joi`, tạo schema trong `src/validators/` hoặc phương thức validate trong `services` trước khi gọi repository.

---

## 10. Authentication / Authorization

- Dự án có `passport.config.js` và token configs. Tiếp tục dùng Passport + JWT pattern.
- Token flow:
  - Access token (JWT) cấp cho client; refresh token (lưu DB nếu cần) để lấy token mới.
  - Lưu token trong `AuthSession` hoặc `VerificationToken` model (repo có các model này).
- Auth middleware: `src/middlewares/auth.middleware.js` — dùng để bảo vệ route và expose `req.user`.

---

## 11. Error handling

- Dùng `AppError` để tạo lỗi tùy chỉnh (message, statusCode).
- Các controller nên throw lỗi (ví dụ `throw new AppError('Not found', 404)`) và để `error.middleware` xử lý format response và logging.

---

## 12. Security & secrets

- Đọc secrets từ `process.env` (sử dụng `.env` và `Backend/.env.example`). Không commit `.env` (gitignore đã có).
- Các biến thường có: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `SMTP_*`, `FIREBASE_*`.
- Các nguyên tắc: validate inputs, escape DB queries (ORM handles), set CORS whitelist in server config, rate-limit auth endpoints.

---

## 13. Logging & Monitoring

- Dùng console/libraries (winston/pino) để log. Errors đi qua error middleware - log stack trace server-side but return user-friendly message to client.

---

## 14. Tests

- Unit tests (Jest) cho services & utils.
- Integration tests cho routes (supertest).

---

## 15. CI / CD

- CI should run: lint, tests, build (if any), and optional static analysis.
- For deployments: Firebase/Cloud Run/Heroku settings may be used; follow server's `package.json` scripts.

---

## 16. Code style & conventions

- Use CommonJS modules (existing code uses `require`/`module.exports`). If migrating to ESM, do it in a single PR.
- Keep functions small, single responsibility.
- Prefix async controllers with `asyncHandler` to centralize try/catch.
- Add JSDoc comments for important exported functions to help tooling / AI.

---

## 17. AI Agent instructions / prompt template

When an AI agent generates code, follow these rules strictly:

1. Place files under the correct folder (`controllers`, `services`, `repositories`, `routes`, `middlewares`, `validators`).
2. Keep the repository/controller/service pattern. Do not put DB calls in controllers. Do not put request parsing in repositories.
3. Use `asyncHandler` wrapper for controller handlers.
4. Use `AppError` for expected failures; throw them from service layer.
5. Validate all external inputs with Joi/zod and return 400 on validation errors.
6. Export default functions using CommonJS (`module.exports = { ... }`) matching project style.
7. Keep PRs small: one feature/change per PR and include tests for logic.
8. If modifying existing routes or behavior, preserve backward compatible response contract.

Prompt template (developer -> AI):

```
You are a backend Node.js developer. Create a new <feature> using Express in this repo. Add a route at `src/routes/<feature>.routes.js` and implement controller in `src/controllers/<feature>.controller.js`, service in `src/services/<feature>.service.js`, and repository in `src/repositories/<feature>.repository.js`. Use asyncHandler in controller, throw AppError for expected failures, and validate inputs with Joi (or Zod). Keep code CommonJS and export accordingly. Keep file size < 200 LOC. Add unit tests under tests/<feature>.test.js. Return responses using the standard { success, data, message } contract.
```

---

## 18. Example: New endpoint skeleton (Create user)

Routes:
```js
// src/routes/auth.routes.js (append)
const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth.controller')

router.post('/register', AuthController.register)
module.exports = router
```

Controller:
```js
// src/controllers/auth.controller.js (excerpt)
const asyncHandler = require('../middlewares/asyncHandler')
const AuthService = require('../services/auth.service')

exports.register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body)
  res.status(201).json({ success: true, data: result })
})
```

Service:
```js
// src/services/auth.service.js (excerpt)
const UserRepo = require('../repositories/user.repository')
const AppError = require('../utils/AppError')

exports.register = async (payload) => {
  // check existing
  const exists = await UserRepo.findByEmail(payload.email)
  if (exists) throw new AppError('Email already used', 400)
  // create user (hash password inside repo or service)
  const user = await UserRepo.create(payload)
  return user
}
```

Repository:
```js
// src/repositories/user.repository.js
const User = require('../models/User')

exports.findByEmail = (email) => User.findOne({ email }).lean()
exports.create = (payload) => User.create(payload)
```

---

## 19. Deliverables the backend should keep

- `Backend/.env.example` (list env vars, no secrets)
- `README.md` with setup, run, and test commands
- Tests coverage for services
- API documentation (OpenAPI or at least README endpoints)

---

## 20. Change log

Update this file if you change patterns (migrating to TypeScript, changing auth approach, or switching DB).

---

If you want, I can:
- Generate `Backend/.env.example` based on `src/config/*` and common env names.
- Create a sample `users` endpoint using the patterns above (routes/controller/service/repo + tests).

Choose what to do next.
