import React, { useEffect, useState } from 'react';
import { get } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [
  { id:1, name: 'Alice Johnson', age: 34, gender:'F' },
  { id:2, name: 'Bob Smith', age: 48, gender:'M' },
  { id:3, name: 'Carol Lee', age: 29, gender:'F' }
];

export default function Patients(){
  const [list, setList] = useState([]);
  const nav = useNavigate();

  useEffect(()=>{ (async ()=>{ const t = localStorage.getItem('token'); const res = await get('/patients', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); })(); }, []);

  return (
    <div>
      <h3>Patients</h3>
      <div className="grid">
        {list.map(p=> (
          <div key={p.id} className="card col-4" style={{padding:12}}>
            <div style={{fontWeight:700}}>{p.User?.name || p.name}</div>
            <div style={{color:'var(--muted)'}}>Age: {p.age || 'N/A'} • {p.gender || 'N/A'}</div>
            <div style={{marginTop:8}}><button className="btn" onClick={()=>nav(`/patients/${p.id}`)}>View</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
