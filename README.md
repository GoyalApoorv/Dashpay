# 💸 Dashpay

**Dashpay** is a full-stack digital wallet and payment application. Built to simulate the core operations of a real-world payment service, it supports user registration, secure authentication, wallet balance tracking, and peer-to-peer transactions.

This project reflects secure backend practices with Node.js and JWT, a clean frontend structure using React, and modern UI styling with Tailwind CSS.

### 🚀 Features

* ✅ **User Signup/Login** with hashed passwords
* 🔐 **JWT-based Authentication**
* 💼 **Wallet Balance Management**
* 💸 **Peer-to-Peer Money Transfers**
* 🔍 **Real-time User Search**
* 📱 **Responsive UI** for a seamless experience
* 📦 **Clean RESTful API Design**

### 🛠️ Tech Stack

⚙️ **Backend**

* **Node.js** & **Express.js**
* **Mongoose** ODM
* **MongoDB** (NoSQL Database)
* **JWT** for Authentication
* **Bcrypt** for Password Hashing
* **Zod** for Schema Validation
* **dotenv**, **CORS**

🎨 **Frontend**

* **React.js** (with Hooks & Functional Components)
* **React Router** for Client-Side Routing
* **Tailwind CSS** for styling
* **Vite** for a fast development build

🧰 **Dev Tools**

* **Prettier** for code formatting
* **Postman** for API Testing

### ⚙️ Installation & Run Instructions

Follow the steps below to set up and run the project on your local machine:

**📥 1. Clone the Repository**
```bash
git clone [https://github.com/GoyalApoorv/Dashpay.git](https://github.com/GoyalApoorv/Dashpay.git)
cd Dashpay

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory and add the following:
DATABASE_URL="your_mongodb_connection_string"
JWT_SECRET="your_strong_jwt_secret"

# Navigate to the frontend directory
cd ../frontend

# Install dependencies
npm install

#Run this command in both the backend and the frontend dir:
npm run dev
