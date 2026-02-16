import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/api';

const mock = { id:0, name: 'Unknown', stock: 0, price: 0 };

export default function PharmacyDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/pharmacies/${id}`, t);
      if(res.status===200) { setItem(res.data); setForm(res.data); }
      else { setItem(mock); setForm(mock); }
    })();
  },[id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/pharmacies/${id}`, form, t);
    if(res.status === 200) {
      setItem(res.data);
      setEdit(false);
    } else {
      alert('Error updating pharmacy');
    }
  };

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Pharmacy Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        {!edit ? (
          <>
            <div style={{fontWeight:700, fontSize:18}}>{item.name}</div>
            <div style={{color:'var(--muted)', marginTop:8}}>ID: {item.id}</div>
            <div>Stock: {item.stock} units</div>
            <div>Price: ${item.price}</div>
            <button className="btn" onClick={()=>setEdit(true)} style={{marginTop:16}}>Edit</button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input placeholder="Name" value={form.name || ''} onChange={e=>setForm({...form, name: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input type="number" placeholder="Stock" value={form.stock || ''} onChange={e=>setForm({...form, stock: parseInt(e.target.value)})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input type="number" step="0.01" placeholder="Price" value={form.price || ''} onChange={e=>setForm({...form, price: parseFloat(e.target.value)})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <div style={{display:'flex', gap:10}}>
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn" style={{background:'#ccc'}} onClick={()=>{setEdit(false); setForm(item);}}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
