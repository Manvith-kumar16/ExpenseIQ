import { useState, useEffect, useRef, useContext } from 'react';
import { Search, Bell, X, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import api from '../services/api';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const initials = user?.name?.charAt(0).toUpperCase() || 'M';

  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const dropdownRef = useRef(null);

  // Build real notifications from expenses + budget data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [expRes, budRes] = await Promise.all([
          api.get('/expenses'),
          api.get('/budget'),
        ]);

        const expenses = expRes.data.data || [];
        const budget   = budRes.data.data?.amount || 0;

        const now = new Date();
        const thisMonth = expenses.filter(e => {
          const d = new Date(e.date);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        });

        const totalSpent = thisMonth.reduce((s, e) => s + e.amount, 0);
        const pct = budget ? (totalSpent / budget) * 100 : 0;

        const notes = [];

        // Budget alerts
        if (budget && pct >= 90) {
          notes.push({
            id: 'budget-critical',
            icon: AlertTriangle,
            iconColor: '#EF4444',
            iconBg: 'rgba(239,68,68,0.12)',
            title: 'Critical: Budget almost exhausted',
            body: `You've used ${pct.toFixed(0)}% of your $${budget.toLocaleString()} budget.`,
            time: 'Just now',
            type: 'danger',
          });
        } else if (budget && pct >= 75) {
          notes.push({
            id: 'budget-warning',
            icon: AlertTriangle,
            iconColor: '#F97316',
            iconBg: 'rgba(249,115,22,0.12)',
            title: 'Budget Warning',
            body: `You've used ${pct.toFixed(0)}% of your monthly budget.`,
            time: 'Just now',
            type: 'warning',
          });
        }

        // Recent expenses (last 3)
        const recent = [...expenses]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3);

        recent.forEach(exp => {
          notes.push({
            id: exp._id,
            icon: DollarSign,
            iconColor: '#7C3AED',
            iconBg: 'rgba(124,58,237,0.12)',
            title: `New expense: ${exp.title}`,
            body: `$${exp.amount.toFixed(2)} · ${exp.category}`,
            time: new Date(exp.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            type: 'expense',
          });
        });

        // Monthly summary
        if (thisMonth.length > 0) {
          notes.push({
            id: 'monthly-summary',
            icon: TrendingUp,
            iconColor: '#10B981',
            iconBg: 'rgba(16,185,129,0.12)',
            title: 'Monthly Summary',
            body: `${thisMonth.length} transactions totalling $${totalSpent.toFixed(2)} this month.`,
            time: 'This month',
            type: 'info',
          });
        }

        setNotifications(notes);
        setUnread(notes.length);
      } catch (e) {
        console.error('Failed to load notifications', e);
      }
    };

    fetchNotifications();
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) setUnread(0); // mark as read when opened
  };

  const dismiss = (id) => {
    setNotifications(n => n.filter(x => x.id !== id));
  };

  return (
    <header className="top-navbar">
      {/* Search */}
      <div className="search-bar">
        <Search size={15} color="#475569" />
        <input type="text" placeholder="Search expenses..." />
        <span className="kbd">⌘ K</span>
      </div>

      {/* Right actions */}
      <div className="navbar-actions">

        {/* Notification Bell */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button className="icon-btn" onClick={handleOpen} title="Notifications">
            <Bell size={16} />
            {unread > 0 && (
              <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',
              right: 0,
              width: 360,
              background: '#0F172A',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              zIndex: 999,
              overflow: 'hidden',
            }}>
              {/* Header */}
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h6 style={{ margin: 0, fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem' }}>Notifications</h6>
                  <p style={{ margin: 0, color: '#475569', fontSize: '0.75rem' }}>{notifications.length} alerts</p>
                </div>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, color: '#A78BFA', fontSize: '0.75rem', padding: '4px 10px', cursor: 'pointer' }}>
                    Clear all
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                    <CheckCircle size={36} color="#10B981" style={{ marginBottom: 12 }} />
                    <p style={{ color: '#475569', margin: 0, fontSize: '0.875rem' }}>You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map(n => {
                    const Icon = n.icon;
                    return (
                      <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.9rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ width: 38, height: 38, background: n.iconBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={17} color={n.iconColor} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: '#fff', marginBottom: 2 }}>{n.title}</p>
                          <p style={{ margin: 0, color: '#64748B', fontSize: '0.78rem', lineHeight: 1.4 }}>{n.body}</p>
                          <p style={{ margin: '4px 0 0', color: '#334155', fontSize: '0.72rem' }}>{n.time}</p>
                        </div>
                        <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', color: '#334155', cursor: 'pointer', padding: 2, flexShrink: 0, lineHeight: 1 }}>
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="user-avatar">{initials}</div>

        {/* User info (desktop) */}
        <div className="d-none d-lg-block" style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.name || 'User'}</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
