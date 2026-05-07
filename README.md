# ExpenseIQ

A production-ready full-stack expense tracker web application built with the MERN stack (MongoDB, Express, React, Node) and Vite. Features a modern, premium fintech design with dark-mode ready accents, smooth animations, and robust functionality.

## Features
- **User Authentication**: Secure JWT-based login and registration.
- **Dashboard Overview**: Quick glance at total expenses and transaction count.
- **Expense Management**: Add, view, and delete expenses categorized intelligently.
- **Analytics**: Deep dive into spending habits with beautiful Recharts visualizations (timeline & category breakdown).
- **Premium UI**: Designed with a high-quality "fintech" aesthetic using Bootstrap 5 and custom CSS.

## Tech Stack
- **Frontend**: React, Vite, Bootstrap 5, React Router DOM, Axios, React Toastify, Recharts, React Icons.
- **Backend**: Node.js, Express.js, MongoDB Atlas (or local), Mongoose, JWT, bcryptjs, cors, dotenv.

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB instance running locally or MongoDB Atlas connection string.

### 1. Clone & Setup Backend
```bash
# Navigate to backend directory
cd server

# Install dependencies
npm install

# Configure environment variables
# Ensure your .env file in the server directory has the following variables:
# PORT=5000
# MONGO_URI=your_mongodb_connection_string (default in code is mongodb://localhost:27017/expenseiq)
# JWT_SECRET=your_jwt_secret_key
# NODE_ENV=development

# Start the backend server
npm run dev
```

### 2. Setup Frontend
```bash
# Open a new terminal and navigate to frontend directory
cd client

# Install dependencies
npm install

# Configure environment variables
# Ensure your .env file in the client directory has the following variable:
# VITE_API_URL=http://localhost:5000/api/v1

# Start the frontend development server
npm run dev
```

### 3. Usage
Open your browser and navigate to `http://localhost:5173`. Register a new account to start tracking expenses!
