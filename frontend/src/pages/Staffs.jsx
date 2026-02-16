import React, { useEffect, useState } from 'react';
import { get, post, remove } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [ { id:1, name:'Nurse Joy', role:'Nurse' }, { id:2, name:'John Worker', role:'Technician' } ];

export default function Staffs(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:'', role:''});
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
      (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
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

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>Staff</h3>
        <button className="btn" onClick={()=>setShowForm(!showForm)}>+ Add Staff</button>
      </div>

      <div style={{marginBottom:20}}>
        <input 
          type="text" 
          placeholder="🔍 Search by name or role..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, width:'100%', maxWidth:400, borderRadius:6, border:'1px solid #ddd'}}
        />
        <div style={{color:'var(--muted)', fontSize:12, marginTop:6}}>
          Found {filteredList.length} result(s)
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} style={{marginBottom:20, display:'flex', gap:8, alignItems:'center'}}>
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e)=>setForm(f=>({ ...f, name: e.target.value }))}
            style={{padding:8, borderRadius:6, border:'1px solid #ddd'}}
          />
          <input
            required
            placeholder="Role"
            value={form.role}
            onChange={(e)=>setForm(f=>({ ...f, role: e.target.value }))}
            style={{padding:8, borderRadius:6, border:'1px solid #ddd'}}
          />
          <button className="btn" type="submit">Save</button>
          <button type="button" className="btn" style={{background:'#6c757d'}} onClick={()=>{ setShowForm(false); setForm({name:'', role:''}); }}>Cancel</button>
        </form>
      )}

      <div className="grid">
        {filteredList.map(s=> (
          <div key={s.id} className="card col-3" style={{padding:12}}>
            <div style={{fontWeight:700}}>{s.name}</div>
            <div style={{color:'var(--muted)'}}>{s.role}</div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button className="btn" onClick={()=>nav(`/staffs/${s.id}`)}>View</button>
              <button className="btn" style={{background:'#dc3545'}} onClick={()=>handleDelete(s.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
