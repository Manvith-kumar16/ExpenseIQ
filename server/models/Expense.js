const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Housing', 'Food', 'Transportation', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Other']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Please add a date']
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
