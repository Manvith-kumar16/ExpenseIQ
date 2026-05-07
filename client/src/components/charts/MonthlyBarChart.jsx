import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MonthlyBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="d-flex justify-content-center align-items-center h-100 text-secondary">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--primary)' }}
          formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
        />
        <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.amount > 0 ? '#7b61ff' : '#4f46e5'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyBarChart;
