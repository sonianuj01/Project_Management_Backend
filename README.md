# 📌 Project Management Backend

> A RESTful API backend for managing projects, teams, users, and tasks — built with scalability and real-world usage in mind.

---

## 📖 Overview

This repository contains the backend logic for a **Project Management System**.  
It provides endpoints for creating and managing:

- 🧑‍💼 Users & Authentication  
- 📁 Projects  
- 📋 Tasks  
- 🧠 Associations like task assignment, status updates, and more

Designed for use with any frontend (React, Next.js, mobile app) or as a standalone API for integrations.

---

## 🛠️ Tech Stack

### 🔧 Core
- **Node.js**  
- **Express.js**

### 🗄️ Database
- **MongoDB**

### 🔐 Authentication
- JWT (JSON Web Tokens)

### 🧰 Utilities
- bcrypt (for hashing)
- dotenv (configuration)
- Morgan (logging)

---

## 🚀 Features

✔️ User registration & login  
✔️ Secure password hashing  
✔️ Authentication with JWT  
✔️ CRUD for Projects  
✔️ CRUD for Tasks  
✔️ Role-based access structure  
✔️ Error handling & structured responses  
✔️ MongoDB integration with Mongoose

---

## 📁 API Endpoints

> **Base URL:** `http://localhost:5000/api`

| Method | Endpoint              | Description                     |
|--------|----------------------|---------------------------------|
| POST   | `/auth/register`      | Register a new user             |
| POST   | `/auth/login`         | Login and get a token           |
| GET    | `/users`              | Get all users                   |
| GET    | `/users/:id`          | Get a single user               |
| POST   | `/projects`           | Create project                  |
| GET    | `/projects`           | List all projects               |
| GET    | `/projects/:id`       | Project details                 |
| PUT    | `/projects/:id`       | Update project                  |
| DELETE | `/projects/:id`       | Delete project                  |
| POST   | `/tasks`              | Create task                     |
| GET    | `/tasks`              | List all tasks                  |
| GET    | `/tasks/:id`          | Task details                    |
| PUT    | `/tasks/:id`          | Update task                     |
| DELETE | `/tasks/:id`          | Delete task                     |

---

## 🚀 Getting Started

### 🧾 Prerequisites

Make sure you have:

✔ Node.js installed  
✔ MongoDB running (local or Atlas)  

---

### 🛠️ Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/sonianuj01/Project_Management_Backend.git
   cd Project_Management_Backend
