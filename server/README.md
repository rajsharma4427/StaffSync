# StaffSync Server

Node + Express + MongoDB (Mongoose) backend, MVC structure.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGO_URI` (MongoDB Atlas or local) and `JWT_SECRET`
3. `npm run seed` (creates demo users)
4. `npm run dev` (server on http://localhost:5000)

## Demo logins (password `123456`)
- HR: hr@demo.com
- Manager: manager@demo.com
- Employee: employee@demo.com

## API (send `Authorization: Bearer <token>` except register/login)
| Method | Route | Who |
|---|---|---|
| POST | /api/auth/register, /api/auth/login | public |
| GET/PUT | /api/auth/me | any |
| GET | /api/auth/users?role=Employee | HR, Manager |
| GET/POST | /api/employees | HR |
| GET/PUT/DELETE | /api/employees/:id | HR |
| GET/PUT | /api/employees/me | any |
| POST | /api/leaves | Employee |
| GET | /api/leaves/my | any |
| GET | /api/leaves | HR, Manager |
| PUT | /api/leaves/:id/status `{status}` | HR, Manager |
| POST | /api/attendance/mark | any |
| PUT | /api/attendance/checkout | any |
| GET | /api/attendance/my | any |
| GET | /api/attendance | HR, Manager |
| GET | /api/announcements | any |
| POST/DELETE | /api/announcements | HR, Manager |
| GET | /api/training | any (employees see assigned only) |
| POST/PUT/DELETE | /api/training | Manager |
