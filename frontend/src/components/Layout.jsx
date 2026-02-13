import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Layout({ children }){
  const nav = useNavigate();
  const [userRole, setUserRole] = React.useState('Guest');
  const logout = () => { localStorage.removeItem('token'); nav('/login'); };

  React.useEffect(()=>{
    (async ()=>{
      const t = localStorage.getItem('token');
      if(!t) return;
      try{
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000/api') + '/auth/me', { headers: { Authorization: `Bearer ${t}` } });
        if(res.ok){ const data = await res.json(); setUserRole(data.role || 'User'); }
      }catch(e){/* ignore */}
    })();
  },[]);

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand">HMS</div>
        <nav className="main-nav">
          <Link to="/">Dashboard</Link>
          <Link to="/patients">Patients</Link>
          <Link to="/doctors">Doctors</Link>
          <Link to="/appointments">Appointments</Link>
          <Link to="/billings">Billings</Link>
          <Link to="/pharmacies">Pharmacy</Link>
          <Link to="/lab-reports">Lab Reports</Link>
          <Link to="/beds">Beds</Link>
          <Link to="/staffs">Staff</Link>
        </nav>
        <div className="header-actions">
          <span className="role">{userRole}</span>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="app-content">{children}</main>

      <footer className="app-footer">© {new Date().getFullYear()} Hospital Management System</footer>
    </div>
  );
}
