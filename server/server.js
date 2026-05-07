require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL, 'http://localhost:5173'] 
  : ['http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Route files
const auth = require('./routes/auth');
const expenses = require('./routes/expenses');
const budget = require('./routes/budget');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/expenses', expenses);
app.use('/api/v1/budget', budget);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
