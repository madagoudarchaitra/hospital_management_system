const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function parse(res){
  const text = await res.text();
  try{ return JSON.parse(text); }catch(e){ return text; }
}

export async function post(path, body, token){
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(body) });
  return { status: res.status, data: await parse(res) };
}

export async function get(path, token){
  const res = await fetch(`${API_BASE}${path}`, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
  return { status: res.status, data: await parse(res) };
}

export async function put(path, body, token){
  const res = await fetch(`${API_BASE}${path}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '' }, body: JSON.stringify(body) });
  return { status: res.status, data: await parse(res) };
}

export async function remove(path, token){
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers: { Authorization: token ? `Bearer ${token}` : '' } });
  return { status: res.status, data: await parse(res) };
}
