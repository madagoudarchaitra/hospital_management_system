import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/api';

const mock = { id:0, doctor: 'Dr. Unknown', patient: 'Unknown', date: new Date().toISOString(), status: 'scheduled' };

export default function AppointmentDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/appointments/${id}`, t);
      if(res.status===200) { setItem(res.data); setForm(res.data); }
      else { setItem(mock); setForm(mock); }
    })();
  },[id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/appointments/${id}`, form, t);
    if(res.status === 200) {
      setItem(res.data);
      setEdit(false);
    } else {
      alert('Error updating appointment');
    }
  };

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Appointment Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        {!edit ? (
          <>
            <div style={{fontWeight:700, fontSize:18}}>ID: {item.id}</div>
            <div style={{color:'var(--muted)', marginTop:8}}>Doctor: {item.doctor || item.doctorId}</div>
            <div>Patient: {item.patient || item.patientId}</div>
            <div>Date: {new Date(item.date).toLocaleString()}</div>
            <div style={{marginTop:8}}>Status: <strong>{item.status}</strong></div>
            <button className="btn" onClick={()=>setEdit(true)} style={{marginTop:16}}>Edit</button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input placeholder="Doctor ID" value={form.doctorId || ''} onChange={e=>setForm({...form, doctorId: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input placeholder="Patient ID" value={form.patientId || ''} onChange={e=>setForm({...form, patientId: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input type="datetime-local" value={form.date ? new Date(form.date).toISOString().slice(0,16) : ''} onChange={e=>setForm({...form, date: new Date(e.target.value).toISOString()})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <select value={form.status || ''} onChange={e=>setForm({...form, status: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}}>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
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
