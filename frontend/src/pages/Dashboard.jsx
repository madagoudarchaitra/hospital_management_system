import React from 'react';

const mock = { patients: 128, doctors: 24, appointmentsToday: 12, bedsFree: 23 };

export default function Dashboard(){
  const stats = [
    { label: 'Total Patients', value: mock.patients, icon: '🧑‍⚕️', color: '#3b82f6', trend: '+5%' },
    { label: 'Active Doctors', value: mock.doctors, icon: '👨‍⚕️', color: '#10b981', trend: '+2%' },
    { label: "Today's Appointments", value: mock.appointmentsToday, icon: '📅', color: '#f59e0b', trend: '+8%' },
    { label: 'Available Beds', value: mock.bedsFree, icon: '🛏️', color: '#ec4899', trend: '-3%' },
  ];

  const quickActions = [
    { label: 'New Appointment', icon: '➕', action: '#' },
    { label: 'Add Patient', icon: '👤', action: '#' },
    { label: 'View Reports', icon: '📊', action: '#' },
  ];

  return (
    <div style={{paddingBottom: 20}}>
      <div style={{marginBottom:32}}>
        <h2 style={{fontSize:32, fontWeight:800, marginBottom:8, background:'linear-gradient(135deg,#0ea5e9,#06b6d4)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text'}}>
          Welcome to Hospital Management System 🏥
        </h2>
        <p style={{color:'var(--muted)', fontSize:16, margin:'0'}}>Your Complete Healthcare Management Solution</p>
        <p style={{color:'var(--muted)', fontSize:13, margin:'4px 0 0 0'}}>Monitor key metrics and manage operations efficiently</p>
      </div>

      <div className="stats" style={{marginTop:24, marginBottom:32}}>
        {stats.map((stat, i) => (
          <div key={i} className="stat card" style={{'--stat-color': stat.color, cursor:'pointer'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
              <div className="stat-icon" style={{fontSize:36}}>{stat.icon}</div>
              <span style={{color:stat.color, fontSize:12, fontWeight:700, background:(`rgba(${parseInt(stat.color.slice(1,3),16)}, ${parseInt(stat.color.slice(3,5),16)}, ${parseInt(stat.color.slice(5,7),16)}, 0.2)`), padding:'4px 8px', borderRadius:'6px'}}>{stat.trend}</span>
            </div>
            <h4 style={{margin:'0 0 8px 0', fontSize:13, color:'var(--muted)', fontWeight:600, letterSpacing:'0.3px', textTransform:'uppercase'}}>{stat.label}</h4>
            <div style={{fontSize:36, fontWeight:800, color:stat.color, marginBottom:8}}>{stat.value}</div>
            <div style={{height:'2px', background:stat.color, opacity:0.3, borderRadius:2}}></div>
          </div>
        ))}
      </div>

      <div className="grid" style={{marginTop:24}}>
        <div className="col-8 card">
          <h4 style={{marginTop:0}}>📈 Quick Overview</h4>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginTop:20}}>
            {[
              {label: 'Check-in Today', value: '45', color:'#10b981'},
              {label: 'Pending Approvals', value: '8', color:'#f59e0b'},
              {label: 'Critical Cases', value: '2', color:'#ef4444'},
            ].map((item, i) => (
              <div key={i} style={{padding:16, background:`rgba(${item.color === '#10b981' ? '16,185,129' : item.color === '#f59e0b' ? '245,158,11' : '239,68,68'}, 0.08)`, borderRadius:10, borderLeft:`3px solid ${item.color}`, cursor:'pointer', transition:'all .2s ease'}} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
                <div style={{fontSize:12, color:'var(--muted)', marginBottom:6, fontWeight:600}}>{item.label}</div>
                <div style={{fontSize:24, fontWeight:800, color:item.color}}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-4 card">
          <h4 style={{marginTop:0}}>⚡ Quick Actions</h4>
          <div style={{display:'flex', flexDirection:'column', gap:10, marginTop:20}}>
            {quickActions.map((action, i) => (
              <a key={i} href={action.action} style={{
                padding:'12px 14px',
                background:'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(6,182,212,0.1))',
                border:'1px solid rgba(14,165,233,0.2)',
                borderRadius:10,
                textDecoration:'none',
                color:'var(--accent)',
                fontWeight:600,
                fontSize:14,
                display:'flex',
                alignItems:'center',
                gap:10,
                transition:'all .2s ease',
                cursor:'pointer'
              }} 
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(6,182,212,0.15))';
                e.currentTarget.style.borderColor = 'rgba(14,165,233,0.4)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14,165,233,0.1), rgba(6,182,212,0.1))';
                e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <span style={{fontSize:16}}>{action.icon}</span>
                <span>{action.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
