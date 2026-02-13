import React, { useEffect, useState } from 'react';
import { get } from '../services/api';

const mock = [
  { id:1, name: 'Dr. Emma Brown', specialty: 'Cardiology' },
  { id:2, name: 'Dr. Aaron Clark', specialty: 'Orthopedics' },
  { id:3, name: 'Dr. Sunita Rao', specialty: 'Pediatrics' }
];

export default function Doctors(){
  const [list, setList] = useState([]);

  useEffect(()=>{ (async ()=>{ const t = localStorage.getItem('token'); const res = await get('/doctors', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); })(); }, []);

  return (
    <div>
      <h3>Doctors</h3>
      <div className="grid">
        {list.map(d=> (
          <div key={d.id} className="card col-4" style={{padding:12}}>
            <div style={{fontWeight:700}}>{d.User?.name || d.name}</div>
            <div style={{color:'var(--muted)'}}>Specialty: {d.specialty || 'General'}</div>
            <div style={{marginTop:8}}><button className="btn">View</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
