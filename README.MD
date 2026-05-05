# Team Task Management Web Application

A full-stack collaborative application built on the MERN stack where multiple users can manage tasks, track progress, and collaborate within projects. Think of it as a simplified version of tools like Trello or Asana.

## 🚀 Features

### 1. User Authentication
* Secure Signup and Login workflows.
* JWT-based authentication for secure session management.
* Password hashing with `bcryptjs`.

### 2. Project Management
* Users can create projects and automatically become the Project Admin.
* Admins can invite new members by searching for their registered email address.
* Admins can easily remove users from a project.
* Members can view all projects they have been assigned to.

### 3. Task Management (Kanban Style)
* Create detailed tasks including Title, Description, Priority (Low, Medium, High), and Due Date.
* Assign tasks to specific project members.
* Update task status (To Do, In Progress, Review, Done).

### 4. Interactive Dashboard
* Visual task overview powered by **Recharts**.
* View Total Tasks, Tasks by Status (Done, In Progress, Overdue).
* Shows a breakdown of how many tasks are assigned to each specific user.
* Real-time list of all overdue tasks.

### 5. Strict Role-Based Access Control (RBAC)
* **Super Admins:** Have global access to the `/admin` panel.
* **Project Admins:** Can create, update, and delete tasks within their project. Can add or remove members.
* **Project Members:** Can only view project tasks, and can *only* update the status of tasks that are specifically assigned to them.

## 🛠️ Technology Stack

**Frontend:**
* React (via Vite)
* Tailwind CSS
* React Router DOM
* Recharts (for Dashboard data visualization)
* Axios
* React Hot Toast (for notifications)

**Backend:**
* Node.js & Express.js
* MongoDB (Atlas) & Mongoose
* JSON Web Tokens (JWT) for Authentication
* express-async-handler

## 📦 Getting Started

### Prerequisites
* Node.js installed on your machine
* A MongoDB cluster (or local instance)

### 1. Clone & Install Dependencies

Open your terminal and install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=super_secret_dev_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application

You will need to run the frontend and backend in two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Your frontend will be accessible at `http://localhost:5173` (or 5174 if the port is busy).

## 🔒 Dummy Credentials for Testing
If you used the test users we seeded, you can use these accounts to test the RBAC features:

**Super Admin:**
* `admin@projectmanager.com` / `adminpassword123`

**Members:**
* `alice@test.com` / `password123`
* `bob@test.com` / `password123`
```
