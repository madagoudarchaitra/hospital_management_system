import React, { useState } from 'react';
import { post } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    const res = await post('/auth/register', { name, email, password, role });
    if(res.status===200 && res.data.token){ 
      localStorage.setItem('token', res.data.token); 
      nav('/'); 
    } else {
      setError(res.data.message || res.data.errors?.[0]?.msg || 'Registration failed');
    }
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70vh'}}>
      <div className="card" style={{maxWidth:480,width:'100%',padding:20}}>
        <h2 style={{marginTop:0}}>Register</h2>
        {error && (
          <div style={{background:'#fee2e2', color:'#991b1b', padding:'10px 12px', borderRadius:6, marginBottom:12, fontSize:14}}>
            {error}
          </div>
        )}
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}} autoComplete="off">
          <input placeholder="👤 Name" type="text" value={name} onChange={e=>setName(e.target.value)} autoComplete="off" required />
          <input placeholder="📧 Email" type="text" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="off" required />
          <input placeholder="🔒 Password (min 6 characters)" type="text" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="new-password" required minLength={6} />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="patient">👨‍⚕️ Patient</option>
            <option value="doctor">🩺 Doctor</option>
            <option value="staff">👩‍⚕️ Staff</option>
          </select>
          <button className="btn" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
