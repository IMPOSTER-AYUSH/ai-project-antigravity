import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiBook, 
  FiMessageSquare, 
  FiPieChart, 
  FiSettings, 
  FiLogOut,
  FiPlusCircle,
  FiUsers
} from 'react-icons/fi';
import Logo from '../UI/Logo';
import './Layout.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'My Courses', path: '/courses', icon: <FiBook /> },
    { name: 'AI Tutor', path: '/chat', icon: <FiMessageSquare /> },
    { name: 'Progress', path: '/progress', icon: <FiPieChart /> },
  ];

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher', icon: <FiHome /> },
    { name: 'My Courses', path: '/teacher/courses', icon: <FiBook /> },
    { name: 'Create Course', path: '/teacher/courses/new', icon: <FiPlusCircle /> },
    { name: 'Students', path: '/teacher/students', icon: <FiUsers /> },
    { name: 'Analytics', path: '/teacher/analytics', icon: <FiPieChart /> },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="brand-logo">
          <Logo size={36} />
          <span className="brand-text sidebar-brand">Human AI</span>
        </Link>
      </div>

      <div className="sidebar-nav-container">
        <nav className="sidebar-nav">
          <ul>
            {links.map((link) => {
              const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/');
              return (
                <li key={link.path}>
                  <Link to={link.path} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-icon">{link.icon}</span>
                    <span className="sidebar-text">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <ul>
            <li>
              <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}>
                <span className="sidebar-icon"><FiSettings /></span>
                <span className="sidebar-text">Settings</span>
              </Link>
            </li>
            <li>
              <button className="sidebar-link logout-btn" onClick={logout}>
                <span className="sidebar-icon"><FiLogOut /></span>
                <span className="sidebar-text">Log Out</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
