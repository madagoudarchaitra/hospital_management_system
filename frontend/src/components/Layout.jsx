import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ThemeSelector from './ThemeSelector.jsx';

export default function Layout({ children }){
  const nav = useNavigate();
  const [userRole, setUserRole] = React.useState('Guest');
  const [collapsed, setCollapsed] = React.useState(false);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'cyan');
  const logout = () => { localStorage.removeItem('token'); nav('/login'); };

  const themes = {
    cyan: { name: 'Cyan', accent1: '#0ea5e9', accent2: '#06b6d4', bg: '#f0f9ff' },
    blue: { name: 'Blue', accent1: '#2563eb', accent2: '#3b82f6', bg: '#eff6ff' },
    purple: { name: 'Purple', accent1: '#a855f7', accent2: '#d946ef', bg: '#faf5ff' },
    green: { name: 'Green', accent1: '#10b981', accent2: '#059669', bg: '#f0fdf4' },
    orange: { name: 'Orange', accent1: '#f97316', accent2: '#fb923c', bg: '#fff7ed' },
    rose: { name: 'Rose', accent1: '#f43f5e', accent2: '#e11d48', bg: '#fff1f2' },
  };

  const applyTheme = (t) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    const colors = themes[t];
    document.documentElement.style.setProperty('--accent', colors.accent1);
    document.documentElement.style.setProperty('--accent-2', colors.accent2);
    document.documentElement.style.setProperty('--bg', colors.bg);
  };

  React.useEffect(() => {
    applyTheme(theme);
  }, []);

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

  const links = [
    ['/', 'Dashboard', '🏠'],
    ['/patients', 'Patients', '🧑‍🤝‍🧑'],
    ['/doctors', 'Doctors', '🩺'],
    ['/appointments', 'Appointments', '📅'],
    ['/prescriptions', 'Prescriptions', '💊'],
    ['/vital-signs', 'Vital Signs', '🩹'],
    ['/medical-records', 'Medical Records', '📋'],
    ['/admissions', 'Admissions', '🏥'],
    ['/doctor-schedules', 'Schedules', '⏰'],
    ['/pharmacy-inventory', 'Pharmacy', '🏪'],
    ['/billings', 'Billings', '💳'],
    ['/lab-reports', 'Lab Reports', '🔬'],
    ['/beds', 'Beds', '🛏️'],
    ['/emergency-triage', 'Emergency', '🚨'],
    ['/departments', 'Departments', '🏢'],
    ['/staffs', 'Staff', '👩‍⚕️'],
    ['/users', 'Users', '👥'],
    ['/analytics', 'Analytics', '📊'],
  ];

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon">🏥</div>
          <div>
            <div className="brand">HMS</div>
            <div className="brand-subtitle">Hospital Management</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="collapse-toggle" onClick={()=>setCollapsed(c=>!c)} aria-label="Toggle sidebar">{collapsed ? '›' : '‹'}</button>
          <ThemeSelector theme={theme} onThemeChange={applyTheme} themes={themes} />
          <div className="role">{userRole}</div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className={`layout-wrapper ${collapsed ? 'collapsed' : ''}`}>
        <aside className={`sidebar ${collapsed ? 'collapsed' : 'visible'}`}>
          <div className="sidebar-brand">HMS</div>
          <nav className="sidebar-nav">
            {links.map(([to, label, icon]) => (
              <NavLink key={to} to={to} className={({isActive})=>"nav-link" + (isActive? ' active':'')} onClick={() => {
                if(window.innerWidth < 768) setCollapsed(true);
              }}>
                <span className="icon">{icon}</span>
                <span className="label">{label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="app-content">{children}</main>
      </div>

      <footer className="app-footer">© {new Date().getFullYear()} Hospital Management System</footer>
    </div>
  );
}
