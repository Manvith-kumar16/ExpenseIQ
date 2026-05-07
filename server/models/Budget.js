const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add a monthly budget amount'],
    min: [0, 'Budget cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
