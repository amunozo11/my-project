import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import AdminDashboard from './pages/adminDashboardPage';
import LeaderDashboard from './pages/leadersDashboard';
import Login from './pages/loginPage';
import ProfilePage from './pages/profilePage';
import Register from './pages/registerPage';
import TeacherDashboard from './pages/teacherDashboard';
import CollaboratorDashboard from './pages/collaboratorDashboard';
import DirectorDashboard from './pages/directorDashboard';

export default function App() {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-admin" element={<AdminDashboard />} />
        <Route path="/leader-dashboard" element={<LeaderDashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard-teacher" element={<TeacherDashboard />} />
        <Route path="/dashboard-colaborator" element={<CollaboratorDashboard />} />
        <Route path="/dashboard-director" element={<DirectorDashboard />} />

      </Routes>
    </BrowserRouter>
  )
}
