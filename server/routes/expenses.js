const express = require('express');
const { getExpenses, addExpense, deleteExpense, updateExpense } = require('../controllers/expenseController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route('/:id')
  .delete(protect, deleteExpense)
  .put(protect, updateExpense);

module.exports = router;
