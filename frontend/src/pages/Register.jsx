import React, { useState } from 'react';
import { post } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    const res = await post('/auth/register', { name, email, password, role });
    if(res.status===200 && res.data.token){ localStorage.setItem('token', res.data.token); nav('/'); }
    else alert(res.data.message || 'Registration failed');
  }

  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'70vh'}}>
      <div className="card" style={{maxWidth:480,width:'100%',padding:20}}>
        <h2 style={{marginTop:0}}>Register</h2>
        <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:8}}>
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
          </select>
          <button className="btn" type="submit">Create account</button>
        </form>
      </div>
    </div>
  );
}
