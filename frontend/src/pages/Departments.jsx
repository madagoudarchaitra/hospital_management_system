import React, { useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, name: 'Cardiology', head: 'Dr. Emma Brown', staff: 8, patients: 28, beds: 12, budget: 250000, status: 'active' },
  { id: 2, name: 'Orthopedics', head: 'Dr. Aaron Clark', staff: 6, patients: 22, beds: 10, budget: 180000, status: 'active' },
  { id: 3, name: 'Pediatrics', head: 'Dr. Sunita Rao', staff: 10, patients: 35, beds: 15, budget: 220000, status: 'active' },
  { id: 4, name: 'Neurology', head: 'Dr. Michael Johnson', staff: 5, patients: 18, beds: 8, budget: 160000, status: 'active' }
];

export default function Departments(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', head: '', staff: '', patients: '', beds: '', budget: '', status: 'active' });

  React.useEffect(() => {
    const filtered = list.filter(d =>
      (d.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (d.head || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    if(editId) {
      setList(list.map(d => d.id === editId ? { ...form, id: editId, staff: parseInt(form.staff), patients: parseInt(form.patients), beds: parseInt(form.beds), budget: parseInt(form.budget) } : d));
      setEditId(null);
    } else {
      const newDept = { 
        id: Date.now(), 
        ...form,
        staff: parseInt(form.staff),
        patients: parseInt(form.patients),
        beds: parseInt(form.beds),
        budget: parseInt(form.budget)
      };
      setList([...list, newDept]);
    }
    setForm({ name: '', head: '', staff: '', patients: '', beds: '', budget: '', status: 'active' });
    setShowForm(false);
  };

  const handleEdit = (dept) => {
    setForm(dept);
    setEditId(dept.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this department?')) return;
    setList(list.filter(d => d.id !== id));
  };

  const bedOccupancy = (dept) => {
    return Math.round((dept.patients / dept.beds) * 100);
  };

  const staffEfficiency = (dept) => {
    return (dept.patients / dept.staff).toFixed(1);
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>🏢 Departments Management</h3>
        <button className="btn" onClick={()=>{ setEditId(null); setForm({ name: '', head: '', staff: '', patients: '', beds: '', budget: '', status: 'active' }); setShowForm(true); }}>+ New Department</button>
      </div>

      <input 
        type="text" 
        placeholder="🔍 Search by name or head doctor..." 
        value={search} 
        onChange={(e)=>setSearch(e.target.value)}
        style={{padding:10, width:'100%', maxWidth:500, borderRadius:8, border:'1px solid #e0f2fe', marginBottom:15}}
      />

      <AddForm 
        title={editId ? "Edit Department" : "Create New Department"} 
        isOpen={showForm} 
        onClose={()=>{ setShowForm(false); setEditId(null); }} 
        onSubmit={handleAdd}
      >
        <input type="text" placeholder="Department Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input type="text" placeholder="Department Head" value={form.head} onChange={e=>setForm({...form, head:e.target.value})} required />
        <input type="number" placeholder="Number of Staff" value={form.staff} onChange={e=>setForm({...form, staff:e.target.value})} required />
        <input type="number" placeholder="Current Patients" value={form.patients} onChange={e=>setForm({...form, patients:e.target.value})} required />
        <input type="number" placeholder="Available Beds" value={form.beds} onChange={e=>setForm({...form, beds:e.target.value})} required />
        <input type="number" placeholder="Annual Budget" value={form.budget} onChange={e=>setForm({...form, budget:e.target.value})} required />
        <select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
          <option value="active">Active</option>
          <option value="closed">Temporarily Closed</option>
        </select>
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(d => (
          <div key={d.id} className="card col-4">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12}}>
              <div>
                <div style={{fontWeight:700, fontSize:16}}>{d.name}</div>
                <div style={{fontSize:12, color:'var(--muted)', marginTop:4}}>{d.head}</div>
              </div>
              <div style={{fontSize:10, fontWeight:700, color:'#fff', background: d.status === 'active' ? '#10b981' : '#ef4444', padding:'4px 8px', borderRadius:6}}>
                {d.status.toUpperCase()}
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12}}>
              <div style={{background:'#f0f9ff', padding:10, borderRadius:8}}>
                <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Staff</div>
                <div style={{fontWeight:700, fontSize:18, color:'#0ea5e9'}}>{d.staff}</div>
              </div>
              <div style={{background:'#f0fdf4', padding:10, borderRadius:8}}>
                <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Patients</div>
                <div style={{fontWeight:700, fontSize:18, color:'#10b981'}}>{d.patients}</div>
              </div>
              <div style={{background:'#fef3c7', padding:10, borderRadius:8}}>
                <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Beds</div>
                <div style={{fontWeight:700, fontSize:18, color:'#f59e0b'}}>{d.beds}</div>
              </div>
              <div style={{background:'#fce7f3', padding:10, borderRadius:8}}>
                <div style={{fontSize:11, color:'var(--muted)', marginBottom:4}}>Budget</div>
                  <div style={{fontWeight:700, fontSize:14, color:'#ec4899'}}>{'$' + (d.budget/1000).toFixed(0) + 'K'}</div>
              </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12, fontSize:12}}>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Bed Occupancy</div>
                <div style={{display:'flex', alignItems:'center', gap:4}}>
                  <div style={{flex:1, height:6, background:'#f0f9ff', borderRadius:3, overflow:'hidden'}}>
                    <div style={{height:'100%', background:bedOccupancy(d) > 85 ? '#ef4444' : bedOccupancy(d) > 70 ? '#f59e0b' : '#10b981', width:`${Math.min(100, bedOccupancy(d))}%`}}></div>
                  </div>
                  <span style={{fontWeight:700}}>{bedOccupancy(d)}%</span>
                </div>
              </div>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Staff Ratio</div>
                <div style={{fontWeight:700, fontSize:14}}>1:{staffEfficiency(d)}</div>
              </div>
            </div>

            <div style={{display:'flex', gap:8}}>
              <button className="btn" style={{flex:1, background:'#0ea5e9'}} onClick={()=>handleEdit(d)}>Edit</button>
              <button className="btn" style={{flex:1, background:'#ef4444'}} onClick={()=>handleDelete(d.id)}>Delete</button>
            </div>
          </div>
        )) : <div style={{textAlign:'center', color:'var(--muted)', padding:20, gridColumn:'1/-1'}}>No departments found</div>}
      </div>
    </div>
  );
}
