import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendLineChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="d-flex align-items-center justify-content-center h-100 text-secondary">No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} tickFormatter={(value) => `$${value}`} />
        <Tooltip 
          formatter={(value) => `$${value.toFixed(2)}`} 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
        />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="#ec4899" 
          strokeWidth={4} 
          activeDot={{ r: 8, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }} 
          dot={{ r: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendLineChart;
