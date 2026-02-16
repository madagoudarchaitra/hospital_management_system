import React, { useEffect, useState } from 'react';
import { get, post, remove, put } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [ { id:1, ward:'A', number:'101', occupied:false }, { id:2, ward:'B', number:'201', occupied:true } ];

export default function Beds(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ward:'', number:'', occupied:false});
  const [showEditForm, setShowEditForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ward:'', number:'', occupied:false});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/beds', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    const filtered = list.filter(b => 
      (b.ward || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.number || '').toString().includes(search) ||
      (b.occupied ? 'occupied' : 'free').includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/beds', form, t); 
    if(res.status===200){ 
      setForm({ward:'', number:'', occupied:false}); 
      setShowForm(false);
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/beds/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting bed');
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>Beds</h3>
        <button className="btn" onClick={()=>setShowForm(!showForm)}>+ Add Bed</button>
      </div>

      <div style={{marginBottom:20}}>
        <input 
          type="text" 
          placeholder="🔍 Search by ward, bed number, or status..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, width:'100%', maxWidth:400, borderRadius:6, border:'1px solid #ddd'}}
        />
        <div style={{color:'var(--muted)', fontSize:12, marginTop:6}}>
          Found {filteredList.length} result(s)
        </div>
      </div>

      {showForm && (
        <div className="card" style={{padding:20, marginBottom:20}}>
          <h4>Add New Bed</h4>
          <form onSubmit={handleAdd}>
            <input placeholder="Ward" value={form.ward} onChange={e=>setForm({...form, ward: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <input placeholder="Number" value={form.number} onChange={e=>setForm({...form, number: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <label style={{display:'flex',alignItems:'center',gap:6, marginBottom:10}}><input type="checkbox" checked={form.occupied} onChange={e=>setForm({...form, occupied: e.target.checked})} /> Occupied</label>
            <div style={{display:'flex', gap:10}}>
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn" style={{background:'#ccc'}} onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {filteredList.map(b=> (
          <div key={b.id} className="card col-3" style={{padding:12}}>
            <div style={{fontWeight:700}}>Bed {b.number}</div>
            <div style={{color:'var(--muted)'}}>Ward: {b.ward}</div>
            <div style={{marginTop:6}}>Status: {b.occupied ? 'Occupied' : 'Free'}</div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button className="btn" style={{background:'#10b981'}} onClick={()=>nav(`/beds/${b.id}`)}>View</button>
              <button className="btn" style={{background:'#dc3545'}} onClick={()=>handleDelete(b.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && <div style={{textAlign:'center', color:'var(--muted)', marginTop:20}}>No beds found</div>}
    </div>
  );
}
