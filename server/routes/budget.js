const express = require('express');
const { getBudget, setBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getBudget)
  .post(protect, setBudget);

module.exports = router;
