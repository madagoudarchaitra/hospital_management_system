import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get } from '../services/api';

const mock = { id:0, name:'Unknown', specialty:'N/A', qualifications:'No details available' };

export default function DoctorDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/doctors/${id}`, t);
      if(res.status===200) setItem(res.data);
      else setItem(mock);
    })();
  },[id]);

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Doctor Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        <div style={{fontWeight:700, fontSize:18}}>{item.User?.name || item.name}</div>
        <div style={{color:'var(--muted)'}}>ID: {item.id}</div>
        <div>Specialty: {item.specialty || 'General'}</div>
        <div>Qualifications: {item.qualifications || 'N/A'}</div>
        <div style={{marginTop:8}}><strong>Experience:</strong><div style={{marginTop:6}}>{item.experience || '—'}</div></div>
      </div>
    </div>
  );
}
