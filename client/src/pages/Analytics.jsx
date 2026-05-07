import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, PieChart } from 'lucide-react';
import api from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart as RechartsPieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#7C3AED','#2563EB','#06B6D4','#10B981','#F97316','#EF4444','#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(15,23,42,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px' }}>
      {label && <p style={{ color:'#94A3B8', fontSize:'0.75rem', marginBottom:4 }}>{label}</p>}
      <p style={{ color:'#fff', fontWeight:600, margin:0 }}>${payload[0].value?.toFixed(2)}</p>
    </div>
  );
};

const fadeUp = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0} };

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/expenses').then(r => setExpenses(r.data.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const catData = Object.values(expenses.reduce((acc, e) => {
    acc[e.category] = { name: e.category, amount: (acc[e.category]?.amount || 0) + e.amount };
    return acc;
  }, {})).sort((a,b) => b.amount - a.amount);

  const timelineData = expenses
    .sort((a,b) => new Date(a.date) - new Date(b.date))
    .reduce((acc, e) => {
      const key = new Date(e.date).toLocaleDateString('en-US', { month:'short', day:'numeric' });
      const ex = acc.find(i => i.date === key);
      if (ex) ex.amount += e.amount; else acc.push({ date: key, amount: e.amount });
      return acc;
    }, []);

  const totalSpent = expenses.reduce((s,e) => s + e.amount, 0);

  if (loading) return (
    <div style={{ padding:'2rem' }}>
      {[...Array(2)].map((_,i) => <div key={i} className="glass-card skeleton" style={{ height:350, marginBottom:'1.25rem' }} />)}
    </div>
  );

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }}>
      <motion.div variants={fadeUp} className="mb-4">
        <h2 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.03em', marginBottom:4 }}>Analytics</h2>
        <p style={{ color:'#64748B', margin:0 }}>Deep dive into your spending patterns</p>
      </motion.div>

      {/* Summary row */}
      <motion.div variants={fadeUp} className="stats-grid mb-4">
        {[
          { label:'Total Spent',    value:`$${totalSpent.toFixed(2)}`,    icon: BarChart2,   color:'#7C3AED' },
          { label:'Transactions',  value:expenses.length.toString(),       icon: TrendingUp,  color:'#2563EB' },
          { label:'Avg. Expense',  value:`$${expenses.length ? (totalSpent/expenses.length).toFixed(2) : '0.00'}`, icon: PieChart, color:'#06B6D4' },
          { label:'Top Category',  value:catData[0]?.name || '—',          icon: BarChart2,   color:'#10B981' },
        ].map((s,i) => (
          <div key={i} className="glass-card" style={{ padding:'1.25rem' }}>
            <div style={{ width:36, height:36, background:`${s.color}18`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.75rem' }}>
              <s.icon size={17} color={s.color} />
            </div>
            <div style={{ fontSize:'0.75rem', color:'#475569', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{s.label}</div>
            <div style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.4rem' }}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      {/* Spending Timeline */}
      <motion.div variants={fadeUp} className="glass-card p-4 mb-4">
        <h5 style={{ fontWeight:700, marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <TrendingUp size={18} color="#7C3AED" /> Spending Timeline
        </h5>
        {timelineData.length > 0 ? (
          <div style={{ height:300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData} margin={{ top:5, right:10, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} tickFormatter={v=>`$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="amount" stroke="#7C3AED" strokeWidth={2.5} dot={{ fill:'#7C3AED', r:4 }} activeDot={{ r:6, fill:'#A78BFA' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="empty-state"><p style={{ color:'#475569' }}>No timeline data yet. Start adding expenses!</p></div>
        )}
      </motion.div>

      {/* Bottom row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.25rem' }}>
        {/* Category Bar */}
        <motion.div variants={fadeUp} className="glass-card p-4">
          <h5 style={{ fontWeight:700, marginBottom:'1.5rem' }}>Category Breakdown</h5>
          {catData.length > 0 ? (
            <div style={{ height:280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="catBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} tickFormatter={v=>`$${v}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="amount" fill="url(#catBarGrad)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="empty-state"><p style={{ color:'#475569' }}>No data yet</p></div>}
        </motion.div>

        {/* Donut + legend */}
        <motion.div variants={fadeUp} className="glass-card p-4">
          <h5 style={{ fontWeight:700, marginBottom:'1.5rem' }}>Distribution</h5>
          <div style={{ height:180, position:'relative', marginBottom:'1.25rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={catData.length ? catData : [{name:'None',amount:1}]} dataKey="amount" innerRadius={50} outerRadius={75} paddingAngle={3} stroke="none">
                  {(catData.length ? catData : [{name:'None'}]).map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <div style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.1rem' }}>${totalSpent.toFixed(0)}</div>
              <div style={{ color:'#64748B', fontSize:'0.7rem' }}>Total</div>
            </div>
          </div>
          <div>
            {catData.slice(0,6).map((c,i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-2">
                <span style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.8rem', color:'#94A3B8' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }} />
                  {c.name}
                </span>
                <span style={{ fontSize:'0.8rem', fontWeight:600, color:'#fff' }}>${c.amount.toFixed(0)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Analytics;
