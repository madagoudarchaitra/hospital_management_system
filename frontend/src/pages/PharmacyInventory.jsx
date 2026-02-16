import React, { useState } from 'react';
import AddForm from '../components/AddForm';

const mock = [
  { id: 1, medicineName: 'Aspirin', category: 'Pain Relief', quantity: 450, minStock: 100, maxStock: 500, unitPrice: 5.50, expiryDate: new Date(Date.now() + 180*24*60*60*1000).toISOString() },
  { id: 2, medicineName: 'Metformin', category: 'Diabetes', quantity: 280, minStock: 200, maxStock: 500, unitPrice: 12.00, expiryDate: new Date(Date.now() + 365*24*60*60*1000).toISOString() },
  { id: 3, medicineName: 'Amoxicillin', category: 'Antibiotic', quantity: 65, minStock: 100, maxStock: 300, unitPrice: 8.75, expiryDate: new Date(Date.now() + 90*24*60*60*1000).toISOString() }
];

export default function PharmacyInventory(){
  const [list, setList] = useState(mock);
  const [filteredList, setFilteredList] = useState(mock);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medicineName: '', category: '', quantity: '', minStock: '', maxStock: '', unitPrice: '', expiryDate: '' });

  React.useEffect(() => {
    const filtered = list.filter(m =>
      (m.medicineName || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.category || '').toLowerCase().includes(search.toLowerCase())
    );
    setFilteredList(filtered);
  }, [search, list]);

  const handleAdd = (e) => {
    e.preventDefault();
    const newMedicine = { 
      id: Date.now(), 
      ...form,
      quantity: parseInt(form.quantity),
      minStock: parseInt(form.minStock),
      maxStock: parseInt(form.maxStock),
      unitPrice: parseFloat(form.unitPrice)
    };
    setList([...list, newMedicine]);
    setForm({ medicineName: '', category: '', quantity: '', minStock: '', maxStock: '', unitPrice: '', expiryDate: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if(!window.confirm('Delete this medicine?')) return;
    setList(list.filter(m => m.id !== id));
  };

  const updateQuantity = (id, amount) => {
    setList(list.map(m => m.id === id ? { ...m, quantity: Math.max(0, m.quantity + amount) } : m));
  };

  const getStockStatus = (medicine) => {
    if(medicine.quantity <= medicine.minStock) return { status: 'Low Stock', color: '#ef4444', bg: '#fee2e2' };
    if(medicine.quantity >= medicine.maxStock) return { status: 'Overstock', color: '#f59e0b', bg: '#fef3c7' };
    return { status: 'Optimal', color: '#10b981', bg: '#f0fdf4' };
  };

  const isExpiringSoon = (expiryDate) => {
    const daysLeft = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return daysLeft < 90;
  };

  const categories = ['Pain Relief', 'Diabetes', 'Antibiotic', 'Cardiovascular', 'Respiratory', 'Allergy', 'Immune Support', 'Vitamin'];

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20}}>
        <h3>💊 Pharmacy Inventory</h3>
        <button className="btn" onClick={()=>setShowForm(true)}>+ Add Medicine</button>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:15, alignItems:'center'}}>
        <input 
          type="text" 
          placeholder="🔍 Search by name or category..." 
          value={search} 
          onChange={(e)=>setSearch(e.target.value)}
          style={{padding:10, flex:1, maxWidth:500, borderRadius:8, border:'1px solid #e0f2fe'}}
        />
        <div style={{fontSize:12, color:'var(--muted)'}}>
          Total Items: {list.length} | Total Value: {'$' + (list.reduce((sum, m) => sum + (m.quantity * m.unitPrice), 0)).toFixed(2)}
        </div>
      </div>

      <AddForm 
        title="Add Medicine to Inventory" 
        isOpen={showForm} 
        onClose={()=>setShowForm(false)} 
        onSubmit={handleAdd}
      >
        <input type="text" placeholder="Medicine Name" value={form.medicineName} onChange={e=>setForm({...form, medicineName:e.target.value})} required />
        <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} required>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Current Quantity" value={form.quantity} onChange={e=>setForm({...form, quantity:e.target.value})} required />
        <input type="number" placeholder="Minimum Stock Level" value={form.minStock} onChange={e=>setForm({...form, minStock:e.target.value})} required />
        <input type="number" placeholder="Maximum Stock Level" value={form.maxStock} onChange={e=>setForm({...form, maxStock:e.target.value})} required />
        <input type="number" step="0.01" placeholder="Unit Price ($)" value={form.unitPrice} onChange={e=>setForm({...form, unitPrice:e.target.value})} required />
        <input type="date" placeholder="Expiry Date" value={form.expiryDate ? new Date(form.expiryDate).toISOString().split('T')[0] : ''} onChange={e=>setForm({...form, expiryDate:e.target.value})} required />
      </AddForm>

      <div className="grid">
        {filteredList.length > 0 ? filteredList.map(m => {
          const status = getStockStatus(m);
          const expiring = isExpiringSoon(m.expiryDate);
          return (
            <div key={m.id} className="card col-4">
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:12}}>
                <div>
                  <div style={{fontWeight:700, fontSize:15}}>{m.medicineName}</div>
                  <div style={{fontSize:12, color:'var(--muted)', marginTop:4}}>{m.category}</div>
                </div>
                <div style={{fontSize:10, fontWeight:700, color:'#fff', background:status.color, padding:'4px 8px', borderRadius:6}}>
                  {status.status}
                </div>
              </div>

              {expiring && (
                <div style={{background:'#fecaca', padding:8, borderRadius:6, marginBottom:10, fontSize:11, color:'#991b1b', fontWeight:600}}>
                  ⚠️ Expiring soon: {new Date(m.expiryDate).toLocaleDateString()}
                </div>
              )}

              <div style={{background:status.bg, padding:10, borderRadius:8, marginBottom:10}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6}}>
                  <div style={{fontSize:11, color:'var(--muted)'}}>Stock Level</div>
                  <div style={{fontSize:12, fontWeight:700}}>{m.quantity} units</div>
                </div>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{flex:1, height:8, background:'rgba(0,0,0,0.1)', borderRadius:4, overflow:'hidden'}}>
                    <div style={{height:'100%', background:status.color, width:`${Math.min(100, (m.quantity / m.maxStock) * 100)}%`}}></div>
                  </div>
                  <span style={{fontSize:10, fontWeight:700,color:'var(--muted)'}}>{m.minStock}-{m.maxStock}</span>
                </div>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12, fontSize:12}}>
                <div style={{background:'#e0f2fe', padding:8, borderRadius:6}}>
                  <div style={{color:'var(--muted)', fontSize:10, marginBottom:3}}>Unit Price</div>
                  <div style={{fontWeight:700}}>{'$' + m.unitPrice.toFixed(2)}</div>
                </div>
                <div style={{background:'#dbeafe', padding:8, borderRadius:6}}>
                  <div style={{color:'var(--muted)', fontSize:10, marginBottom:3}}>Total Value</div>
                  <div style={{fontWeight:700}}>{'$' + (m.quantity * m.unitPrice).toFixed(2)}</div>
                </div>
              </div>

              <div style={{display:'flex', gap:6, marginBottom:10}}>
                <button style={{flex:1, padding:'6px', fontSize:12, background:'#fef3c7', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600}} onClick={()=>updateQuantity(m.id, -10)}>-10</button>
                <button style={{flex:1, padding:'6px', fontSize:12, background:'#d1fae5', border:'none', borderRadius:6, cursor:'pointer', fontWeight:600}} onClick={()=>updateQuantity(m.id, 10)}>+10</button>
              </div>

              <button className="btn" style={{width:'100%', background:'#ef4444'}} onClick={()=>handleDelete(m.id)}>Delete</button>
            </div>
          );
        }) : <div style={{textAlign:'center', color:'var(--muted)', padding:20, gridColumn:'1/-1'}}>No medicines found</div>}
      </div>
    </div>
  );
}
