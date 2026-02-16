import React, { useEffect, useState } from 'react';
import { get, post, remove } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [ { id:1, name:'Paracetamol', stock:120, price:1.25 }, { id:2, name:'Amoxicillin', stock:60, price:3.5 } ];

export default function Pharmacies(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:'', stock:'', price:''});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/pharmacies', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    const filtered = list.filter(p => 
      (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.stock || '').toString().includes(search) ||
      (p.price || '').toString().includes(search)
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/pharmacies', form, t); 
    if(res.status===200){ 
      setForm({name:'', stock:'', price:''}); 
      setShowForm(false);
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/pharmacies/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting pharmacy');
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>Pharmacy</h3>
        <button className="btn" onClick={()=>setShowForm(!showForm)}>+ Add Pharmacy</button>
      </div>

      <div style={{marginBottom:20}}>
        <input 
          type="text" 
          placeholder="🔍 Search by name, stock, or price..." 
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
          <h4>Add New Pharmacy</h4>
          <form onSubmit={handleAdd}>
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form, stock: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <div style={{display:'flex', gap:10}}>
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn" style={{background:'#ccc'}} onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid">
        {filteredList.map(p=> (
          <div className="card col-3" key={p.id} style={{padding:12}}>
            <div style={{fontWeight:700}}>{p.name}</div>
            <div style={{color:'var(--muted)'}}>Stock: {p.stock}</div>
            <div style={{marginTop:6}}>Price: ${p.price}</div>
            <div style={{marginTop:8, display:'flex', gap:8}}>
              <button className="btn" onClick={()=>nav(`/pharmacies/${p.id}`)}>View</button>
              <button className="btn" style={{background:'#dc3545'}} onClick={()=>handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {filteredList.length === 0 && <div style={{textAlign:'center', color:'var(--muted)', marginTop:20}}>No pharmacies found</div>}
    </div>
  );
}
