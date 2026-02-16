import React, { useEffect, useState } from 'react';
import { get, post, remove } from '../services/api';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, patientName: 'Alice Johnson', doctorName: 'Dr. Emma', medication: 'Aspirin 100mg', dosage: '1 tablet twice daily', duration: '7 days', date: new Date().toISOString() },
  { id: 2, patientName: 'Bob Smith', doctorName: 'Dr. Aaron', medication: 'Metformin 500mg', dosage: '1 tablet thrice daily', duration: '30 days', date: new Date().toISOString() }
];

export default function Prescriptions(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', doctorId: '', medication: '', dosage: '', duration: '' });

  useEffect(() => {
    const filtered = list.filter(p =>
      (p.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.medication || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.doctorName || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const newPrescription = { ...form, id: Date.now(), patientName: 'Patient', doctorName: 'Doctor', date: new Date().toISOString() };
    setList([...list, newPrescription]);
    setForm({ patientId: '', doctorId: '', medication: '', dosage: '', duration: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this prescription?')) return;
    setList(list.filter(p => p.id !== id));
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>💊 Prescriptions</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ Add Prescription</button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search by patient, medication, or doctor..." 
        value={search} 
        onChange={(e)=>setSearch(e.target.value)}
        style={{padding:10, width:'100%', maxWidth:400, borderRadius:8, border:'1px solid #e0f2fe', marginBottom:15}}
      />

      <AddForm 
        title="Issue New Prescription" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="number" placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required />
        <input type="number" placeholder="Doctor ID" value={form.doctorId} onChange={e=>setForm({...form, doctorId:e.target.value})} required />
        <input type="text" placeholder="Medication Name" value={form.medication} onChange={e=>setForm({...form, medication:e.target.value})} required />
        <input type="text" placeholder="Dosage (e.g., 1 tablet 3x daily)" value={form.dosage} onChange={e=>setForm({...form, dosage:e.target.value})} required />
        <input type="text" placeholder="Duration (e.g., 7 days)" value={form.duration} onChange={e=>setForm({...form, duration:e.target.value})} required />
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(p => (
          <div key={p.id} className="card col-4">
            <div style={{fontSize:12, color:'var(--muted)'}}>📝 Prescription #{p.id}</div>
            <div style={{fontWeight:700, marginTop:8}}>{p.medication}</div>
            <div style={{fontSize:13, color:'var(--muted)', marginTop:4}}>Patient: {p.patientName}</div>
            <div style={{fontSize:13, color:'var(--muted)'}}>Doctor: {p.doctorName}</div>
            <div style={{fontSize:12, marginTop:6, background:'#eff6ff', padding:'6px 8px', borderRadius:6}}>
              <strong>Dosage:</strong> {p.dosage}
            </div>
            <div style={{fontSize:12, marginTop:4, background:'#f0fdf4', padding:'6px 8px', borderRadius:6}}>
              <strong>Duration:</strong> {p.duration}
            </div>
            <button className="btn" style={{width:'100%', marginTop:12, background:'#ef4444'}} onClick={()=>handleDelete(p.id)}>Delete</button>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No prescriptions found</div>}
      </div>
    </div>
  );
}
