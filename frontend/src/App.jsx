import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Patients from './pages/Patients.jsx';
import PatientDetail from './pages/PatientDetail.jsx';
import Doctors from './pages/Doctors.jsx';
import Appointments from './pages/Appointments.jsx';
import Billings from './pages/Billings.jsx';
import Pharmacies from './pages/Pharmacies.jsx';
import LabReports from './pages/LabReports.jsx';
import Beds from './pages/Beds.jsx';
import Staffs from './pages/Staffs.jsx';
import Users from './pages/Users.jsx';

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
      <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      <Route path="/billings" element={<ProtectedRoute><Billings /></ProtectedRoute>} />
      <Route path="/pharmacies" element={<ProtectedRoute><Pharmacies /></ProtectedRoute>} />
      <Route path="/lab-reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
      <Route path="/beds" element={<ProtectedRoute><Beds /></ProtectedRoute>} />
      <Route path="/staffs" element={<ProtectedRoute><Staffs /></ProtectedRoute>} />
    </Routes>
  );
}
