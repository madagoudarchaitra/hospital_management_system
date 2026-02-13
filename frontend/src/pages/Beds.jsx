import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [ { id:1, ward:'A', number:'101', occupied:false }, { id:2, ward:'B', number:'201', occupied:true } ];

export default function Beds(){
  const [list, setList] = useState([]);
  const [ward, setWard] = useState('');
  const [number, setNumber] = useState('');
  const [occupied, setOccupied] = useState(false);

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/beds', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/beds', { ward, number, occupied }, t); if(res.status===200){ setWard(''); setNumber(''); setOccupied(false); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Beds</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Ward" value={ward} onChange={e=>setWard(e.target.value)} />
        <input placeholder="Number" value={number} onChange={e=>setNumber(e.target.value)} />
        <label style={{display:'flex',alignItems:'center',gap:6}}><input type="checkbox" checked={occupied} onChange={e=>setOccupied(e.target.checked)} /> Occupied</label>
        <button type="submit">Create</button>
      </form>
      <div className="grid">
        {list.map(b=> <div key={b.id} className="card col-3"><div style={{fontWeight:700}}>Bed {b.number}</div><div style={{color:'var(--muted)'}}>Ward: {b.ward}</div><div style={{marginTop:6}}>Status: {b.occupied ? 'Occupied' : 'Free'}</div></div>)}
      </div>
    </div>
  );
}
