import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, ArrowUpDown, Download, Trash2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { exportToCSV } from '../utils/exportUtils';
import ExpenseModal from '../components/ExpenseModal';
import DeleteModal from '../components/DeleteModal';

const CAT_COLORS = {
  Food:          { bg:'rgba(16,185,129,0.12)',  color:'#10B981' },
  Travel:        { bg:'rgba(6,182,212,0.12)',   color:'#06B6D4' },
  Shopping:      { bg:'rgba(239,68,68,0.12)',   color:'#EF4444' },
  Bills:         { bg:'rgba(37,99,235,0.12)',   color:'#2563EB' },
  Entertainment: { bg:'rgba(124,58,237,0.12)',  color:'#A78BFA' },
  Health:        { bg:'rgba(16,185,129,0.12)',  color:'#34D399' },
  Education:     { bg:'rgba(249,115,22,0.12)',  color:'#F97316' },
  Other:         { bg:'rgba(100,116,139,0.12)', color:'#94A3B8' },
};

const CATS = ['All','Food','Travel','Shopping','Bills','Entertainment','Health','Education','Other'];
const PER_PAGE = 10;
const fadeUp = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0} };

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('dateDesc');
  const [page, setPage] = useState(1);

  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search, cat, sort]);

  const load = async () => {
    try { setLoading(true); const r = await api.get('/expenses'); setExpenses(r.data.data); }
    catch { toast.error('Failed to load expenses'); }
    finally { setLoading(false); }
  };

  const handleSave = async (data) => {
    try {
      selected ? await api.put(`/expenses/${selected._id}`, data) : await api.post('/expenses', data);
      toast.success(selected ? 'Expense updated' : 'Expense added');
      setShowModal(false); load();
    } catch(e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete(`/expenses/${selected._id}`); toast.success('Deleted'); setShowDelete(false); load(); }
    catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const filtered = expenses
    .filter(e => e.title?.toLowerCase().includes(search.toLowerCase()) && (cat === 'All' || e.category === cat))
    .sort((a,b) => {
      if (sort === 'dateDesc')   return new Date(b.date) - new Date(a.date);
      if (sort === 'dateAsc')    return new Date(a.date) - new Date(b.date);
      if (sort === 'amountDesc') return b.amount - a.amount;
      return a.amount - b.amount;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const pageData   = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);
  const totalFiltered = filtered.reduce((s,e) => s + e.amount, 0);

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07 } } }}>

      {/* Header */}
      <motion.div variants={fadeUp} className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.03em', marginBottom:4 }}>My Expenses</h2>
          <p style={{ color:'#64748B', margin:0, fontSize:'0.875rem' }}>
            {filtered.length} transactions · <span style={{ color:'#A78BFA' }}>${totalFiltered.toFixed(2)} total</span>
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn-ghost d-flex align-items-center gap-2" onClick={() => exportToCSV(filtered)}>
            <Download size={15} /> Export CSV
          </button>
          <button className="btn-primary" onClick={() => { setSelected(null); setShowModal(true); }}>
            <Plus size={16} /> Add Expense
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="glass-card p-4 mb-4 no-hover">
        <div className="d-flex flex-wrap gap-3 align-items-center">
          <div className="search-bar flex-grow-1" style={{ minWidth:200, maxWidth:340 }}>
            <Search size={15} color="#475569" />
            <input placeholder="Search expenses..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color:'#64748B' }}>
            <Filter size={14} />
            <select value={cat} onChange={e=>setCat(e.target.value)}
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#94A3B8', fontSize:'0.85rem', padding:'6px 12px', outline:'none' }}>
              {CATS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
          </div>
          <div className="d-flex align-items-center gap-2" style={{ color:'#64748B' }}>
            <ArrowUpDown size={14} />
            <select value={sort} onChange={e=>setSort(e.target.value)}
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, color:'#94A3B8', fontSize:'0.85rem', padding:'6px 12px', outline:'none' }}>
              <option value="dateDesc">Newest First</option>
              <option value="dateAsc">Oldest First</option>
              <option value="amountDesc">Highest Amount</option>
              <option value="amountAsc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={fadeUp} className="glass-card no-hover" style={{ overflow:'hidden' }}>
        {loading ? (
          <div className="p-4">{[...Array(5)].map((_,i) => (
            <div key={i} className="d-flex gap-3 mb-3 align-items-center">
              <div className="skeleton" style={{ width:42, height:42, borderRadius:12, flexShrink:0 }} />
              <div className="flex-grow-1">
                <div className="skeleton" style={{ height:14, width:'40%', marginBottom:6 }} />
                <div className="skeleton" style={{ height:12, width:'25%' }} />
              </div>
              <div className="skeleton" style={{ height:16, width:80 }} />
            </div>
          ))}</div>
        ) : pageData.length === 0 ? (
          <div className="empty-state m-4">
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>💸</div>
            <h5 style={{ fontFamily:'Outfit', fontWeight:700, marginBottom:8 }}>No Expenses Found</h5>
            <p style={{ color:'#64748B', marginBottom:'1.5rem' }}>Add your first expense to get started</p>
            <button className="btn-primary" onClick={() => { setSelected(null); setShowModal(true); }}>
              <Plus size={16} /> Add Expense
            </button>
          </div>
        ) : (
          <>
            {/* Desktop header */}
            <div className="d-none d-md-grid px-4 py-3" style={{ gridTemplateColumns:'1fr 130px 120px 100px 80px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              {['Transaction','Category','Date','Amount',''].map((h,i) => (
                <span key={i} style={{ fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase', color:'#475569', textAlign: i>=3?'right':undefined }}>{h}</span>
              ))}
            </div>

            {pageData.map((exp, i) => {
              const c = CAT_COLORS[exp.category] || CAT_COLORS.Other;
              return (
                <div key={exp._id} className="txn-row" style={{ gridTemplateColumns:'1fr 130px 120px 100px 80px' }}>
                  {/* Name */}
                  <div className="d-flex align-items-center gap-3">
                    <div className="txn-icon" style={{ background: c.bg }}>
                      <span style={{ fontSize:'1.1rem' }}>
                        {exp.category === 'Food' ? '🍔' : exp.category === 'Travel' ? '✈️' : exp.category === 'Shopping' ? '🛒' : exp.category === 'Bills' ? '📄' : exp.category === 'Entertainment' ? '🎬' : exp.category === 'Health' ? '💊' : exp.category === 'Education' ? '📚' : '💳'}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:'0.9rem' }}>{exp.title}</div>
                      {exp.description && <div style={{ color:'#475569', fontSize:'0.78rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>{exp.description}</div>}
                    </div>
                  </div>
                  {/* Category */}
                  <div className="d-none d-md-flex align-items-center">
                    <span className="category-badge" style={{ background: c.bg, color: c.color }}>
                      {exp.category}
                    </span>
                  </div>
                  {/* Date */}
                  <div className="d-none d-md-flex align-items-center" style={{ color:'#64748B', fontSize:'0.85rem' }}>
                    {new Date(exp.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
                  </div>
                  {/* Amount */}
                  <div className="d-none d-md-flex align-items-center justify-content-end">
                    <span style={{ fontFamily:'Outfit', fontWeight:700, color:'#EF4444' }}>-${exp.amount.toFixed(2)}</span>
                  </div>
                  {/* Mobile amount */}
                  <div className="d-flex d-md-none align-items-center ms-auto">
                    <span style={{ fontFamily:'Outfit', fontWeight:700, color:'#EF4444', fontSize:'0.9rem' }}>-${exp.amount.toFixed(2)}</span>
                  </div>
                  {/* Actions */}
                  <div className="d-none d-md-flex align-items-center justify-content-end gap-2">
                    <button className="icon-btn" style={{ width:30, height:30, borderRadius:8 }} onClick={() => { setSelected(exp); setShowModal(true); }}>
                      <Edit2 size={13} />
                    </button>
                    <button className="icon-btn" style={{ width:30, height:30, borderRadius:8, borderColor:'rgba(239,68,68,0.2)', color:'#EF4444' }} onClick={() => { setSelected(exp); setShowDelete(true); }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-between align-items-center px-4 py-3" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color:'#64748B', fontSize:'0.8rem' }}>
                  {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="d-flex gap-2">
                  <button className="btn-ghost" style={{ padding:'6px 12px' }} disabled={page===1} onClick={() => setPage(p => p-1)}>
                    <ChevronLeft size={15} />
                  </button>
                  <button className="btn-ghost" style={{ padding:'6px 12px' }} disabled={page===totalPages} onClick={() => setPage(p => p+1)}>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      <ExpenseModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSave} initialData={selected} />
      <DeleteModal  show={showDelete} handleClose={() => setShowDelete(false)} handleConfirm={handleDelete} isDeleting={deleting} />
    </motion.div>
  );
};

export default Expenses;
