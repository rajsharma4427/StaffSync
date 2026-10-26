# StaffSync — Human Resource Management for Skill Wallet

StaffSync is a MERN application with role-based workspaces for HR, Managers and Employees.

## Features
- JWT registration/login and role-protected dashboards
- HR: employee CRUD, leave approvals, attendance overview, announcements
- Manager: leave approvals, training creation/editing/deletion and employee assignment, announcements
- Employee: leave applications/status, check-in/check-out and attendance history, announcements, profile phone/address editing, assigned trainings
- Dark responsive UI using React, Vite, React Router, Axios and Bootstrap
- Notifications and file uploads are intentionally excluded

## Stack and structure
- Frontend: React (JavaScript), Vite, React Router, Axios, Bootstrap
- Backend: Node.js, Express, MVC controllers/routes, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas

```text
StaffSync/
├── client/
│   ├── src/components/     # Landing, auth and dashboard UI
│   ├── src/pages/          # Employee, HR and Manager dashboards
│   ├── src/routes/         # ProtectedRoute
│   ├── src/services/       # Axios API client
│   ├── .env.example
│   └── vercel.json
├── server/
│   ├── config/ models/ controllers/ routes/ middleware/
│   ├── server.js
│   ├── seed.js
│   └── .env.example
├── .gitignore
└── README.md
```

## Requirements
Node.js 18+ and npm, a MongoDB Atlas database, and a modern browser.

## Local setup

### 1. Backend
```bash
cd server
npm install
```
Copy `server/.env.example` to `server/.env` and fill in your Atlas connection string and a strong JWT secret:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
JWT_SECRET=<your-long-random-secret>
CLIENT_URL=http://localhost:5173
```

Seed demo data once:
```bash
npm run seed
```
Run the backend:
```bash
npm run dev
```
Backend base URL: `http://localhost:5000/api`.

### 2. Frontend
Open a second terminal:
```bash
cd client
npm install
```
Copy `client/.env.example` to `client/.env` (default API URL is `http://localhost:5000/api`), then run:
```bash
npm run dev
```
Open `http://localhost:5173`.

## Demo logins
The seed script creates these accounts with password `123456`:
- `hr@demo.com` — HR
- `manager@demo.com` — Manager
- `employee@demo.com` — Employee

Use only for local demos. Do not use demo credentials in a production environment. Public role selection is enabled to match the project requirements; for production, registration should not allow users to self-assign HR or Manager roles.

## Deployment

### Render backend
- Create a Web Service and set Root Directory to `server`.
- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed Vercel URL, without a trailing slash).
- Run `npm run seed` once against the production Atlas database from a local terminal configured with the production `MONGO_URI`; avoid repeatedly seeding production data.

### Vercel frontend
- Import the repository and set Root Directory to `client`.
- Add `VITE_API_URL=https://<render-app>.onrender.com/api`.
- `client/vercel.json` includes an SPA rewrite for React Router refreshes.
- After deployment, set `CLIENT_URL` on Render to the exact Vercel origin and redeploy the backend.

Render's free tier may sleep after inactivity; the first request after a quiet period can take about 50 seconds.

## Screenshots to capture
1. Landing page
2. Login and registration pages
3. Employee: Announcements & Trainings, Leaves, Attendance, Profile
4. HR: Leave Applications, Employee Management, Announcements, Attendance
5. Manager: Leave Applications, Training & Development
6. Role protection: sign in as one role and try to open another role's URL

## Demo flow (2–3 minutes)
1. Start on the landing page and briefly introduce StaffSync.
2. Log in as HR. Show employee management, approve/reject a leave request, review attendance and post an announcement.
3. Log in as Manager. Show leave applications and create a training program assigned to an employee.
4. Log in as Employee. Apply for leave, mark check-in/check-out, view announcements and assigned training, and edit phone/address.
5. Demonstrate role protection by attempting to open a dashboard belonging to a different role. Mention that Render's free tier may take about 50 seconds to wake on the first request after inactivity.

## Notes
- Keep `.env` files private; only commit `.env.example` files.
- The app expects the backend API routes and response formats included in this project.
