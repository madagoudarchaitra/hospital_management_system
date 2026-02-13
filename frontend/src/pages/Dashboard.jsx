import React from 'react';

const mock = { patients: 128, doctors: 24, appointmentsToday: 12, bedsFree: 23 };

export default function Dashboard(){
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="stats" style={{marginTop:12}}>
        <div className="stat card">
          <h4>Patients</h4>
          <div style={{fontSize:24,fontWeight:700}}>{mock.patients}</div>
        </div>
        <div className="stat card">
          <h4>Doctors</h4>
          <div style={{fontSize:24,fontWeight:700}}>{mock.doctors}</div>
        </div>
        <div className="stat card">
          <h4>Appointments Today</h4>
          <div style={{fontSize:24,fontWeight:700}}>{mock.appointmentsToday}</div>
        </div>
        <div className="stat card">
          <h4>Beds Free</h4>
          <div style={{fontSize:24,fontWeight:700}}>{mock.bedsFree}</div>
        </div>
      </div>
    </div>
  );
}
