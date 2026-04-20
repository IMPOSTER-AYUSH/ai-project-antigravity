import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FiHome, 
  FiBook, 
  FiMessageSquare, 
  FiPieChart, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiSettings,
  FiUsers,
  FiLogOut
} from 'react-icons/fi';
import Logo from '../UI/Logo';
import './Layout.css';

export default function Topbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const studentLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome /> },
    { name: 'Courses', path: '/courses', icon: <FiBook /> },
    { name: 'AI Tutor', path: '/chat', icon: <FiMessageSquare /> },
    { name: 'Progress', path: '/progress', icon: <FiPieChart /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings /> },
  ];

  const teacherLinks = [
    { name: 'Dashboard', path: '/teacher', icon: <FiHome /> },
    { name: 'Courses', path: '/teacher/courses', icon: <FiBook /> },
    { name: 'Students', path: '/teacher/students', icon: <FiUsers /> },
    { name: 'Analytics', path: '/teacher/analytics', icon: <FiPieChart /> },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <header className="pill-nav">
      <Link to="/" className="brand-logo">
        <Logo size={24} color={theme === 'dark' ? 'white' : 'currentColor'} />
        <span className="brand-text">Human AI</span>
      </Link>

      <nav className="pill-nav-links">
        {links.map(link => {
          const isActive = location.pathname === link.path || location.pathname.startsWith(link.path + '/') && link.path !== '/dashboard' && link.path !== '/teacher';
          
          return (
            <Link key={link.path} to={link.path} className={`pill-nav-link ${isActive ? 'active' : ''}`}>
              <span className="nav-icon">{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="pill-topbar-actions">
        <button className="icon-btn-small" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        
        <div className="pill-user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px', paddingLeft: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="avatar-small">
            {user?.avatar ? (
              <img src={user.avatar} alt={user?.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: '1.2' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>{user?.name || 'User'}</span>
            <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'capitalize' }}>{user?.role || 'student'}</span>
          </div>
          <button 
            onClick={logout} 
            style={{ marginLeft: '4px', cursor: 'pointer', background: 'none', border: 'none', color: '#9ca3af', display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.2s' }}
            title="Log out"
            onMouseOver={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseOut={(e) => e.currentTarget.style.color = '#9ca3af'}
          >
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
