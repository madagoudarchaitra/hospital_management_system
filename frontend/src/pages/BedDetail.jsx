import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/api';

const mock = { id:0, ward: 'Unknown', number: '0', occupied: false };

export default function BedDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/beds/${id}`, t);
      if(res.status===200) { setItem(res.data); setForm(res.data); }
      else { setItem(mock); setForm(mock); }
    })();
  },[id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/beds/${id}`, form, t);
    if(res.status === 200) {
      setItem(res.data);
      setEdit(false);
    } else {
      alert('Error updating bed');
    }
  };

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Bed Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        {!edit ? (
          <>
            <div style={{fontWeight:700, fontSize:18}}>Bed {item.number}</div>
            <div style={{color:'var(--muted)', marginTop:8}}>Ward: {item.ward}</div>
            <div>Status: <strong>{item.occupied ? 'Occupied' : 'Free'}</strong></div>
            <button className="btn" onClick={()=>setEdit(true)} style={{marginTop:16}}>Edit</button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input placeholder="Ward" value={form.ward || ''} onChange={e=>setForm({...form, ward: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input placeholder="Number" value={form.number || ''} onChange={e=>setForm({...form, number: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <label style={{display:'flex',alignItems:'center',gap:6, marginBottom:10}}><input type="checkbox" checked={form.occupied || false} onChange={e=>setForm({...form, occupied: e.target.checked})} /> Occupied</label>
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
