import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { FiBookOpen, FiMonitor } from 'react-icons/fi';
import './RoleSelection.css';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setRole } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    try {
      await setRole(selectedRole);
      addToast(`Role set to ${selectedRole} successfully!`, 'success');
      navigate(selectedRole === 'teacher' ? '/teacher' : '/dashboard');
    } catch (err) {
      addToast(err.message || 'Failed to set role. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="role-page">
      <div className="role-container">
        <div className="role-header">
          <h1>Choose your path</h1>
          <p>How do you want to use Human AI?</p>
        </div>

        <div className="role-cards">
          <Card 
            hoverable 
            className={`role-card ${selectedRole === 'student' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('student')}
          >
            <div className="role-icon student-icon">
              <FiBookOpen />
            </div>
            <h2>I'm a Student</h2>
            <p>I want to learn new skills, track my progress, and chat with the AI tutor.</p>
            <div className="role-radio">
              <div className={`radio-inner ${selectedRole === 'student' ? 'active' : ''}`}></div>
            </div>
          </Card>

          <Card 
            hoverable 
            className={`role-card ${selectedRole === 'teacher' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('teacher')}
          >
            <div className="role-icon teacher-icon">
              <FiMonitor />
            </div>
            <h2>I'm a Teacher</h2>
            <p>I want to create courses, manage students, and view teaching analytics.</p>
            <div className="role-radio">
              <div className={`radio-inner ${selectedRole === 'teacher' ? 'active' : ''}`}></div>
            </div>
          </Card>
        </div>

        <div className="role-action">
          <Button 
            size="lg" 
            fullWidth 
            onClick={handleContinue} 
            disabled={!selectedRole}
            isLoading={loading}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
