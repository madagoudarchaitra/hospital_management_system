import React, { useEffect, useState } from 'react';
import { get, post } from '../services/api';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, patientName: 'Alice Johnson', temperature: 98.6, heartRate: 72, bloodPressure: '120/80', oxygenLevel: 98, date: new Date().toISOString() },
  { id: 2, patientName: 'Bob Smith', temperature: 97.8, heartRate: 68, bloodPressure: '118/76', oxygenLevel: 99, date: new Date().toISOString() }
];

export default function VitalSigns(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', temperature: '', heartRate: '', bloodPressure: '', oxygenLevel: '' });

  useEffect(() => {
    const filtered = list.filter(v =>
      (v.patientName || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newVitals = { 
      id: Date.now(), 
      patientName: 'Patient', 
      temperature: parseFloat(form.temperature),
      heartRate: parseInt(form.heartRate),
      bloodPressure: form.bloodPressure,
      oxygenLevel: parseInt(form.oxygenLevel),
      date: new Date().toISOString() 
    };
    setList([...list, newVitals]);
    setForm({ patientId: '', temperature: '', heartRate: '', bloodPressure: '', oxygenLevel: '' });
    setShowForm(false);
  };

  const getHealthStatus = (temp, hr, bp, o2) => {
    if(temp > 99.5 || hr > 100 || o2 < 95) return { status: 'Abnormal', color: '#ef4444' };
    if(temp > 98.5 || hr > 85 || o2 < 97) return { status: 'Caution', color: '#f59e0b' };
    return { status: 'Normal', color: '#10b981' };
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>🩺 Vital Signs</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ Record Vitals</button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search by patient name..." 
        value={search} 
        onChange={(e)=>setSearch(e.target.value)}
        style={{padding:10, width:'100%', maxWidth:400, borderRadius:8, border:'1px solid #e0f2fe', marginBottom:15}}
      />

      <AddForm 
        title="Record Patient Vital Signs" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="number" placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId:e.target.value})} required />
        <input type="number" step="0.1" placeholder="Temperature (°F)" value={form.temperature} onChange={e=>setForm({...form, temperature:e.target.value})} required />
        <input type="number" placeholder="Heart Rate (bpm)" value={form.heartRate} onChange={e=>setForm({...form, heartRate:e.target.value})} required />
        <input type="text" placeholder="Blood Pressure (e.g., 120/80)" value={form.bloodPressure} onChange={e=>setForm({...form, bloodPressure:e.target.value})} required />
        <input type="number" placeholder="Oxygen Level (%)" value={form.oxygenLevel} onChange={e=>setForm({...form, oxygenLevel:e.target.value})} required />
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(v => {
          const health = getHealthStatus(v.temperature, v.heartRate, v.bloodPressure, v.oxygenLevel);
          return (
            <div key={v.id} className="card col-4">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8}}>
                <div style={{fontSize:13, fontWeight:700}}>{v.patientName}</div>
                <div style={{fontSize:11, fontWeight:700, color:'#fff', background:health.color, padding:'4px 8px', borderRadius:6}}>
                  {health.status}
                </div>
              </div>
              <div style={{fontSize:12, color:'var(--muted)', marginBottom:10}}>
                {new Date(v.date).toLocaleString()}
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
                <div style={{background:'#fef3c7', padding:10, borderRadius:8, fontSize:12}}>
                  <div style={{color:'var(--muted)'}}>Temp</div>
                  <div style={{fontWeight:700, fontSize:16}}>{v.temperature}°F</div>
                </div>
                <div style={{background:'#fce7f3', padding:10, borderRadius:8, fontSize:12}}>
                  <div style={{color:'var(--muted)'}}>Heart Rate</div>
                  <div style={{fontWeight:700, fontSize:16}}>{v.heartRate} bpm</div>
                </div>
                <div style={{background:'#dbeafe', padding:10, borderRadius:8, fontSize:12}}>
                  <div style={{color:'var(--muted)'}}>BP</div>
                  <div style={{fontWeight:700, fontSize:16}}>{v.bloodPressure}</div>
                </div>
                <div style={{background:'#dcfce7', padding:10, borderRadius:8, fontSize:12}}>
                  <div style={{color:'var(--muted)'}}>O₂</div>
                  <div style={{fontWeight:700, fontSize:16}}>{v.oxygenLevel}%</div>
                </div>
              </div>
            </div>
          );
        }) : <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No vital signs recorded</div>}
      </div>
    </div>
  );
}
