import React, { useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, patientName: 'Alice Johnson', admissionDate: new Date(Date.now() - 5*24*60*60*1000).toISOString(), dischargeDate: null, department: 'Cardiology', bedNumber: '101', status: 'admitted', reason: 'Chest pain evaluation' },
  { id: 2, patientName: 'Bob Smith', admissionDate: new Date(Date.now() - 3*24*60*60*1000).toISOString(), dischargeDate: new Date(Date.now() - 1*24*60*60*1000).toISOString(), department: 'Orthopedics', bedNumber: '205', status: 'discharged', reason: 'Knee surgery' }
];

export default function Admissions(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', patientName: '', department: '', bedNumber: '', reason: '' });

  React.useEffect(() => {
    const filtered = list.filter(a =>
      (a.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.department || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.status || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newAdmission = { 
      id: Date.now(), 
      ...form,
      admissionDate: new Date().toISOString(),
      dischargeDate: null,
      status: 'admitted'
    };
    setList([...list, newAdmission]);
    setForm({ patientId: '', patientName: '', department: '', bedNumber: '', reason: '' });
    setShowForm(false);
  };

  const handleDischarge = (id) => {
    if(!window.confirm('Discharge this patient?')) return;
    setList(list.map(a => a.id === id ? { ...a, status: 'discharged', dischargeDate: new Date().toISOString() } : a));
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this admission record?')) return;
    setList(list.filter(a => a.id !== id));
  };

  const stayDays = (admission) => {
    const end = new Date(admission.dischargeDate || new Date());
    const start = new Date(admission.admissionDate);
    return Math.floor((end - start) / (1000 * 60 * 60 * 24));
  };

  const departments = ['Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'General Medicine', 'Emergency', 'ICU'];

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>🏥 Admissions & Discharge</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ Admit Patient</button>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:15}}>
        <input 
          type="text" 
          placeholder="🔍 Search by patient or department..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, flex:1, maxWidth:500, borderRadius:8, border:'1px solid #e0f2fe'}}
        />
        <div style={{display:'flex', gap:8}}>
          <span style={{padding:'10px 12px', borderRadius:8, background:'#f0f9ff', fontSize:12, fontWeight:600}}>
            Admitted: {list.filter(a => a.status === 'admitted').length}
          </span>
          <span style={{padding:'10px 12px', borderRadius:8, background:'#f0fdf4', fontSize:12, fontWeight:600}}>
            Discharged: {list.filter(a => a.status === 'discharged').length}
          </span>
        </div>
      </div>

      <AddForm 
        title="Admit New Patient" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="number" placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required />
        <input type="text" placeholder="Patient Name" value={form.patientName} onChange={e=>setForm({...form, patientName:e.target.value})} required />
        <select value={form.department} onChange={e=>setForm({...form, department:e.target.value})} required>
          <option value="">Select Department</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <input type="text" placeholder="Bed Number" value={form.bedNumber} onChange={e=>setForm({...form, bedNumber:e.target.value})} required />
        <input type="text" placeholder="Admission Reason" value={form.reason} onChange={e=>setForm({...form, reason:e.target.value})} required />
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(a => (
          <div key={a.id} className="card col-4">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12}}>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>{a.patientName}</div>
                <div style={{fontSize:12, color:'var(--muted)', marginTop:4}}>Bed {a.bedNumber}</div>
              </div>
              <div style={{fontSize:11, fontWeight:700, color:'#fff', background: a.status === 'admitted' ? '#0ea5e9' : '#10b981', padding:'4px 8px', borderRadius:6}}>
                {a.status.toUpperCase()}
              </div>
            </div>

            <div style={{background:'#f0f9ff', padding:10, borderRadius:8, marginBottom:10}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Department</div>
              <div style={{fontWeight:700}}>{a.department}</div>
            </div>

            <div style={{background:'#fef3c7', padding:10, borderRadius:8, marginBottom:10}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Reason</div>
              <div style={{fontWeight:600, fontSize:13}}>{a.reason}</div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12, fontSize:12}}>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Admission</div>
                <div style={{fontWeight:600}}>{new Date(a.admissionDate).toLocaleDateString()}</div>
              </div>
              {a.dischargeDate && (
                <div>
                  <div style={{color:'var(--muted)', marginBottom:4}}>Discharge</div>
                  <div style={{fontWeight:600}}>{new Date(a.dischargeDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>

            <div style={{fontSize:12, color:'var(--muted)', marginBottom:12}}>
              📅 Stay: {stayDays(a)} day(s)
            </div>

            <div style={{display:'flex', gap:8}}>
              {a.status === 'admitted' && (
                <button className="btn" style={{flex:1, background:'#10b981'}} onClick={()=>handleDischarge(a.id)}>Discharge</button>
              )}
              <button className="btn" style={{flex:1, background:'#ef4444'}} onClick={()=>handleDelete(a.id)}>Delete</button>
            </div>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20, gridColumn:'1/-1'}}>No admissions found</div>}
      </div>
    </div>
  );
}
