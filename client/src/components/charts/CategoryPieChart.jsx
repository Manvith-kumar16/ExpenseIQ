import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#7b61ff', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="d-flex justify-content-center align-items-center h-100 text-secondary">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--text-primary)' }}
          itemStyle={{ color: 'var(--text-primary)' }}
          formatter={(value) => `$${value.toFixed(2)}`}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CategoryPieChart;
