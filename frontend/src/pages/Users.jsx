import React, { useEffect, useState } from 'react';
import { get, put, remove } from '../services/api';

export default function Users(){
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load(){ setLoading(true); const t = localStorage.getItem('token'); const res = await get('/users', t); if(res.status===200) setList(res.data || []); setLoading(false); }
  useEffect(()=>{ load() }, []);

  async function changeRole(id, role){ const t = localStorage.getItem('token'); const res = await put(`/users/${id}`, { role }, t); if(res.status===200) load(); else alert(res.data.message || 'Error'); }
  async function del(id){ if(!confirm('Delete user?')) return; const t = localStorage.getItem('token'); const res = await remove(`/users/${id}`, t); if(res.status===200) load(); else alert(res.data.message || 'Error'); }

  return (
    <div>
      <h3>Users</h3>
      {loading ? <div>Loading...</div> : (
        <div className="card">
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>{list.map(u=> (
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
        </div>
      )}
    </div>
  );
}
