import React, { useEffect, useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, doctorName: 'Dr. Emma Brown', specialty: 'Cardiology', monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00', thursday: '9:00-17:00', friday: '9:00-17:00', saturday: 'OFF', sunday: 'OFF' },
  { id: 2, doctorName: 'Dr. Aaron Clark', specialty: 'Orthopedics', monday: '10:00-18:00', tuesday: '10:00-18:00', wednesday: 'OFF', thursday: '10:00-18:00', friday: '10:00-18:00', saturday: '10:00-14:00', sunday: 'OFF' }
];

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function DoctorSchedules(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    doctorId: '', doctorName: '', specialty: '',
    monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00',
    thursday: '9:00-17:00', friday: '9:00-17:00', saturday: 'OFF', sunday: 'OFF'
  });

  useEffect(() => {
    const filtered = list.filter(s =>
      (s.doctorName || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.specialty || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    if(editId) {
      setList(list.map(s => s.id === editId ? { ...form, id: editId } : s));
      setEditId(null);
    } else {
      const newSchedule = { ...form, id: Date.now() };
      setList([...list, newSchedule]);
    }
    setForm({ doctorId: '', doctorName: '', specialty: '', monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00', thursday: '9:00-17:00', friday: '9:00-17:00', saturday: 'OFF', sunday: 'OFF' });
    setShowForm(false);
  };

  const handleEdit = (schedule) => {
    setForm(schedule);
    setEditId(schedule.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this schedule?')) return;
    setList(list.filter(s => s.id !== id));
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>📅 Doctor Schedules</h3>
        <button className="btn" onClick={()=>{ setEditId(null); setForm({ doctorId: '', doctorName: '', specialty: '', monday: '9:00-17:00', tuesday: '9:00-17:00', wednesday: '9:00-17:00', thursday: '9:00-17:00', friday: '9:00-17:00', saturday: 'OFF', sunday: 'OFF' }); setShowForm(true); }}>+ Set Schedule</button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search by doctor name or specialty..." 
        value={search} 
        onChange={(e)=>setSearch(e.target.value)}
        style={{padding:10, width:'100%', maxWidth:400, borderRadius:8, border:'1px solid #e0f2fe', marginBottom:15}}
      />

      <AddForm 
        title={editId ? "Edit Doctor Schedule" : "Set Doctor Schedule"} 
        isOpen={showForm} 
        onClose={()=>{ setShowForm(false); setEditId(null); }} 
        onSubmit={handleAdd}
      >
        <input type="number" placeholder="Doctor ID" value={form.doctorId} onChange={e=>setForm({...form, doctorId:e.target.value})} required />
        <input type="text" placeholder="Doctor Name" value={form.doctorName} onChange={e=>setForm({...form, doctorName:e.target.value})} required />
        <input type="text" placeholder="Specialty" value={form.specialty} onChange={e=>setForm({...form, specialty:e.target.value})} required />
        <div style={{fontSize:12, fontWeight:700, marginTop:10, marginBottom:10}}>Set working hours (e.g., 9:00-17:00 or OFF):</div>
        {days.map(day => (
          <div key={day} style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <label style={{width:80, fontSize:12, fontWeight:600}}>{dayLabels[days.indexOf(day)]}:</label>
            <input type="text" placeholder="e.g., 9:00-17:00" value={form[day]} onChange={e=>setForm({...form, [day]:e.target.value})} style={{flex:1}} />
          </div>
        ))}
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(s => (
          <div key={s.id} className="card col-8">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <div>
                <div style={{fontWeight:700, fontSize:16}}>{s.doctorName}</div>
                <div style={{fontSize:12, color:'var(--muted)'}}>{s.specialty}</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button className="btn" style={{background:'#0ea5e9', padding:'6px 12px'}} onClick={()=>handleEdit(s)}>Edit</button>
                <button className="btn" style={{background:'#ef4444', padding:'6px 12px'}} onClick={()=>handleDelete(s.id)}>Delete</button>
              </div>
            </div>
            <div style={{display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:8, fontSize:11}}>
              {days.map(day => (
                <div key={day} style={{background:'#f0f9ff', padding:8, borderRadius:6, textAlign:'center'}}>
                  <div style={{fontWeight:700, fontSize:10, color:'var(--muted)'}}>{dayLabels[days.indexOf(day)].slice(0,3)}</div>
                  <div style={{fontWeight:600, marginTop:4, color: s[day] === 'OFF' ? '#ef4444' : '#10b981'}}>
                    {s[day]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No schedules found</div>}
      </div>
    </div>
  );
}
