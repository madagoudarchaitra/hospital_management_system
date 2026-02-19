import React, { useEffect, useState } from 'react';
import { get, post, remove } from '../services/api';
import { useNavigate } from 'react-router-dom';

const mock = [ { id:1, patient:'Alice Johnson', amount:200.0, status:'pending' }, { id:2, patient:'Bob Smith', amount:150.0, status:'paid' } ];

export default function Billings(){
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({patientId:'', amount:'', status:'pending'});
  const nav = useNavigate();

  const load = async () => { 
    const t = localStorage.getItem('token'); 
    const res = await get('/billings', t); 
    if(res.status===200 && Array.isArray(res.data) && res.data.length) setList(res.data); 
    else setList(mock); 
  };
  useEffect(()=>{ load(); }, []);

  useEffect(() => {
    let filtered = list.filter(b => 
      (b.patient || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.status || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.amount || '').toString().includes(search)
    );
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    setFilteredList(filtered);
  }, [search, list, statusFilter]);

  const handleAdd = async (e) => { 
    e.preventDefault(); 
    const t = localStorage.getItem('token'); 
    const res = await post('/billings', form, t); 
    if(res.status===200){ 
      setForm({patientId:'', amount:'', status:'pending'}); 
      setShowForm(false);
      load(); 
    } else alert(res.data.message || 'Error'); 
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure?')) return;
    const t = localStorage.getItem('token');
    const res = await remove(`/billings/${id}`, t);
    if(res.status === 200) load();
    else alert('Error deleting billing');
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>Billings</h3>
        <button className="btn" onClick={()=>setShowForm(!showForm)}>+ Add Billing</button>
      </div>

      <div style={{marginBottom:20}}>
        <div style={{display:'flex', gap:12, marginBottom:16, flexWrap:'wrap'}}>
          <button 
            className="btn" 
            onClick={()=>setStatusFilter('all')}
            style={{
              background: statusFilter === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
              color: statusFilter === 'all' ? 'white' : '#64748b',
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            📊 All
          </button>
          <button 
            className="btn" 
            onClick={()=>setStatusFilter('paid')}
            style={{
              background: statusFilter === 'paid' ? '#10b981' : '#e2e8f0',
              color: statusFilter === 'paid' ? 'white' : '#64748b',
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            ✅ Paid
          </button>
          <button 
            className="btn" 
            onClick={()=>setStatusFilter('pending')}
            style={{
              background: statusFilter === 'pending' ? '#f59e0b' : '#e2e8f0',
              color: statusFilter === 'pending' ? 'white' : '#64748b',
              padding: '10px 20px',
              fontSize: 14,
              fontWeight: 600
            }}
          >
            ⏳ Pending
          </button>
        </div>
        <input 
          type="text" 
          placeholder="🔍 Search by patient, amount, or status..." 
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
          <h4>Add New Billing</h4>
          <form onSubmit={handleAdd}>
            <input placeholder="Patient ID" value={form.patientId} onChange={e=>setForm({...form, patientId: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} required style={{marginBottom:10, padding:8, width:'100%', boxSizing:'border-box'}} />
            
            <div style={{marginBottom:16}}>
              <label style={{display:'block', marginBottom:8, fontWeight:600, fontSize:14}}>Status:</label>
              <div style={{display:'flex', gap:8}}>
                <button 
                  type="button"
                  onClick={()=>setForm({...form, status:'pending'})}
                  style={{
                    padding:'6px 10px',
                    border:'2px solid',
                    borderColor: form.status === 'pending' ? '#f59e0b' : '#e2e8f0',
                    background: form.status === 'pending' ? '#fef3c7' : 'white',
                    color: form.status === 'pending' ? '#92400e' : '#64748b',
                    borderRadius:6,
                    cursor:'pointer',
                    fontWeight:600,
                    fontSize:12,
                    transition:'all 0.2s'
                  }}
                >
                  ⏳ Pending
                </button>
                <button 
                  type="button"
                  onClick={()=>setForm({...form, status:'paid'})}
                  style={{
                    padding:'6px 10px',
                    border:'2px solid',
                    borderColor: form.status === 'paid' ? '#10b981' : '#e2e8f0',
                    background: form.status === 'paid' ? '#d1fae5' : 'white',
                    color: form.status === 'paid' ? '#065f46' : '#64748b',
                    borderRadius:6,
                    cursor:'pointer',
                    fontWeight:600,
                    fontSize:12,
                    transition:'all 0.2s'
                  }}
                >
                  ✅ Paid
                </button>
              </div>
            </div>

            <div style={{display:'flex', gap:10}}>
              <button type="submit" className="btn">Save</button>
              <button type="button" className="btn" style={{background:'#ccc'}} onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead><tr><th>ID</th><th>Patient</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{filteredList.map(b=> (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.patient || b.patientId}</td>
              <td>${b.amount}</td>
              <td>{b.status}</td>
              <td>
                <button className="btn" style={{background:'#10b981', marginRight:6}} onClick={()=>nav(`/billings/${b.id}`)}>View</button>
                <button className="btn" style={{background:'#dc3545'}} onClick={()=>handleDelete(b.id)}>Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
        {filteredList.length === 0 && <div style={{textAlign:'center', color:'var(--muted)', padding:20}}>No billings found</div>}
      </div>
    </div>
  );
}
