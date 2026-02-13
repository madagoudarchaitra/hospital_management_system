import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';

const mock = [ { id:1, patient:'Alice Johnson', amount:200.0, status:'pending' }, { id:2, patient:'Bob Smith', amount:150.0, status:'paid' } ];

export default function Billings(){
  const [list, setList] = useState([]);
  const [patientId, setPatientId] = useState('');
  const [amount, setAmount] = useState('');

  async function load(){ const t = localStorage.getItem('token'); const res = await get('/billings', t); if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); else setList(mock); }
  useEffect(()=>{ load(); }, []);

  async function create(e){ e.preventDefault(); const t = localStorage.getItem('token'); const res = await post('/billings', { patientId, amount }, t); if(res.status===200){ setPatientId(''); setAmount(''); load(); } else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Billings</h3>
      <form onSubmit={create} style={{ marginBottom: 10, display:'flex',gap:8,flexWrap:'wrap' }}>
        <input placeholder="Patient ID" value={patientId} onChange={e=>setPatientId(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Patient</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>{list.map(b=> <tr key={b.id}><td>{b.id}</td><td>{b.patient || b.patientId}</td><td>{b.amount}</td><td>{b.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
