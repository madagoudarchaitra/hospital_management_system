import React, { useEffect, useState } from 'react';
import { get, post, remove } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [ { id:1, patient:'Alice Johnson', reportType:'Blood Test', result:'Normal' }, { id:2, patient:'Bob Smith', reportType:'X-Ray', result:'No issues' } ];

export default function LabReports(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({patientId:'', reportType:'', result:''});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/lab-reports', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    const filtered = list.filter(r => 
      (r.patient || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.reportType || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.result || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/lab-reports', form, t); 
    if(res.status===200){ 
      setForm({patientId:'', reportType:'', result:''}); 
      setShowForm(false);
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/lab-reports/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting lab report');
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>Lab Reports</h3>
        <button className="btn" onClick={()=>setShowForm(!showForm)}>+ Add Lab Report</button>
      </div>

      <div style={{marginBottom:20}}>
        <input 
          type="text" 
          placeholder="🔍 Search by patient, report type, or result..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, width:'100%', maxWidth:400, borderRadius:6, border:'1px solid #ddd'}}
        />
        <div style={{color:'var(--muted)', fontSize:12, marginTop:6}}>
          Found {filteredList.length} result(s)
        </div>
      </div>

      {showForm && (
        <div className="card" style={{padding:20, marginBottom:20}}>
          <h4>Add New Lab Report</h4>
          <form onSubmit={handleAdd}>
            <input placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <input placeholder="Report Type" value={form.reportType} onChange={e=>setForm({...form, reportType: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <textarea placeholder="Result" value={form.result} onChange={e=>setForm({...form, result: e.target.value})} style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box', minHeight:80}} />
            <div style={{display:'flex', gap:10}}>
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn" style={{background:'#ccc'}} onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {filteredList.map(r=> (
          <div key={r.id} className="card col-4" style={{padding:12}}>
            <div style={{fontWeight:700}}>{r.reportType}</div>
            <div style={{color:'var(--muted)'}}>Patient: {r.patient || r.patientId}</div>
            <div style={{marginTop:6}}>Result: {r.result}</div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button className="btn" onClick={()=>nav(`/lab-reports/${r.id}`)}>View</button>
              <button className="btn" style={{background:'#dc3545'}} onClick={()=>handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && <div style={{textAlign:'center', color:'var(--muted)', marginTop:20}}>No lab reports found</div>}
    </div>
  );
}
