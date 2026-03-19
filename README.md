# Task Management UI (React)

A simple React frontend application for managing tasks, integrated with an ASP.NET Core Web API backend.

---

## 📌 Features

* Display task list
* Create new tasks
* Update existing tasks
* Delete tasks
* Filter tasks by status (Todo / Doing / Done)
* User feedback messages (success / error alerts)
* Responsive UI using Bootstrap

---

## 🛠 Tech Stack

* React (Vite)
* JavaScript (ES6+)
* Bootstrap 5
* Fetch API

---

## 📂 Project Structure

```
src/
 ├── App.jsx        # Main component (CRUD + UI logic)
 ├── main.jsx       # Entry point
 └── index.css      # Global styles
```

---

## ⚙️ Setup & Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/task-ui.git
cd task-ui
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create a `.env` file in the root folder:

```env
VITE_API_URL=https://localhost:7068/api/Tasks
```
Alternatively, you can copy from the example file:

```bash
cp .env.example .env
```
The .env.example file is provided as a reference for required environment variables.

> Make sure the backend API is running and the URL matches your backend port.

---

### 4. Run the development server

```bash
npm run dev
```

Then open:

```
http://localhost:5173
```

---

## 🔗 Backend Dependency

This project requires a running backend API.

The frontend communicates with the backend via:

```
GET    /api/Tasks
POST   /api/Tasks
PUT    /api/Tasks/{id}
DELETE /api/Tasks/{id}
```

---

## 🧠 Design Highlights

* Uses React hooks (`useState`, `useEffect`) for state management
* Separates form state and list state clearly
* Reuses a single form for both create and update operations
* Integrates with backend filtering via query string
* Provides user feedback with alert messages

---

## 📸 Demo (Optional)

You can add screenshots here if needed.

---

## 🚀 Future Improvements

* Add pagination
* Improve UI/UX design
* Add authentication
* Deploy frontend (e.g., Vercel / Netlify)

---
