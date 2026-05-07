import { useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, Crown } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const fadeUp = { hidden:{opacity:0,y:16}, show:{opacity:1,y:0} };

const Profile = () => {
  const { user } = useContext(AuthContext);
  const initials = user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }}>
      <motion.div variants={fadeUp} className="mb-4">
        <h2 style={{ fontFamily:'Outfit', fontWeight:800, fontSize:'1.6rem', letterSpacing:'-0.03em', marginBottom:4 }}>Profile</h2>
        <p style={{ color:'#64748B', margin:0 }}>Manage your account information</p>
      </motion.div>

      <div style={{ maxWidth:640 }}>
        {/* Hero card */}
        <motion.div variants={fadeUp} className="glass-card p-4 mb-4 text-center" style={{ background:'linear-gradient(145deg, rgba(124,58,237,0.2), rgba(15,23,42,0.9))', borderColor:'rgba(124,58,237,0.3)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:200, height:200, background:'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', borderRadius:'50%' }} />
          <div style={{ width:80, height:80, background:'linear-gradient(135deg, #7C3AED, #2563EB)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Outfit', fontWeight:800, fontSize:'2rem', margin:'0 auto 1rem', boxShadow:'0 0 30px rgba(124,58,237,0.4)' }}>
            {initials}
          </div>
          <h3 style={{ fontFamily:'Outfit', fontWeight:700, marginBottom:4 }}>{user?.name || 'User'}</h3>
          <div className="d-flex align-items-center justify-content-center gap-2" style={{ color:'#94A3B8', fontSize:'0.875rem' }}>
            <Crown size={14} color="#F59E0B" /> Premium Member
            <span style={{ color:'#475569' }}>·</span>
            Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'}
          </div>
        </motion.div>

        {/* Info card */}
        <motion.div variants={fadeUp} className="glass-card no-hover" style={{ overflow:'hidden' }}>
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <h5 style={{ margin:0, fontWeight:700 }}>Account Information</h5>
          </div>

          {[
            { icon: User,        label:'Full Name',     value: user?.name,  color:'#7C3AED' },
            { icon: Mail,        label:'Email Address', value: user?.email, color:'#2563EB' },
            { icon: Lock,        label:'Password',      value: '••••••••',  color:'#06B6D4' },
            { icon: ShieldCheck, label:'Account Status',value:'Active',     color:'#10B981' },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <div key={i} className="d-flex align-items-center gap-4 px-4 py-3" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width:42, height:42, background:`${color}18`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={18} color={color} />
              </div>
              <div className="flex-grow-1">
                <div style={{ fontSize:'0.75rem', color:'#475569', marginBottom:2 }}>{label}</div>
                <div style={{ fontWeight:500 }}>{value || 'N/A'}</div>
              </div>
              <button className="btn-ghost" style={{ fontSize:'0.78rem', padding:'4px 12px' }} disabled>Edit</button>
            </div>
          ))}

          <div style={{ padding:'1rem 1.5rem', background:'rgba(249,115,22,0.05)', borderTop:'1px solid rgba(249,115,22,0.15)' }}>
            <p style={{ margin:0, color:'#94A3B8', fontSize:'0.8rem' }}>
              💡 Profile editing is coming in the next release. Stay tuned!
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;
