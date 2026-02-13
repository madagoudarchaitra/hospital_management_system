# Hospital Management System

Full-stack Hospital Management System using MySQL, Node.js (Express), Sequelize, and React.js.

Features:
- Authentication (Admin / Doctor / Patient) with JWT
- Role-based access control
- Modules: Patient, Doctor, Appointments, Billing, Pharmacy, Lab Reports, Bed/Ward, Staff, Reports
- Full CRUD endpoints for each module (scaffolded)
- React frontend with protected routes and role dashboards

Prerequisites:
- Node.js 18+
- MySQL 8+

Setup
1. Create a MySQL database, e.g. `hospital_db`.
2. Backend: install dependencies and configure `.env`.

```bash
cd backend
cp .env.example .env
# edit .env to set DB credentials and JWT_SECRET
npm install
node src/seed.js   # creates tables and seed admin
node src/index.js
```

3. Frontend:

```bash
cd frontend
npm install
npm start
```

API:
- Backend runs on `http://localhost:5000` by default
- React runs on `http://localhost:3000`

Notes:
- This scaffold is intended for a BCA final-year project. Expand models and UI as needed.
