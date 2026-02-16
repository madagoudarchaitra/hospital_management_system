import React, { useState } from 'react';

export default function Analytics(){
  const [dateRange, setDateRange] = useState('month');

  // Mock data
  const stats = {
    totalPatients: 128,
    totalDoctors: 24,
    totalAppointments: 156,
    completedAppointments: 142,
    appointmentNoShowRate: 9.0,
    totalRevenue: 45820,
    avgPatientSatisfaction: 4.6,
    bedOccupancyRate: 78.5,
    avgStayDays: 4.2,
    staffCount: 54,
  };

  const topDoctors = [
    { name: 'Dr. Emma Brown', appointments: 34, specialty: 'Cardiology' },
    { name: 'Dr. Aaron Clark', appointments: 28, specialty: 'Orthopedics' },
    { name: 'Dr. Sunita Rao', appointments: 26, specialty: 'Pediatrics' },
    { name: 'Dr. Michael Johnson', appointments: 22, specialty: 'Neurology' },
    { name: 'Dr. Sarah Williams', appointments: 19, specialty: 'Dermatology' },
  ];

  const departmentStats = [
    { dept: 'Cardiology', patients: 28, doctors: 4, revenue: 12400 },
    { dept: 'Orthopedics', patients: 22, doctors: 3, revenue: 9800 },
    { dept: 'Pediatrics', patients: 35, doctors: 5, revenue: 8600 },
    { dept: 'Neurology', patients: 18, doctors: 3, revenue: 7200 },
    { dept: 'General Medicine', patients: 25, doctors: 9, revenue: 7820 },
  ];

  const getColor = (value, max) => {
    const ratio = value / max;
    if(ratio > 0.7) return '#10b981';
    if(ratio > 0.4) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
        <h2>📊 Analytics & Reports</h2>
        <select 
          value={dateRange} 
          onChange={e=>setDateRange(e.target.value)}
          style={{padding:8, borderRadius:8, border:'1px solid #e0f2fe', fontSize:13}}
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <h3 style={{marginBottom:16, fontSize:16, fontWeight:700}}>📈 Key Metrics</h3>
      <div className="grid">
        {[
          { label: 'Total Patients', value: stats.totalPatients, icon: '👥', color: '#3b82f6' },
          { label: 'Doctors', value: stats.totalDoctors, icon: '🩺', color: '#10b981' },
          { label: 'Appointments', value: stats.totalAppointments, icon: '📅', color: '#f59e0b' },
          { label: 'Completed', value: stats.completedAppointments, icon: '✓', color: '#ec4899' },
          { label: 'No-Show Rate', value: `${stats.appointmentNoShowRate}%`, icon: '📊', color: '#ef4444' },
          { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: '#06b6d4' },
        ].map((m, i) => (
          <div key={i} className="card col-3">
            <div style={{fontSize:28, marginBottom:8}}>{m.icon}</div>
            <div style={{fontSize:12, color:'var(--muted)', marginBottom:8}}>{m.label}</div>
            <div style={{fontSize:24, fontWeight:800, color:m.color}}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Service Metrics */}
      <h3 style={{marginTop:28, marginBottom:16, fontSize:16, fontWeight:700}}>🏥 Service Metrics</h3>
      <div className="grid">
        {[
          { label: 'Bed Occupancy Rate', value: `${stats.bedOccupancyRate}%`, desc: 'Average occupancy' },
          { label: 'Avg Patient Stay', value: `${stats.avgStayDays} days`, desc: 'Average duration' },
          { label: 'Patient Satisfaction', value: `${stats.avgPatientSatisfaction}/5`, desc: 'Average rating' },
          { label: 'Staff Count', value: stats.staffCount, desc: 'Total staff members' },
        ].map((m, i) => (
          <div key={i} className="card col-4">
            <div style={{fontSize:12, color:'var(--muted)', marginBottom:4}}>{m.label}</div>
            <div style={{fontSize:28, fontWeight:800, color:'#0ea5e9', marginBottom:8}}>{m.value}</div>
            <div style={{fontSize:11, color:'var(--muted)'}}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Top Performing Doctors */}
      <h3 style={{marginTop:28, marginBottom:16, fontSize:16, fontWeight:700}}>⭐ Top Performing Doctors</h3>
      <div className="card">
        <table className="table" style={{marginBottom:0}}>
          <thead>
            <tr style={{background:'#f0f9ff'}}>
              <th style={{fontWeight:700}}>Doctor Name</th>
              <th style={{fontWeight:700}}>Specialty</th>
              <th style={{fontWeight:700, textAlign:'right'}}>Appointments</th>
              <th style={{fontWeight:700, textAlign:'right'}}>Performance</th>
            </tr>
          </thead>
          <tbody>
            {topDoctors.map((d, i) => (
              <tr key={i} style={{borderBottom:'1px solid #f0f9ff'}}>
                <td style={{fontWeight:600}}>{d.name}</td>
                <td>{d.specialty}</td>
                <td style={{textAlign:'right', fontWeight:700}}>{d.appointments}</td>
                <td style={{textAlign:'right'}}>
                  <div style={{display:'flex', alignItems:'center', gap:6, justifyContent:'flex-end'}}>
                    <div style={{width:60, height:6, background:'#f0f9ff', borderRadius:3, overflow:'hidden'}}>
                      <div style={{height:'100%', background:getColor(d.appointments, 40), width:`${(d.appointments/40)*100}%`}}></div>
                    </div>
                    <span style={{fontSize:11, fontWeight:700, color:getColor(d.appointments, 40)}}>{Math.round((d.appointments/40)*100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Performance */}
      <h3 style={{marginTop:28, marginBottom:16, fontSize:16, fontWeight:700}}>🏢 Department Performance</h3>
      <div className="grid">
        {departmentStats.map((d, i) => (
          <div key={i} className="card col-4">
            <div style={{fontWeight:700, marginBottom:12, fontSize:14}}>{d.dept}</div>
            <div style={{display:'grid', gap:8, fontSize:12}}>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Patients</div>
                <div style={{fontWeight:700, fontSize:18, color:'#3b82f6'}}>{d.patients}</div>
              </div>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Doctors</div>
                <div style={{fontWeight:700, fontSize:18, color:'#10b981'}}>{d.doctors}</div>
              </div>
              <div>
                <div style={{color:'var(--muted)', marginBottom:4}}>Revenue</div>
                <div style={{fontWeight:700, fontSize:18, color:'#06b6d4'}}>{'$' + d.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Insights */}
      <h3 style={{marginTop:28, marginBottom:16, fontSize:16, fontWeight:700}}>💡 Quick Insights</h3>
      <div className="grid">
        {[
          { title: 'High Patient Load', desc: 'Pediatrics department has the highest number of patients (35). Consider additional staffing.', icon: '⚠️', color: '#f59e0b' },
          { title: 'Revenue Leader', desc: 'Cardiology generates the highest revenue ($12,400). Expand services if possible.', icon: '📈', color: '#10b981' },
          { title: 'Occupancy Alert', desc: 'Bed occupancy at 78.5%. Monitor for peak hours to ensure adequate resources.', icon: '🛏️', color: '#0ea5e9' },
          { title: 'Staff Utilization', desc: '54 staff members across all departments. Optimal distribution achieved.', icon: '👥', color: '#ec4899' },
        ].map((i, idx) => (
          <div key={idx} className="card col-3" style={{borderLeft:`4px solid ${i.color}`}}>
            <div style={{fontSize:20, marginBottom:8}}>{i.icon}</div>
            <div style={{fontWeight:700, marginBottom:4, fontSize:13}}>{i.title}</div>
            <div style={{fontSize:12, color:'var(--muted)', lineHeight:1.5}}>{i.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
