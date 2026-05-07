export const generateInsights = (expenses) => {
  if (!expenses || expenses.length === 0) {
    return ["Start adding expenses to get personalized insights!"];
  }

  const insights = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  // Filter expenses by month
  const currentMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const prevMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === previousMonth && d.getFullYear() === previousMonthYear;
  });

  // Calculate totals
  const currentTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const prevTotal = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Insight 1: Overall Spending Comparison
  if (prevTotal > 0) {
    const diff = currentTotal - prevTotal;
    const percentage = Math.round((Math.abs(diff) / prevTotal) * 100);
    if (diff > 0) {
      insights.push(`You spent ${percentage}% more this month compared to last month.`);
    } else if (diff < 0) {
      insights.push(`Great job! You spent ${percentage}% less this month than last month.`);
    } else {
      insights.push(`Your spending is exactly on par with last month.`);
    }
  }

  // Insight 2: Highest Category this month
  const categoryTotals = currentMonthExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, null);
  
  if (highestCategory) {
    insights.push(`Your highest expense this month is ${highestCategory} at $${categoryTotals[highestCategory].toFixed(2)}.`);
    
    // Insight 3: Category specific spike
    const prevCategoryTotal = prevMonthExpenses
      .filter(exp => exp.category === highestCategory)
      .reduce((sum, exp) => sum + exp.amount, 0);
      
    if (prevCategoryTotal > 0 && categoryTotals[highestCategory] > prevCategoryTotal * 1.2) {
      const spikePercentage = Math.round(((categoryTotals[highestCategory] - prevCategoryTotal) / prevCategoryTotal) * 100);
      insights.push(`Warning: ${highestCategory} expenses increased significantly by ${spikePercentage}% from last month.`);
    }
  }

  // Insight 4: Recent large transaction
  const largeExpenses = expenses.filter(exp => exp.amount > 500);
  if (largeExpenses.length > 0) {
    const latestLarge = largeExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    const daysAgo = Math.floor((now - new Date(latestLarge.date)) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 7) {
      insights.push(`You had a large transaction of $${latestLarge.amount} for ${latestLarge.title} recently.`);
    }
  }

  if (insights.length === 0) {
    insights.push("Your spending patterns look stable and healthy.");
  }

  return insights;
};

export const processCategoryData = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount });
    }
    return acc;
  }, []);
};

export const processMonthlyData = (expenses) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthlyData = expenses.reduce((acc, expense) => {
    const d = new Date(expense.date);
    // Only process current year for simplicity in this dashboard
    if (d.getFullYear() === new Date().getFullYear()) {
      const monthName = months[d.getMonth()];
      const existing = acc.find(item => item.month === monthName);
      if (existing) {
        existing.amount += expense.amount;
      } else {
        acc.push({ month: monthName, amount: expense.amount, monthIndex: d.getMonth() });
      }
    }
    return acc;
  }, []);

  // Sort by month index and remove the index
  return monthlyData.sort((a, b) => a.monthIndex - b.monthIndex).map(({ monthIndex, ...rest }) => rest);
};

export const processTrendData = (expenses) => {
  // Last 7 days trend
  const now = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    last7Days.push({
      date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: 0,
      fullDate: d.toDateString()
    });
  }

  expenses.forEach(exp => {
    const expDate = new Date(exp.date).toDateString();
    const dayData = last7Days.find(d => d.fullDate === expDate);
    if (dayData) {
      dayData.amount += exp.amount;
    }
  });

  return last7Days.map(({ fullDate, ...rest }) => rest);
};
