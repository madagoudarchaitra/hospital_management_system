import React, { useEffect, useState } from 'react';
import { get, post, remove, put } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [
  { id:1, doctor:'Dr. Emma Brown', patient:'Alice Johnson', date: new Date().toISOString(), status:'scheduled' },
  { id:2, doctor:'Dr. Aaron Clark', patient:'Bob Smith', date: new Date().toISOString(), status:'completed' }
];

export default function Appointments(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({doctorId:'', patientId:'', date:'', status:'scheduled'});
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({doctorId:'', patientId:'', date:'', status:'scheduled'});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/appointments', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    const filtered = list.filter(a => 
      (a.doctor || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.patient || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.status || '').toLowerCase().includes(search.toLowerCase()) ||
      new Date(a.date).toLocaleString().toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/appointments', form, t); 
    if(res.status===200) { 
      setForm({doctorId:'', patientId:'', date:'', status:'scheduled'}); 
      setShowForm(false); 
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/appointments/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting appointment');
  };

  const handleEdit = (appointment) => {
    setEditId(appointment.id);
    setEditForm({
      doctorId: appointment.doctorId || '',
      patientId: appointment.patientId || '',
      date: appointment.date ? new Date(appointment.date).toISOString().slice(0,16) : '',
      status: appointment.status || 'scheduled'
    });
    setShowEditForm(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const editData = {
      doctorId: editForm.doctorId,
      patientId: editForm.patientId,
      date: new Date(editForm.date).toISOString(),
      status: editForm.status
    };
    const res = await put(`/appointments/${editId}`, editData, t);
    if(res.status === 200) {
      setEditForm({doctorId:'', patientId:'', date:'', status:'scheduled'});
      setEditId(null);
      setShowEditForm(false);
      load();
    } else {
      alert('Error updating appointment');
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h3 style={{marginBottom:4}}>📅 Appointments Management</h3>
          <p style={{color:'var(--muted)', fontSize:13, margin:0}}>Schedule and manage patient appointments</p>
        </div>
        <button className="btn" onClick={()=>setShowForm(!showForm)} style={{padding:'12px 20px', fontSize:14}}>✨ + Add Appointment</button>
      </div>

      <div style={{marginBottom:24, display:'flex', gap:12, alignItems:'flex-end'}}>
        <div style={{flex:1, maxWidth:400}}>
          <input 
            type="text" 
            placeholder="🔍 Search by doctor, patient, or status..." 
            value={search} 
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        <div style={{color:'var(--muted)', fontSize:12, background:'rgba(14,165,233,0.08)', padding:'8px 12px', borderRadius:8, fontWeight:600}}>
          📊 {filteredList.length} result{filteredList.length !== 1 ? 's' : ''}
        </div>
      </div>

      {showForm && (
        <div className="card" style={{padding:24, marginBottom:24, background:'linear-gradient(135deg, rgba(14,165,233,0.05), rgba(6,182,212,0.05))', border:'1px solid rgba(14,165,233,0.1)'}}>
          <h4 style={{marginTop:0}}>➕ Add New Appointment</h4>
          <form onSubmit={handleAdd} style={{display:'flex', flexDirection:'column', gap:14}}>
            <input placeholder="👨‍⚕️ Doctor ID" value={form.doctorId} onChange={e=>setForm({...form, doctorId: e.target.value})} required />
            <input placeholder="👤 Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId: e.target.value})} required />
            <input type="datetime-local" value={form.date ? new Date(form.date).toISOString().slice(0,16) : ''} onChange={e=>setForm({...form, date: new Date(e.target.value).toISOString()})} required />
            <select value={form.status} onChange={e=>setForm({...form, status: e.target.value})}>
              <option value="scheduled">📅 Scheduled</option>
              <option value="completed">✓ Completed</option>
              <option value="cancelled">✕ Cancelled</option>
            </select>
            <div style={{display:'flex', gap:10}}>
              <button className="btn" type="submit" style={{flex:1}}>Save Appointment</button>
              <button className="btn btn-secondary" type="button" onClick={()=>setShowForm(false)} style={{flex:1}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && (
        <div className="card" style={{padding:24, marginBottom:24, background:'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.05))', border:'1px solid rgba(245,158,11,0.1)'}}>
          <h4 style={{marginTop:0}}>✏️ Edit Appointment</h4>
          <form onSubmit={handleSaveEdit} style={{display:'flex', flexDirection:'column', gap:14}}>
            <input placeholder="👨‍⚕️ Doctor ID" value={editForm.doctorId} onChange={e=>setEditForm({...editForm, doctorId: e.target.value})} required />
            <input placeholder="👤 Patient ID" value={editForm.patientId} onChange={e=>setEditForm({...editForm, patientId: e.target.value})} required />
            <input type="datetime-local" value={editForm.date} onChange={e=>setEditForm({...editForm, date: e.target.value})} required />
            <select value={editForm.status} onChange={e=>setEditForm({...editForm, status: e.target.value})}>
              <option value="scheduled">📅 Scheduled</option>
              <option value="completed">✓ Completed</option>
              <option value="cancelled">✕ Cancelled</option>
            </select>
            <div style={{display:'flex', gap:10}}>
              <button className="btn" type="submit" style={{flex:1, background:'#f59e0b'}}>Update Appointment</button>
              <button className="btn btn-secondary" type="button" onClick={()=>setShowEditForm(false)} style={{flex:1}}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {filteredList.map(a=> (
          <div key={a.id} className="card col-4" style={{padding:16, position:'relative', display:'flex', flexDirection:'column'}}>
            <div style={{fontWeight:700, fontSize:16, marginBottom:12, color:'#0f172a', paddingBottom:12, borderBottom:'2px solid rgba(14,165,233,0.1)'}}>👨‍⚕️ {a.doctor || `Dr #${a.doctorId}`}</div>
            <div style={{color:'var(--muted)', fontSize:13, margin:'8px 0', display:'flex', alignItems:'center', gap:4}}>
              <span>👤</span> Patient: <strong style={{color:'#0f172a'}}>{a.patient || `#${a.patientId}`}</strong>
            </div>
            <div style={{color:'var(--muted)', fontSize:13, display:'flex', alignItems:'center', gap:4}}>
              <span>📅</span> {new Date(a.date).toLocaleString()}
            </div>
            <div style={{marginTop:8,fontSize:12, display:'flex', alignItems:'center', gap:4}}>
              <span>{a.status === 'scheduled' ? '📌' : a.status === 'completed' ? '✓' : '✕'}</span>
              <span className="badge" style={{background:a.status === 'scheduled' ? 'rgba(245,158,11,0.1)' : a.status === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: a.status === 'scheduled' ? '#b45309' : a.status === 'completed' ? '#059669' : '#991b1b', padding:'4px 8px', borderRadius:6, fontSize:11, fontWeight:600}}>{a.status}</span>
            </div>
            <div style={{marginTop:'auto', paddingTop:12, display:'flex', gap:8}}>
              <button className="btn" style={{background:'#10b981', flex:1}} onClick={()=>nav(`/appointments/${a.id}`)}>👁️ View</button>
              <button className="btn" style={{background:'#f59e0b', flex:1}} onClick={()=>handleEdit(a)}>✏️ Edit</button>
              <button className="btn" style={{background:'#dc3545', flex:1}} onClick={()=>handleDelete(a.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && (
        <div style={{textAlign:'center', color:'var(--muted)', marginTop:40, padding:40, background:'rgba(14,165,233,0.04)', borderRadius:12, borderLeft:'4px solid rgba(14,165,233,0.2)'}}>
          <div style={{fontSize:32, marginBottom:8}}>🔍</div>
          <div style={{fontSize:14, fontWeight:600}}>No appointments found</div>
          <div style={{fontSize:12, marginTop:4}}>Schedule a new appointment to get started</div>
        </div>
      )}
    </div>
  );
}
