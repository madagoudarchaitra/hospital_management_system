import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [ { id:1, patient:'Alice Johnson', reportType:'Blood Test', result:'Normal' }, { id:2, patient:'Bob Smith', reportType:'X-Ray', result:'No issues' } ];

export default function LabReports(){
  const [list, setList] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [reportType, setReportType] = useState('');
  const [result, setResult] = useState('');

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/lab-reports', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/lab-reports', { patientId, reportType, result }, t); if(res.status===200){ setPatientId(''); setReportType(''); setResult(''); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Lab Reports</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Patient ID" value={patientId} onChange={e=>setPatientId(e.target.value)} />
        <input placeholder="Report Type" value={reportType} onChange={e=>setReportType(e.target.value)} />
        <input placeholder="Result" value={result} onChange={e=>setResult(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="grid">
        {list.map(r=> <div key={r.id} className="card col-4"><div style={{fontWeight:700}}>{r.reportType}</div><div style={{color:'var(--muted)'}}>Patient: {r.patient || r.patientId}</div><div style={{marginTop:6}}>Result: {r.result}</div></div>)}
      </div>
    </div>
  );
}
