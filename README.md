# QuantumPortal User Onboarding System

A premium, modern full-stack user registration application featuring a glassmorphic dashboard interface, live validation, and a searchable registered users list.

## 🚀 Features

- **Glassmorphism UI**: Beautiful, premium soft UI theme with subtle gradients, glows, and smooth transitions.
- **Form Validations**: Advanced real-time input validations on both frontend (Axios side) and backend (Mongoose schema side).
- **Responsive Table**: Mobile-friendly, scrollable data table detailing all database registration records.
- **Analytics Metrics**: Real-time stats display (Total Users, Average Age, and Active Cities count).
- **Notifications**: Custom animated slide-in Toast notifications for feedback.
- **Loading Indicators**: Button states and loaders during network communications.
- **CORS & Environment Variables**: Secure CORS setup and modular configuration templates.

---

## 📂 Project Structure

```text
Revers-proxy/
├── backend/
│   ├── config/
│   │   └── db.js            # MongoDB Mongoose Connection Setup
│   ├── models/
│   │   └── User.js          # Mongoose Schema & Validation
│   ├── routes/
│   │   └── userRoutes.js    # Express HTTP Endpoints (GET, POST)
│   ├── .env                 # Environment config (Port, Mongo DB URI)
│   ├── .env.example         # Template for environment configuration
│   ├── package.json         # Node.js backend dependencies
│   └── server.js            # Application Entry Point & Express Setup
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundEffects.jsx # Ambient background glows
│   │   │   ├── Navbar.jsx            # Glassmorphic views switcher
│   │   │   ├── RegistrationForm.jsx   # Form validation & submission
│   │   │   ├── Toast.jsx             # Action notifications
│   │   │   └── UsersTable.jsx        # Data table & analytics
│   │   ├── App.jsx                   # Main React entry & tab state
│   │   ├── index.css                 # Custom CSS & Tailwind styles
│   │   └── main.jsx                  # React DOM render script
│   ├── .env                 # API connection configurations
│   ├── .env.example         # Template for API endpoint
│   ├── index.html            # Main markup page & metadata
│   ├── postcss.config.js     # PostCSS config for Tailwind
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite bundler options
│
└── README.md                 # Project guide (You are here!)
```

---

## 🛠️ Step-by-Step Setup Guide

### 1. Prerequisites
- **Node.js** (v16.0.0 or higher recommended)
- **NPM** (v8.0.0 or higher)
- **MongoDB Atlas Database** (or local Mongo instance)

---

### 2. Backend Setup
1. Open a terminal and navigate to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Install all required npm packages:
   ```bash
   npm install
   ```
3. Verify or update the environment configuration file `.env`. Ensure your MongoDB connection string is populated:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://ajaysecretmindtech_db_user:6bXQVwMjiLIVQbzq@cluster0.jengt0g.mongodb.net/ai_customer_support?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Start the backend developer server (runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```
   *Note: If nodemon is not preferred, run using `npm start`.*

---

### 3. Frontend Setup
1. Open a separate terminal and navigate to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open the browser and visit the URL displayed in the console (usually `http://localhost:5173`).

---

## 📡 REST API Documentation

### 1. Register User
* **Endpoint**: `POST /api/users`
* **Content-Type**: `application/json`
* **Body Fields**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "janedoe@example.com",
    "phone": "+1 (555) 019-2834",
    "age": 28,
    "city": "San Francisco"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully!",
    "user": {
      "_id": "647bcf...",
      "fullName": "Jane Doe",
      "email": "janedoe@example.com",
      "phone": "+1 (555) 019-2834",
      "age": 28,
      "city": "San Francisco",
      "createdAt": "2026-05-29T12:59:58.000Z",
      "updatedAt": "2026-05-29T12:59:58.000Z"
    }
  }
  ```

### 2. Retrieve All Users
* **Endpoint**: `GET /api/users`
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 1,
    "users": [
      {
        "_id": "647bcf...",
        "fullName": "Jane Doe",
        "email": "janedoe@example.com",
        "phone": "+1 (555) 019-2834",
        "age": 28,
        "city": "San Francisco",
        "createdAt": "2026-05-29T12:59:58.000Z"
      }
    ]
  }
  ```

---

## ☁️ Render Deployment Guide

Deploying this application as a single web service on Render is straightforward and free-tier friendly.

### Step 1: Create a Render Web Service
1. Log in to your **Render Dashboard** and click **New > Web Service**.
2. Connect your Git repository.

### Step 2: Configure Settings
Set the following options in the Render setup page:
* **Name**: `quantum-registry` (or any name you prefer)
* **Environment**: `Node`
* **Region**: Choose the region closest to you
* **Branch**: `main` (or your active branch)
* **Root Directory**: *Keep empty* (this builds from the project root)
* **Build Command**: `npm run build`
* **Start Command**: `npm start`

### Step 3: Add Environment Variables
Click **Advanced** and add the following Environment Variables:
1. `MONGODB_URI`: `mongodb+srv://ajaysecretmindtech_db_user:6bXQVwMjiLIVQbzq@cluster0.jengt0g.mongodb.net/ai_customer_support?retryWrites=true&w=majority&appName=Cluster0`
2. `NODE_ENV`: `production`

### Step 4: Deploy
Click **Create Web Service**. Render will:
1. Run `npm run build` to install backend packages, install frontend packages, and build the React site.
2. Run `npm start` to spin up the Express server.
3. Serve the React UI on your Render URL (e.g. `https://quantum-registry.onrender.com`).
