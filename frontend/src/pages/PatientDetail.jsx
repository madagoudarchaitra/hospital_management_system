import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../services/api';

const mock = { id:0, name:'Unknown', age:'N/A', gender:'N/A', notes:'No details available' };

export default function PatientDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/patients/${id}`, t);
      if(res.status===200) setItem(res.data);
      else setItem(mock);
    })();
  },[id]);

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Patient Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        <div style={{fontWeight:700, fontSize:18}}>{item.User?.name || item.name}</div>
        <div style={{color:'var(--muted)'}}>ID: {item.id}</div>
        <div>Age: {item.age || 'N/A'}</div>
        <div>Gender: {item.gender || 'N/A'}</div>
        <div style={{marginTop:8}}><strong>Notes:</strong><div style={{marginTop:6}}>{item.notes || '—'}</div></div>
      </div>
    </div>
  );
}
