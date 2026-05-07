import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [submitting, setSubmitting] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSubmitting(true);
    const ok = await register({ name: form.name, email: form.email, password: form.password });
    setSubmitting(false);
    if (ok) navigate('/dashboard');
  };

  const perks = [
    'Unlimited expense tracking',
    'AI-powered spending insights',
    'Monthly budget management',
    'Beautiful analytics dashboard',
  ];

  return (
    <div className="auth-layout">
      {/* Brand */}
      <div className="auth-brand">
        <motion.div initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'3rem' }}>
            <div style={{ width:42, height:42, background:'linear-gradient(135deg, #7C3AED, #2563EB)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 30px rgba(124,58,237,0.5)' }}>
              <Zap size={22} color="white" fill="white" />
            </div>
            <span style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.4rem', color:'white' }}>ExpenseIQ</span>
          </div>
          <h1 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'2.1rem', color:'white', letterSpacing:'-0.03em', marginBottom:'1rem', lineHeight:1.2 }}>
            Start your financial<br />
            <span style={{ background:'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              journey for free
            </span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', marginBottom:'2.5rem', lineHeight:1.6 }}>
            Get started in minutes. No credit card required.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {perks.map(perk => (
              <div key={perk} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <CheckCircle size={16} color="#10B981" />
                <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.9rem' }}>{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="auth-form-section">
        <motion.div className="auth-card" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.6, delay:0.1 }}>
          <div className="mb-4">
            <h2 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.02em', marginBottom:8 }}>Create your account</h2>
            <p style={{ color:'#64748B', margin:0, fontSize:'0.9rem' }}>Fill in the details below to get started</p>
          </div>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position:'relative' }}>
                <User size={16} color="#475569" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input className="form-input" style={{ paddingLeft:'2.5rem' }} name="name" placeholder="John Doe" value={form.name} onChange={onChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div style={{ position:'relative' }}>
                <Mail size={16} color="#475569" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input className="form-input" style={{ paddingLeft:'2.5rem' }} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={onChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="#475569" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input className="form-input" style={{ paddingLeft:'2.5rem', paddingRight:'2.5rem' }} type={showPw ? 'text' : 'password'} name="password" placeholder="Min 6 characters" value={form.password} onChange={onChange} required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#475569', cursor:'pointer', padding:0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position:'relative' }}>
                <Lock size={16} color="#475569" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }} />
                <input className="form-input" style={{ paddingLeft:'2.5rem' }} type="password" name="confirmPassword" placeholder="Repeat password" value={form.confirmPassword} onChange={onChange} required />
              </div>
            </div>

            <button type="submit" className="btn-primary mt-3" style={{ width:'100%', justifyContent:'center', padding:'0.75rem', fontSize:'0.95rem' }} disabled={submitting}>
              {submitting ? <><span className="spinner-border spinner-border-sm me-2" /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ color:'#64748B', fontSize:'0.875rem', textAlign:'center', marginTop:'1.5rem', marginBottom:0 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#A78BFA', fontWeight:600, textDecoration:'none' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
