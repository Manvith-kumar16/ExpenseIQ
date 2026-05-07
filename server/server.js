require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// --- Middleware ---
app.use(express.json());

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);


// --- Public/Health Routes (Before API Routes) ---

// 1. Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "ExpenseIQ API is running successfully"
  });
});

// 2. Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
});


// --- API Routes ---
const auth = require('./routes/auth');
const expenses = require('./routes/expenses');
const budget = require('./routes/budget');

app.use('/api/v1/auth', auth);
app.use('/api/v1/expenses', expenses);
app.use('/api/v1/budget', budget);


// --- Error Handling ---

// 404 Handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(`❌ Error: ${err.message}`);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});


// --- Server Startup ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);
});
