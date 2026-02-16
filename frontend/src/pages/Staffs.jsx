import React, { useEffect, useState } from 'react';
import { get, post, remove, put } from '../services/api';
import { useNavigate } from 'react-router-dom';
import AddForm from '../components/AddForm';

const mock = [ { id:1, name:'Nurse Joy', role:'Nurse' }, { id:2, name:'John Worker', role:'Technician' } ];

export default function Staffs(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:'', role:''});
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({name:'', role:''});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/staffs', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    const filtered = list.filter(s => 
      (s.User?.name || s.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.role || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/staffs', form, t); 
    if(res.status===200){ 
      setForm({name:'', role:''}); 
      setShowForm(false);
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/staffs/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting staff');
  };

  const handleEdit = (staff) => {
    setEditId(staff.id);
    setEditForm({ name: staff.User?.name || staff.name, role: staff.role || '' });
    setShowEditForm(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await put(`/staffs/${editId}`, editForm, t);
    if(res.status === 200) {
      setEditForm({ name: '', role: '' });
      setEditId(null);
      setShowEditForm(false);
      load();
    } else {
      alert('Error updating staff');
    }
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28}}>
        <div>
          <h3 style={{marginBottom:4}}>👩‍⚕️ Staff Management</h3>
          <p style={{color:'var(--muted)', fontSize:13, margin:0}}>Manage hospital staff and their roles</p>
        </div>
        <button className="btn" onClick={()=>setShowForm(!showForm)} style={{padding:'12px 20px', fontSize:14}}>✨ + Add Staff</button>
      </div>

      <div style={{marginBottom:24, display:'flex', gap:12, alignItems:'flex-end'}}>
        <div style={{flex:1, maxWidth:400}}>
          <input 
            type="text" 
            placeholder="🔍 Search by name or role..." 
            value={search} 
            onChange={(e)=>setSearch(e.target.value)}
          />
        </div>
        <div style={{color:'var(--muted)', fontSize:12, background:'rgba(14,165,233,0.08)', padding:'8px 12px', borderRadius:8, fontWeight:600}}>
          📊 {filteredList.length} result{filteredList.length !== 1 ? 's' : ''}
        </div>
      </div>

      <AddForm 
        title="➕ Add New Staff" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input 
          type="text" 
          placeholder="👤 Full Name" 
          value={form.name} 
          onChange={(e)=>setForm({...form, name: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="💼 Role (e.g., Nurse, Technician)" 
          value={form.role} 
          onChange={(e)=>setForm({...form, role: e.target.value})}
          required
        />
      </AddForm>

      <AddForm 
        title="✏️ Edit Staff" 
        isOpen={showEditForm} 
        onClose={()=>setShowEditForm(false)} 
        onSubmit={handleSaveEdit}
      >
        <input 
          type="text" 
          placeholder="👤 Full Name" 
          value={editForm.name} 
          onChange={(e)=>setEditForm({...editForm, name: e.target.value})}
          required
        />
        <input 
          type="text" 
          placeholder="💼 Role (e.g., Nurse, Technician)" 
          value={editForm.role} 
          onChange={(e)=>setEditForm({...editForm, role: e.target.value})}
          required
        />
      </AddForm>

      <div className="grid">
        {filteredList.map(s=> (
          <div key={s.id} className="card col-4" style={{padding:16, position:'relative', display:'flex', flexDirection:'column'}}>
            <div style={{fontWeight:700, fontSize:16, marginBottom:12, color:'#0f172a', paddingBottom:12, borderBottom:'2px solid rgba(14,165,233,0.1)'}}>👤 {s.User?.name || s.name}</div>
            <div style={{color:'var(--muted)', fontSize:13, margin:'8px 0', display:'flex', alignItems:'center', gap:4}}>
              <span>💼</span> Role: <strong style={{color:'#0f172a'}}>{s.role || 'N/A'}</strong>
            </div>
            <div style={{marginTop:'auto', paddingTop:12, display:'flex', gap:8}}>
              <button className="btn" style={{background:'#10b981', flex:1}} onClick={()=>nav(`/staffs/${s.id}`)}>👁️ View</button>
              <button className="btn" style={{background:'#f59e0b', flex:1}} onClick={()=>handleEdit(s)}>✏️ Edit</button>
              <button className="btn" style={{background:'#dc3545', flex:1}} onClick={()=>handleDelete(s.id)}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && (
        <div style={{textAlign:'center', color:'var(--muted)', marginTop:40, padding:40, background:'rgba(14,165,233,0.04)', borderRadius:12, borderLeft:'4px solid rgba(14,165,233,0.2)'}}>
          <div style={{fontSize:32, marginBottom:8}}>🔍</div>
          <div style={{fontSize:14, fontWeight:600}}>No staff found</div>
          <div style={{fontSize:12, marginTop:4}}>Try adjusting your search criteria</div>
        </div>
      )}
    </div>
  );
}
