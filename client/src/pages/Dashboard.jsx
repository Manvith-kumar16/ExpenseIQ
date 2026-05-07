import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Calendar, TrendingUp, Receipt, Sparkles, ArrowUpRight, ArrowDownRight, ChevronRight, Zap } from 'lucide-react';
import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { processCategoryData, processMonthlyData } from '../utils/dashboardUtils';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#7C3AED','#2563EB','#06B6D4','#10B981','#F97316','#EF4444','#8B5CF6'];

const sparkline1 = [{v:10},{v:15},{v:8},{v:25},{v:20},{v:30},{v:25}];
const sparkline2 = [{v:5},{v:12},{v:15},{v:10},{v:22},{v:18},{v:28}];

const fadeUp = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0} };
const container = { hidden:{}, show:{ transition:{ staggerChildren:0.08 } } };

function StatCard({ title, value, change, positive, color, icon: Icon, accent, sparkData, sparkColor }) {
  return (
    <motion.div variants={fadeUp} className={`glass-card stat-card stat-card-${color}`}>
      <div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="stat-icon" style={{ background: `${accent}20` }}>
            <Icon size={18} color={accent} />
          </div>
          <div className="stat-label">{title}</div>
        </div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change mt-1 ${positive ? 'up' : 'down'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
          <span style={{ color: '#475569', fontWeight: 400 }}> from last month</span>
        </div>
      </div>
      {sparkData && (
        <div style={{ height: 40, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line type="monotone" dataKey="v" stroke={sparkColor} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'rgba(15,23,42,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:'10px 14px' }}>
      <p style={{ color:'#94A3B8', fontSize:'0.75rem', marginBottom:4 }}>{label}</p>
      <p style={{ color:'#fff', fontWeight:600, margin:0 }}>${payload[0].value?.toFixed(2)}</p>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, budRes] = await Promise.all([api.get('/expenses'), api.get('/budget')]);
      setExpenses(expRes.data.data);
      if (budRes.data.data) setBudget(budRes.data.data.amount);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const now = new Date();
  const monthExp = expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
  const catData    = processCategoryData(monthExp);
  const monthData  = processMonthlyData(expenses);
  const topCat     = catData[0];
  const displayBudget = budget || 1500;
  const remaining  = Math.max(0, displayBudget - totalSpent);
  const progress   = Math.min((totalSpent / displayBudget) * 100, 100);

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="page-content">
        <div className="stats-grid mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card" style={{ height: 150, padding:'1.5rem' }}>
              <div className="skeleton" style={{ height: 40, width: 40, borderRadius: 10, marginBottom: 12 }} />
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 28, width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={container}>

      {/* ── Welcome Header ── */}
      <motion.div variants={fadeUp} className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <p style={{ color: '#94A3B8', marginBottom: 4, fontSize: '0.95rem' }}>{greeting()},</p>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', marginBottom: 4 }}>
            {user?.name || 'User'} 👋
          </h2>
          <p style={{ color: '#64748B', margin: 0 }}>Here's what's happening with your finances today.</p>
        </div>
        <button className="btn-ghost d-flex align-items-center gap-2">
          <Calendar size={15} />
          {now.toLocaleDateString('en-US', { weekday:'short', month:'long', day:'numeric', year:'numeric' })}
        </button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <motion.div variants={container} className="stats-grid mb-4">
        <StatCard title="Total Expenses"     value={`$${totalSpent.toFixed(2)}`}         change="12.5%" positive={false} color="purple" accent="#7C3AED" icon={Wallet}      sparkData={sparkline1} sparkColor="#A78BFA" />
        <StatCard title="This Month"         value={`$${totalSpent.toFixed(2)}`}         change="8.2%"  positive={true}  color="blue"   accent="#2563EB" icon={TrendingUp}   sparkData={sparkline2} sparkColor="#60A5FA" />
        <StatCard title="Highest Category"   value={topCat?.name || '—'}                change={topCat ? `${((topCat.value/totalSpent)*100).toFixed(0)}% of total` : '—'} positive={false} color="cyan"   accent="#06B6D4" icon={TrendingUp} />
        <StatCard title="Transactions"       value={monthExp.length.toString()}          change="4"     positive={true}  color="orange" accent="#F97316" icon={Receipt} />
      </motion.div>

      {/* ── Main Content Grid ── */}
      <div className="content-grid">

        {/* LEFT */}
        <div className="left-col">

          {/* Spending Insights */}
          <motion.div variants={fadeUp} className="glass-card p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div style={{ background:'rgba(124,58,237,0.15)', borderRadius:8, width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Sparkles size={15} color="#A78BFA" />
              </div>
              <h5 style={{ margin:0, fontWeight:700 }}>Spending Insights</h5>
              <span style={{ marginLeft:'auto', fontSize:'0.75rem', background:'rgba(124,58,237,0.15)', color:'#A78BFA', padding:'3px 10px', borderRadius:20, fontWeight:600 }}>AI Powered</span>
            </div>

            {/* Banner */}
            <div className="insight-banner mb-4">
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
                <Zap size={14} color="#A78BFA" />
                <strong style={{ color:'#A78BFA', fontSize:'0.9rem' }}>You're doing great! 🎉</strong>
              </div>
              <p style={{ color:'#94A3B8', margin:0, fontSize:'0.875rem' }}>
                Your expenses are <span style={{ color:'#fff', fontWeight:600 }}>12.5%</span> lower than last month.
              </p>
            </div>

            {/* Insight items */}
            {[
              { icon: '🍔', bg:'rgba(16,185,129,0.12)', color:'#10B981', title: topCat ? `${topCat.name} is your highest category` : 'No expenses this month', sub: topCat ? `$${topCat.value.toFixed(2)} spent this month` : 'Start adding expenses' },
              { icon: '📉', bg:'rgba(37,99,235,0.12)',  color:'#60A5FA', title: 'Spending is 12.5% lower than last month', sub: 'Great job staying on track!' },
              { icon: '⚡', bg:'rgba(249,115,22,0.12)', color:'#F97316', title: `${monthExp.length} transactions this month`, sub: `Budget usage: ${progress.toFixed(0)}%` },
            ].map((item, i) => (
              <div key={i} className="insight-item">
                <div className="insight-icon" style={{ background: item.bg }}>
                  <span style={{ fontSize:'1rem' }}>{item.icon}</span>
                </div>
                <div>
                  <p style={{ margin:0, color:'#fff', fontWeight:500, fontSize:'0.875rem' }}>{item.title}</p>
                  <p style={{ margin:0, color:'#64748B', fontSize:'0.8rem' }}>{item.sub}</p>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-end mt-3">
              <button className="btn-purple-ghost">View Detailed Insights <ChevronRight size={14} /></button>
            </div>
          </motion.div>

          {/* Monthly Bar Chart */}
          <motion.div variants={fadeUp} className="glass-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 style={{ margin:0, fontWeight:700 }}>Monthly Spending Overview</h5>
              <select style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#94A3B8', fontSize:'0.8rem', padding:'4px 10px', outline:'none' }}>
                <option>This Year</option>
              </select>
            </div>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthData} margin={{ top:5, right:5, left:-20, bottom:0 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#7C3AED" />
                      <stop offset="100%" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill:'#475569', fontSize:11 }} tickFormatter={v=>`$${v}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="amount" fill="url(#barGrad)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="right-col">

          {/* Budget Card */}
          <motion.div variants={fadeUp} className="glass-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 style={{ margin:0, fontWeight:700 }}>Monthly Budget</h5>
              <button className="btn-purple-ghost" style={{ fontSize:'0.8rem', padding:'4px 12px' }}>Edit Budget</button>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <div>
                <div style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.5rem' }}>${displayBudget.toLocaleString()}</div>
                <div style={{ color:'#64748B', fontSize:'0.8rem' }}>Monthly Budget</div>
              </div>
              <div className="text-end">
                <div style={{ fontFamily:'Outfit', fontWeight:700, fontSize:'1.25rem', color:'#10B981' }}>${remaining.toFixed(2)}</div>
                <div style={{ color:'#64748B', fontSize:'0.8rem' }}>Remaining</div>
              </div>
            </div>

            <div className="progress-track mb-2">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.2, ease: [0.4,0,0.2,1] }}
              />
            </div>
            <div className="d-flex justify-content-between mb-4">
              <span style={{ color:'#A78BFA', fontSize:'0.8rem', fontWeight:600 }}>{progress.toFixed(1)}% Used</span>
              <span style={{ color:'#64748B', fontSize:'0.8rem' }}>${totalSpent.toFixed(2)} of ${displayBudget.toLocaleString()}</span>
            </div>

            {/* Radial + legend */}
            <div className="d-flex align-items-center gap-3">
              <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{v:progress},{v:100-progress}]} innerRadius={28} outerRadius={38} dataKey="v" stroke="none" startAngle={90} endAngle={-270}>
                      <Cell fill="#7C3AED" />
                      <Cell fill="rgba(255,255,255,0.05)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontWeight:800, fontSize:'0.9rem', fontFamily:'Outfit' }}>{Math.round(progress)}%</span>
                  <span style={{ color:'#64748B', fontSize:'0.6rem' }}>Used</span>
                </div>
              </div>
              <div className="flex-grow-1">
                {[{label:'Spent', value:`$${totalSpent.toFixed(2)}`, color:'#7C3AED'},{label:'Remaining', value:`$${remaining.toFixed(2)}`, color:'#2563EB'}].map(item => (
                  <div key={item.label} className="d-flex justify-content-between align-items-center mb-2">
                    <span className="d-flex align-items-center gap-2" style={{ color:'#94A3B8', fontSize:'0.8rem' }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:item.color }} />
                      {item.label}
                    </span>
                    <span style={{ color:'#fff', fontWeight:600, fontSize:'0.85rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Category Donut */}
          <motion.div variants={fadeUp} className="glass-card p-4" style={{ flex:1 }}>
            <h5 style={{ margin:'0 0 1.25rem', fontWeight:700 }}>Expenses by Category</h5>

            <div className="d-flex align-items-center gap-3">
              <div style={{ position:'relative', width:130, height:130, flexShrink:0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={catData.length ? catData : [{name:'None',value:1}]} innerRadius={42} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                      {(catData.length ? catData : [{name:'None'}]).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontWeight:800, fontSize:'0.85rem', fontFamily:'Outfit' }}>${totalSpent.toFixed(0)}</span>
                  <span style={{ color:'#64748B', fontSize:'0.65rem' }}>Total</span>
                </div>
              </div>

              <div className="flex-grow-1">
                {catData.slice(0,5).map((cat, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between mb-2">
                    <span className="d-flex align-items-center gap-2" style={{ fontSize:'0.78rem', color:'#94A3B8', minWidth:0 }}>
                      <div style={{ width:7, height:7, borderRadius:'50%', background:COLORS[i%COLORS.length], flexShrink:0 }} />
                      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cat.name}</span>
                    </span>
                    <span style={{ fontSize:'0.78rem', color:'#fff', fontWeight:600, flexShrink:0, marginLeft:8 }}>
                      {totalSpent ? ((cat.value/totalSpent)*100).toFixed(0) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-ghost mt-4" style={{ width:'100%', justifyContent:'space-between' }}>
              View All Categories <ChevronRight size={14} />
            </button>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
