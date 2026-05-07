const Budget = require('../models/Budget');

// @desc    Get user budget
// @route   GET /api/v1/budget
// @access  Private
exports.getBudget = async (req, res) => {
  try {
    let budget = await Budget.findOne({ user: req.user.id });

    // If no budget found, return 0 budget
    if (!budget) {
      budget = { amount: 0 };
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set or update user budget
// @route   POST /api/v1/budget
// @access  Private
exports.setBudget = async (req, res) => {
  try {
    const { amount } = req.body;

    let budget = await Budget.findOne({ user: req.user.id });

    if (budget) {
      // Update existing
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new
      budget = await Budget.create({
        user: req.user.id,
        amount
      });
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
