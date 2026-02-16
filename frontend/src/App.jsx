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
import DoctorDetail from './pages/DoctorDetail.jsx';
import Appointments from './pages/Appointments.jsx';
import AppointmentDetail from './pages/AppointmentDetail.jsx';
import Billings from './pages/Billings.jsx';
import BillingDetail from './pages/BillingDetail.jsx';
import Pharmacies from './pages/Pharmacies.jsx';
import PharmacyDetail from './pages/PharmacyDetail.jsx';
import LabReports from './pages/LabReports.jsx';
import LabReportDetail from './pages/LabReportDetail.jsx';
import Beds from './pages/Beds.jsx';
import BedDetail from './pages/BedDetail.jsx';
import Staffs from './pages/Staffs.jsx';
import StaffDetail from './pages/StaffDetail.jsx';
import Users from './pages/Users.jsx';
import Prescriptions from './pages/Prescriptions.jsx';
import VitalSigns from './pages/VitalSigns.jsx';
import DoctorSchedules from './pages/DoctorSchedules.jsx';
import Analytics from './pages/Analytics.jsx';
import MedicalRecords from './pages/MedicalRecords.jsx';
import Admissions from './pages/Admissions.jsx';
import PharmacyInventory from './pages/PharmacyInventory.jsx';
import EmergencyTriage from './pages/EmergencyTriage.jsx';
import Departments from './pages/Departments.jsx';

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
      <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetail /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
      <Route path="/appointments/:id" element={<ProtectedRoute><AppointmentDetail /></ProtectedRoute>} />
      <Route path="/billings" element={<ProtectedRoute><Billings /></ProtectedRoute>} />
      <Route path="/billings/:id" element={<ProtectedRoute><BillingDetail /></ProtectedRoute>} />
      <Route path="/pharmacies" element={<ProtectedRoute><Pharmacies /></ProtectedRoute>} />
      <Route path="/pharmacies/:id" element={<ProtectedRoute><PharmacyDetail /></ProtectedRoute>} />
      <Route path="/lab-reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
      <Route path="/lab-reports/:id" element={<ProtectedRoute><LabReportDetail /></ProtectedRoute>} />
      <Route path="/beds" element={<ProtectedRoute><Beds /></ProtectedRoute>} />
      <Route path="/beds/:id" element={<ProtectedRoute><BedDetail /></ProtectedRoute>} />
      <Route path="/staffs" element={<ProtectedRoute><Staffs /></ProtectedRoute>} />
      <Route path="/staffs/:id" element={<ProtectedRoute><StaffDetail /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
      <Route path="/vital-signs" element={<ProtectedRoute><VitalSigns /></ProtectedRoute>} />
      <Route path="/doctor-schedules" element={<ProtectedRoute><DoctorSchedules /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
      <Route path="/admissions" element={<ProtectedRoute><Admissions /></ProtectedRoute>} />
      <Route path="/pharmacy-inventory" element={<ProtectedRoute><PharmacyInventory /></ProtectedRoute>} />
      <Route path="/emergency-triage" element={<ProtectedRoute><EmergencyTriage /></ProtectedRoute>} />
      <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
    </Routes>
  );
}

