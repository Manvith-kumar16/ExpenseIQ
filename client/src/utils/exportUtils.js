export const exportToCSV = (expenses, filename = 'expenses.csv') => {
  if (!expenses || !expenses.length) return;

  const headers = ['Date', 'Title', 'Category', 'Payment Method', 'Amount', 'Description'];
  
  const csvRows = [
    headers.join(','), // header row
    ...expenses.map(exp => {
      return [
        new Date(exp.date).toLocaleDateString(),
        `"${exp.title.replace(/"/g, '""')}"`, // escape quotes
        exp.category,
        exp.paymentMethod,
        exp.amount,
        `"${(exp.description || '').replace(/"/g, '""')}"`
      ].join(',');
    })
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
