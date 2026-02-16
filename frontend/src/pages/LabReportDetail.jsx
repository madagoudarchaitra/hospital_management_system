import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { get, put } from '../services/api';

const mock = { id:0, patient: 'Unknown', reportType: 'Unknown', result: 'N/A' };

export default function LabReportDetail(){
  const { id } = useParams();
  const nav = useNavigate();
  const [item, setItem] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});

  useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t){ setItem(mock); return; }
      const res = await get(`/lab-reports/${id}`, t);
      if(res.status===200) { setItem(res.data); setForm(res.data); }
      else { setItem(mock); setForm(mock); }
    })();
  },[id]);

  const handleSave = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/lab-reports/${id}`, form, t);
    if(res.status === 200) {
      setItem(res.data);
      setEdit(false);
    } else {
      alert('Error updating lab report');
    }
  };

  if(!item) return <div>Loading...</div>;

  return (
    <div>
      <button className="btn" onClick={()=>nav(-1)}>Back</button>
      <h3>Lab Report Details</h3>
      <div className="card" style={{padding:16, maxWidth:600}}>
        {!edit ? (
          <>
            <div style={{fontWeight:700, fontSize:18}}>{item.reportType}</div>
            <div style={{color:'var(--muted)', marginTop:8}}>Patient: {item.patient || item.patientId}</div>
            <div>Result: {item.result}</div>
            <button className="btn" onClick={()=>setEdit(true)} style={{marginTop:16}}>Edit</button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input placeholder="Patient ID" value={form.patientId || ''} onChange={e=>setForm({...form, patientId: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <input placeholder="Report Type" value={form.reportType || ''} onChange={e=>setForm({...form, reportType: e.target.value})} style={{marginBottom:10, padding:8, width:'100%'}} />
            <textarea placeholder="Result" value={form.result || ''} onChange={e=>setForm({...form, result: e.target.value})} style={{marginBottom:10, padding:8, width:'100%', minHeight:80}} />
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
