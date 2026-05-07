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
    enum: ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
    default: 'Cash'
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
