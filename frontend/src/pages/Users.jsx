import React, { useEffect, useState } from 'react';
import { get, put, remove, post } from '../services/api';

export default function Users(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  async function load(){ setLoading(true); const t = localStorage.getItem('token'); const res = await get('/users', t); if(res.status===200) setList(res.data || []); setLoading(false); }
  useEffect(()=>{ load() }, []);

  useEffect(() => {
    const filtered = list.filter(u => 
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  async function changeRole(id, role){ const t = localStorage.getItem('token'); const res = await put(`/users/${id}`, { role }, t); if(res.status===200) load(); else alert(res.data.message || 'Error'); }
  async function del(id){ if(!confirm('Delete user?')) return; const t = localStorage.getItem('token'); const res = await remove(`/users/${id}`, t); if(res.status===200) load(); else alert(res.data.message || 'Error'); }

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'patient', password: '' });

  async function handleAdd(e){
    e.preventDefault();
    const t = localStorage.getItem('token');
    const res = await post('/users', form, t);
    if(res.status === 200){ setForm({ name:'', email:'', role:'patient', password:'' }); setShowForm(false); load(); }
    else alert(res.data?.message || 'Error creating user');
  }

  return (
    <div>
      <h3>Users</h3>
      <div style={{marginBottom:20, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <input 
          type="text" 
          placeholder="🔍 Search by name, email, or role..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, width:'100%', maxWidth:400, borderRadius:6, border:'1px solid #ddd'}}
        />
        <div style={{color:'var(--muted)', fontSize:12, marginTop:6}}>
          Found {filteredList.length} result(s)
        </div>
        <button className="btn" style={{marginLeft:12}} onClick={()=>setShowForm(s=>!s)}>+ Add User</button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card" style={{marginBottom:16, display:'grid', gridTemplateColumns:'1fr 1fr 160px 140px', gap:10, alignItems:'center'}}>
          <input required placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
          <input required placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
          <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
            <option value="admin">admin</option>
            <option value="doctor">doctor</option>
            <option value="patient">patient</option>
            <option value="staff">staff</option>
          </select>
          <div style={{display:'flex', gap:8}}>
            <input placeholder="Password (optional)" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
            <button className="btn" type="submit">Create</button>
            <button type="button" className="btn" style={{background:'#6c757d'}} onClick={()=>{ setShowForm(false); setForm({ name: '', email: '', role: 'patient', password: '' }); }}>Cancel</button>
          </div>
        </form>
      )}
      {loading ? <div>Loading...</div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>{filteredList.map(u=> (
              <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>
                <select defaultValue={u.role} onChange={e=>changeRole(u.id, e.target.value)}>
                  <option value="admin">admin</option>
                  <option value="doctor">doctor</option>
                  <option value="patient">patient</option>
                  <option value="staff">staff</option>
                </select>
                <button style={{marginLeft:8}} onClick={()=>del(u.id)}>Delete</button>
              </td></tr>))}</tbody>
            </table>
            {filteredList.length === 0 && <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No users found</div>}
        </div>
      )}
    </div>
  );
}
