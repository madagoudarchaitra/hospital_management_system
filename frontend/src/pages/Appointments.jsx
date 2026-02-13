import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [
  { id:1, doctor:'Dr. Emma Brown', patient:'Alice Johnson', date: new Date().toISOString(), status:'scheduled' },
  { id:2, doctor:'Dr. Aaron Clark', patient:'Bob Smith', date: new Date().toISOString(), status:'completed' }
];

export default function Appointments(){
  const [list, setList] = useState([]);
  const [doctorId, setDoctorId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [date, setDate] = useState('');

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/appointments', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/appointments', { doctorId, patientId, date }, t); if(res.status===200) { setDoctorId(''); setPatientId(''); setDate(''); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Appointments</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Doctor ID" value={doctorId} onChange={e=>setDoctorId(e.target.value)} />
        <input placeholder="Patient ID" value={patientId} onChange={e=>setPatientId(e.target.value)} />
        <input placeholder="Date (ISO)" value={date} onChange={e=>setDate(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="grid">
        {list.map(a=> (
          <div key={a.id} className="card col-4">
            <div style={{fontWeight:700}}>{a.doctor || `Dr #${a.doctorId}`}</div>
            <div style={{color:'var(--muted)'}}>Patient: {a.patient || `#${a.patientId}`}</div>
            <div style={{marginTop:8}}>{new Date(a.date).toLocaleString()}</div>
            <div style={{marginTop:6,fontSize:12,color:'var(--muted)'}}>Status: {a.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
