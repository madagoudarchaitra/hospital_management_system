import React, { useEffect, useState } from 'react';
import { get, post, remove, put } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AddForm from '../components/AddForm';

const mock = [
  { id:1, name: 'Alice Johnson', age: 34, gender:'F' },
  { id:2, name: 'Bob Smith', age: 48, gender:'M' },
  { id:3, name: 'Carol Lee', age: 29, gender:'F' }
];

export default function Patients(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: '' });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', age: '', gender: '' });
  const nav = useNavigate();

  const fetchPatients = async () => {
    const t = localStorage.getItem('token');
    const res = await get('/patients', t);
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data);
    else setList(mock);
  };

  useEffect(()=>{ fetchPatients(); }, []);

  useEffect(() => {
    const filtered = list.filter(p => 
      (p.User?.name || p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.gender || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.age || '').toString().includes(search)
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await post('/patients', form, t);
    if(res.status === 200) {
      setForm({ name: '', age: '', gender: '' });
      setShowForm(false);
      fetchPatients();
    } else {
      alert('Error adding patient');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/patients/${id}`, t);
    if(res.status === 200) {
      fetchPatients();
    } else {
      alert('Error deleting patient');
    }
  };

  const handleEdit = (patient) => {
    setEditId(patient.id);
    setEditForm({ name: patient.User?.name || patient.name, age: patient.age || '', gender: patient.gender || '' });
    setShowEditForm(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/patients/${editId}`, editForm, t);
    if(res.status === 200) {
      setEditForm({ name: '', age: '', gender: '' });
      setEditId(null);
      setShowEditForm(false);
      fetchPatients();
    } else {
      alert('Error updating patient');
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h3 style={{marginBottom:4}}>👥 Patients Management</h3>
          <p style={{color:'var(--muted)', fontSize:13, margin:0}}>Manage and track all patient information</p>
        </div>
        <button className="btn" onClick={()=>setShowForm(!showForm)} style={{padding:'12px 20px', fontSize:14}}>✨ + Add Patient</button>
      </div>

      <div style={{marginBottom:24, display:'flex', gap:12, alignItems:'flex-end'}}>
        <div style={{flex:1, maxWidth:400}}>
          <input 
            type="text" 
            placeholder="🔍 Search by name, age, or gender..." 
            value={search} 
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        <div style={{color:'var(--muted)', fontSize:12, background:'rgba(14,165,233,0.08)', padding:'8px 12px', borderRadius:8, fontWeight:600}}>
          📊 {filteredList.length} result{filteredList.length !== 1 ? 's' : ''}
        </div>
      </div>

      <AddForm 
        title="➕ Add New Patient" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input 
          type="text" 
          placeholder="Patient Name" 
          value={form.name} 
          onChange={(e)=>setForm({...form, name: e.target.value})}
          required
        />
        <input 
          type="number" 
          placeholder="Age" 
          value={form.age} 
          onChange={(e)=>setForm({...form, age: e.target.value})}
          required
        />
        <select 
          value={form.gender} 
          onChange={(e)=>setForm({...form, gender: e.target.value})}
          required
        >
          <option value="">👤 Select Gender</option>
          <option value="Male">👨 Male</option>
          <option value="Female">👩 Female</option>
          <option value="Other">⚪ Other</option>
        </select>
      </AddForm>

      <AddForm 
        title="✏️ Edit Patient" 
        isOpen={showEditForm} 
        onClose={()=>setShowEditForm(false)} 
        onSubmit={handleSaveEdit}
      >
        <input 
          type="text" 
          placeholder="Patient Name" 
          value={editForm.name} 
          onChange={(e)=>setEditForm({...editForm, name: e.target.value})}
          required
        />
        <input 
          type="number" 
          placeholder="Age" 
          value={editForm.age} 
          onChange={(e)=>setEditForm({...editForm, age: e.target.value})}
          required
        />
        <select 
          value={editForm.gender} 
          onChange={(e)=>setEditForm({...editForm, gender: e.target.value})}
          required
        >
          <option value="">👤 Select Gender</option>
          <option value="Male">👨 Male</option>
          <option value="Female">👩 Female</option>
          <option value="Other">⚪ Other</option>
        </select>
      </AddForm>

      <div className="grid">
        {filteredList.map(p=> (
          <div key={p.id} className="card col-4" style={{padding:16, position:'relative', display:'flex', flexDirection:'column'}}>
            <div style={{fontWeight:700, fontSize:16, marginBottom:12, color:'#0f172a', paddingBottom:12, borderBottom:'2px solid rgba(14,165,233,0.1)'}}>👤 {p.User?.name || p.name}</div>
            <div style={{color:'var(--muted)', fontSize:13, margin:'8px 0', display:'flex', alignItems:'center', gap:4}}>
              <span>📅</span> Age: <strong style={{color:'#0f172a'}}>{p.age || 'N/A'}</strong>
            </div>
            <div style={{color:'var(--muted)', fontSize:13, display:'flex', alignItems:'center', gap:4}}>
              <span>👥</span> Gender: <strong style={{color:'#0f172a'}}>{p.gender || 'N/A'}</strong>
            </div>
            <div style={{marginTop:'auto', paddingTop:12, display:'flex', gap:8}}>
              <button className="btn" style={{background:'#10b981', flex:1}} onClick={()=>nav(`/patients/${p.id}`)}>👁️ View</button>
              <button className="btn" style={{background:'#f59e0b', flex:1}} onClick={()=>handleEdit(p)}>✏️ Edit</button>
              <button className="btn" style={{background:'#dc3545', flex:1}} onClick={()=>handleDelete(p.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && (
        <div style={{textAlign:'center', color:'var(--muted)', marginTop:40, padding:40, background:'rgba(14,165,233,0.04)', borderRadius:12, borderLeft:'4px solid rgba(14,165,233,0.2)'}}>
          <div style={{fontSize:32, marginBottom:8}}>🔍</div>
          <div style={{fontSize:14, fontWeight:600}}>No patients found</div>
          <div style={{fontSize:12, marginTop:4}}>Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
}
