import React, { useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, patientName: 'Alice Johnson', recordDate: new Date().toISOString(), diagnosis: 'Hypertension', treatment: 'Prescribed antihypertensive medication', notes: 'Follow-up in 30 days', doctor: 'Dr. Emma Brown' },
  { id: 2, patientName: 'Bob Smith', recordDate: new Date().toISOString(), diagnosis: 'Type 2 Diabetes', treatment: 'Diet control & Metformin', notes: 'Monitor blood glucose levels', doctor: 'Dr. Aaron Clark' }
];

export default function MedicalRecords(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', patientName: '', diagnosis: '', treatment: '', notes: '', doctor: '' });

  React.useEffect(() => {
    const filtered = list.filter(r =>
      (r.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.diagnosis || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.doctor || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newRecord = { 
      id: Date.now(), 
      ...form,
      recordDate: new Date().toISOString() 
    };
    const updatedList = [...list, newRecord];
    setList(updatedList);
    setFilteredList(updatedList);
    setForm({ patientId: '', patientName: '', diagnosis: '', treatment: '', notes: '', doctor: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this medical record?')) return;
    setList(list.filter(r => r.id !== id));
  };

  const getSeverityColor = (diagnosis) => {
    if(['Critical', 'Emergency', 'ICU'].some(s => diagnosis.includes(s))) return '#ef4444';
    if(['Serious', 'Acute'].some(s => diagnosis.includes(s))) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>📋 Medical Records</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ New Record</button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search by patient, diagnosis, or doctor..." 
        value={search} 
        onChange={(e)=>setSearch(e.target.value)}
        style={{padding:10, width:'100%', maxWidth:500, borderRadius:8, border:'1px solid #e0f2fe', marginBottom:15}}
      />

      <AddForm 
        title="Add Medical Record" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="number" placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required />
        <input type="text" placeholder="Patient Name" value={form.patientName} onChange={e=>setForm({...form, patientName:e.target.value})} required />
        <input type="text" placeholder="Diagnosis" value={form.diagnosis} onChange={e=>setForm({...form, diagnosis:e.target.value})} required />
        <input type="text" placeholder="Treatment Plan" value={form.treatment} onChange={e=>setForm({...form, treatment:e.target.value})} required />
        <input type="text" placeholder="Doctor Name" value={form.doctor} onChange={e=>setForm({...form, doctor:e.target.value})} required />
        <textarea placeholder="Clinical Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} style={{minHeight:80}} />
      </AddForm>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(350px,1fr))', gap:16}}>
        {filteredList.length > 0 ? filteredList.map(r => (
          <div key={r.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>{r.patientName}</div>
                <div style={{fontSize:12, color:'var(--muted)', marginTop:4}}>{new Date(r.recordDate).toLocaleString()}</div>
              </div>
              <div style={{fontSize:11, fontWeight:700, color:'#fff', background:getSeverityColor(r.diagnosis), padding:'4px 8px', borderRadius:6}}>
                {r.diagnosis.split(' ')[0]}
              </div>
            </div>
            
            <div style={{background:'#f0f9ff', padding:10, borderRadius:8, marginBottom:12}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Diagnosis</div>
              <div style={{fontWeight:700, fontSize:13}}>{r.diagnosis}</div>
            </div>

            <div style={{background:'#f0fdf4', padding:10, borderRadius:8, marginBottom:12}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Treatment</div>
              <div style={{fontWeight:600, fontSize:13}}>{r.treatment}</div>
            </div>

            {r.notes && (
              <div style={{background:'#fef3c7', padding:10, borderRadius:8, marginBottom:12}}>
                <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Notes</div>
                <div style={{fontSize:12, lineHeight:1.5}}>{r.notes}</div>
              </div>
            )}

            <div style={{fontSize:12, color:'var(--muted)', marginBottom:12}}>👨‍⚕️ {r.doctor}</div>

            <button className="btn" style={{width:'100%', background:'#ef4444'}} onClick={()=>handleDelete(r.id)}>Delete Record</button>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20, gridColumn:'1/-1'}}>No medical records found</div>}
      </div>
    </div>
  );
}
