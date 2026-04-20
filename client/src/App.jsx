import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Layouts
import AppLayout from './components/Layout/AppLayout';

// Pages
import Landing from './features/landing/Landing';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import RoleSelection from './features/auth/RoleSelection';
import StudentDashboard from './features/student/StudentDashboard';
import Courses from './features/student/Courses';
import Progress from './features/student/Progress';
import Chat from './features/chat/Chat';
import Settings from './features/settings/Settings';
import TeacherDashboard from './features/teacher/TeacherDashboard';
import TeacherCourses from './features/teacher/TeacherCourses';
import CreateCourse from './features/teacher/CreateCourse';
import TeacherStudents from './features/teacher/TeacherStudents';
import TeacherAnalytics from './features/teacher/TeacherAnalytics';

// Shared CSS
import './index.css';

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected Routes (No Layout) */}
      <Route 
        path="/select-role" 
        element={<ProtectedRoute><RoleSelection /></ProtectedRoute>} 
      />

      {/* Student App Layout */}
      <Route path="/" element={<ProtectedRoute roles={['student']}><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="progress" element={<Progress />} />
        <Route path="chat" element={<Chat />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Teacher App Layout */}
      <Route path="/teacher" element={<ProtectedRoute roles={['teacher', 'admin']}><AppLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="courses/new" element={<CreateCourse />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="analytics" element={<TeacherAnalytics />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>404 - Page Not Found</h2>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return <AppContent />;
}

export default App;
