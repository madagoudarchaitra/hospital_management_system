import React, { useEffect, useState } from 'react';
import { get, post, remove, put } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AddForm from '../components/AddForm';

const mock = [
  { id:1, name: 'Dr. Emma Brown', specialty: 'Cardiology' },
  { id:2, name: 'Dr. Aaron Clark', specialty: 'Orthopedics' },
  { id:3, name: 'Dr. Sunita Rao', specialty: 'Pediatrics' }
];

export default function Doctors(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', qualifications: '', experience: '' });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', specialty: '', qualifications: '', experience: '' });
  const nav = useNavigate();

  const fetchDoctors = async () => {
    const t = localStorage.getItem('token');
    const res = await get('/doctors', t);
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data);
    else setList(mock);
  };

  useEffect(()=>{ fetchDoctors(); }, []);

  useEffect(() => {
    const filtered = list.filter(d => 
      (d.User?.name || d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.specialty || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.qualifications || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await post('/doctors', form, t);
    if(res.status === 200) {
      setForm({ name: '', specialty: '', qualifications: '', experience: '' });
      setShowForm(false);
      fetchDoctors();
    } else {
      alert('Error adding doctor');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/doctors/${id}`, t);
    if(res.status === 200) fetchDoctors();
    else alert('Error deleting doctor');
  };

  const handleEdit = (doctor) => {
    setEditId(doctor.id);
    setEditForm({ 
      name: doctor.User?.name || doctor.name, 
      specialty: doctor.specialty || '', 
      qualifications: doctor.qualifications || '', 
      experience: doctor.experience || '' 
    });
    setShowEditForm(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/doctors/${editId}`, editForm, t);
    if(res.status === 200) {
      setEditForm({ name: '', specialty: '', qualifications: '', experience: '' });
      setEditId(null);
      setShowEditForm(false);
      fetchDoctors();
    } else {
      alert('Error updating doctor');
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h3 style={{marginBottom:4}}>👨‍⚕️ Doctors Management</h3>
          <p style={{color:'var(--muted)', fontSize:13, margin:0}}>Manage healthcare professionals and specialties</p>
        </div>
        <button className="btn" onClick={()=>setShowForm(!showForm)} style={{padding:'12px 20px', fontSize:14}}>✨ + Add Doctor</button>
      </div>

      <div style={{marginBottom:24, display:'flex', gap:12, alignItems:'flex-end'}}>
        <div style={{flex:1, maxWidth:400}}>
          <input 
            type="text" 
            placeholder="🔍 Search by name or specialty..." 
            value={search} 
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        <div style={{color:'var(--muted)', fontSize:12, background:'rgba(14,165,233,0.08)', padding:'8px 12px', borderRadius:8, fontWeight:600}}>
          📊 {filteredList.length} result{filteredList.length !== 1 ? 's' : ''}
        </div>
      </div>

      <AddForm 
        title="➕ Add New Doctor" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input 
          type="text" 
          placeholder="👨‍⚕️ Full Name" 
          value={form.name} 
          onChange={(e)=>setForm({...form, name: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="💼 Specialty" 
          value={form.specialty} 
          onChange={(e)=>setForm({...form, specialty: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="🎓 Qualifications" 
          value={form.qualifications} 
          onChange={(e)=>setForm({...form, qualifications: e.target.value})}
        />
        <textarea 
          placeholder="📝 Experience & Background" 
          value={form.experience} 
          onChange={(e)=>setForm({...form, experience: e.target.value})}
          style={{minHeight:80}}
        />
      </AddForm>

      <AddForm 
        title="✏️ Edit Doctor" 
        isOpen={showEditForm} 
        onClose={()=>setShowEditForm(false)} 
        onSubmit={handleSaveEdit}
      >
        <input 
          type="text" 
          placeholder="👨‍⚕️ Full Name" 
          value={editForm.name} 
          onChange={(e)=>setEditForm({...editForm, name: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="💼 Specialty" 
          value={editForm.specialty} 
          onChange={(e)=>setEditForm({...editForm, specialty: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="🎓 Qualifications" 
          value={editForm.qualifications} 
          onChange={(e)=>setEditForm({...editForm, qualifications: e.target.value})}
        />
        <textarea 
          placeholder="📝 Experience & Background" 
          value={editForm.experience} 
          onChange={(e)=>setEditForm({...editForm, experience: e.target.value})}
          style={{minHeight:80}}
        />
      </AddForm>

      <div className="grid">
        {filteredList.map(d=> (
          <div key={d.id} className="card col-4" style={{padding:16, position:'relative', display:'flex', flexDirection:'column'}}>
            <div style={{fontWeight:700, fontSize:16, marginBottom:12, color:'#0f172a', paddingBottom:12, borderBottom:'2px solid rgba(14,165,233,0.1)'}}>👨‍⚕️ {d.User?.name || d.name}</div>
            <div style={{color:'var(--muted)', fontSize:13, margin:'8px 0', display:'flex', alignItems:'center', gap:4}}>
              <span>💼</span> Specialty: <strong style={{color:'#0f172a'}}>{d.specialty || 'General'}</strong>
            </div>
            {d.qualifications && (
              <div style={{color:'var(--muted)', fontSize:13, display:'flex', alignItems:'center', gap:4}}>
                <span>🎓</span> {d.qualifications}
              </div>
            )}
            <div style={{marginTop:'auto', paddingTop:12, display:'flex', gap:8}}>
              <button className="btn" style={{background:'#10b981', flex:1}} onClick={()=>nav(`/doctors/${d.id}`)}>👁️ View</button>
              <button className="btn" style={{background:'#f59e0b', flex:1}} onClick={()=>handleEdit(d)}>✏️ Edit</button>
              <button className="btn" style={{background:'#dc3545', flex:1}} onClick={()=>handleDelete(d.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && (
        <div style={{textAlign:'center', color:'var(--muted)', marginTop:40, padding:40, background:'rgba(14,165,233,0.04)', borderRadius:12, borderLeft:'4px solid rgba(14,165,233,0.2)'}}>
          <div style={{fontSize:32, marginBottom:8}}>🔍</div>
          <div style={{fontSize:14, fontWeight:600}}>No doctors found</div>
          <div style={{fontSize:12, marginTop:4}}>Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
}
