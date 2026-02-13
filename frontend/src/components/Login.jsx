import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../services/api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    const res = await post('/auth/login', { email, password });
    setLoading(false);
    if(res.status===200 && res.data.token){ localStorage.setItem('token', res.data.token); nav('/'); }
    else alert(res.data.message || 'Login failed');
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70vh'}}>
      <div className="card" style={{maxWidth:420,width:'100%',padding:20}}>
        <h2 style={{marginTop:0}}>Sign in</h2>
        <p style={{color:'var(--muted)'}}>Use seeded admin or register a new account.</p>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button className="btn" type="submit" disabled={loading}>{loading? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div style={{marginTop:12,display:'flex',justifyContent:'space-between'}}>
          <Link to="/forgot">Forgot password?</Link>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
