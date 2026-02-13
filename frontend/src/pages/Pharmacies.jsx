import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [ { id:1, name:'Paracetamol', stock:120, price:1.25 }, { id:2, name:'Amoxicillin', stock:60, price:3.5 } ];

export default function Pharmacies(){
  const [list, setList] = useState([]);
  const [name, setName] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/pharmacies', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/pharmacies', { name, stock, price }, t); if(res.status===200){ setName(''); setStock(''); setPrice(''); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Pharmacy</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />
        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="grid">
        {list.map(p=> <div className="card col-3" key={p.id}><div style={{fontWeight:700}}>{p.name}</div><div style={{color:'var(--muted)'}}>Stock: {p.stock}</div><div style={{marginTop:6}}>Price: ${p.price}</div></div>)}
      </div>
    </div>
  );
}
