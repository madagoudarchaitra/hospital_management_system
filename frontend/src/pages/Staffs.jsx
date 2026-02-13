import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [ { id:1, name:'Nurse Joy', role:'Nurse' }, { id:2, name:'John Worker', role:'Technician' } ];

export default function Staffs(){
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/staffs', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/staffs', { name, role }, t); if(res.status===200){ setName(''); setRole(''); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Staff</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Role" value={role} onChange={e=>setRole(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="grid">
        {list.map(s=> <div key={s.id} className="card col-3"><div style={{fontWeight:700}}>{s.name}</div><div style={{color:'var(--muted)'}}>{s.role}</div></div>)}
      </div>
    </div>
  );
}
