import React, { useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, patientName: 'John Doe', arrivalTime: new Date(Date.now() - 15*60*1000).toISOString(), triageLevel: 'Critical', chief_complaint: 'Severe chest pain', vital_signs: 'BP: 180/110, HR: 105', assigned_doctor: 'Dr. House', status: 'admitted' },
  { id: 2, patientName: 'Jane Smith', arrivalTime: new Date(Date.now() - 45*60*1000).toISOString(), triageLevel: 'Urgent', chief_complaint: 'Deep laceration on arm', vital_signs: 'BP: 140/85, HR: 92', assigned_doctor: 'Dr. Chen', status: 'in_triage' }
];

export default function EmergencyTriage(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientName: '', chief_complaint: '', vital_signs: '', triageLevel: 'Moderate' });

  React.useEffect(() => {
    const filtered = list.filter(e =>
      (e.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.chief_complaint || '').toLowerCase().includes(search.toLowerCase()) ||
      (e.triageLevel || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newCase = { 
      id: Date.now(), 
      ...form,
      arrivalTime: new Date().toISOString(),
      assigned_doctor: '',
      status: 'in_triage'
    };
    setList([...list, newCase]);
    setForm({ patientName: '', chief_complaint: '', vital_signs: '', triageLevel: 'Moderate' });
    setShowForm(false);
  };

  const getTriageColor = (level) => {
    switch(level) {
      case 'Critical': return '#ef4444';
      case 'Urgent': return '#f59e0b';
      case 'Moderate': return '#3b82f6';
      case 'Minor': return '#10b981';
      default: return '#6b7280';
    }
  };

  const updateStatus = (id, newStatus) => {
    setList(list.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const handleDelete = (id) => {
    if(!window.confirm('Remove this case from triage?')) return;
    setList(list.filter(e => e.id !== id));
  };

  const waitTime = (arrivalTime) => {
    const minutes = Math.floor((new Date() - new Date(arrivalTime)) / 60000);
    if(minutes < 60) return minutes + ' min';
    return Math.floor(minutes / 60) + ' hr';
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>🚨 Emergency Triage</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ New Case</button>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:15}}>
        <input 
          type="text" 
          placeholder="🔍 Search by patient or complaint..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, flex:1, maxWidth:500, borderRadius:8, border:'1px solid #e0f2fe'}}
        />
        <div style={{display:'flex', gap:8, fontSize:12}}>
          {['Critical', 'Urgent', 'Moderate', 'Minor'].map(level => (
            <span key={level} style={{padding:'8px 12px', borderRadius:6, background:getTriageColor(level), color:'#fff', fontWeight:600}}>
              {level}: {list.filter(e => e.triageLevel === level).length}
            </span>
          ))}
        </div>
      </div>

      <AddForm 
        title="Add Emergency Case" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="text" placeholder="Patient Name" value={form.patientName} onChange={e=>setForm({...form, patientName:e.target.value})} required />
        <input type="text" placeholder="Chief Complaint" value={form.chief_complaint} onChange={e=>setForm({...form, chief_complaint:e.target.value})} required />
        <input type="text" placeholder="Vital Signs (BP, HR, etc.)" value={form.vital_signs} onChange={e=>setForm({...form, vital_signs:e.target.value})} required />
        <select value={form.triageLevel} onChange={e=>setForm({...form, triageLevel:e.target.value})}>
          <option value="Critical">🔴 Critical</option>
          <option value="Urgent">🟠 Urgent</option>
          <option value="Moderate">🔵 Moderate</option>
          <option value="Minor">🟢 Minor</option>
        </select>
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(e => (
          <div key={e.id} className="card col-4" style={{borderTop:`4px solid ${getTriageColor(e.triageLevel)}`}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12}}>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>{e.patientName}</div>
                <div style={{fontSize:11, color:'var(--muted)', marginTop:4}}>Arrived: {waitTime(e.arrivalTime)} ago</div>
              </div>
              <div style={{fontSize:11, fontWeight:700, color:'#fff', background:getTriageColor(e.triageLevel), padding:'6px 10px', borderRadius:6}}>
                {e.triageLevel.toUpperCase()}
              </div>
            </div>

            <div style={{background:'#fef3c7', padding:10, borderRadius:8, marginBottom:10}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Chief Complaint</div>
              <div style={{fontWeight:600}}>{e.chief_complaint}</div>
            </div>

            <div style={{background:'#f3e8ff', padding:10, borderRadius:8, marginBottom:10}}>
              <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Vital Signs</div>
              <div style={{fontWeight:600, fontSize:12}}>{e.vital_signs}</div>
            </div>

            {e.assigned_doctor && (
              <div style={{fontSize:12, color:'var(--muted)', marginBottom:10}}>
                👨‍⚕️ Assigned: {e.assigned_doctor}
              </div>
            )}

            <div style={{display:'flex', gap:6, marginBottom:10}}>
              <select 
                value={e.status} 
                onChange={(e2) => updateStatus(e.id, e2.target.value)}
                style={{flex:1, padding:'6px 8px', fontSize:11, borderRadius:6, border:'1px solid #e0f2fe'}}
              >
                <option value="in_triage">In Triage</option>
                <option value="admitted">Admitted</option>
                <option value="discharged">Discharged</option>
              </select>
            </div>

            <button className="btn" style={{width:'100%', background:'#ef4444'}} onClick={()=>handleDelete(e.id)}>Remove</button>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20, gridColumn:'1/-1'}}>No emergency cases</div>}
      </div>
    </div>
  );
}
