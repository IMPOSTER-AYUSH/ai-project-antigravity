import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import { FiPlayCircle, FiAward, FiClock, FiActivity } from 'react-icons/fi';
import { CourseCard, MOCK_COURSES } from './Courses';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page mb-12">
      {/* Top Welcome Header */}
      <div className="dashboard-header mt-4 text-center md:text-left">
        <h1 className="text-4xl font-extrabold mb-2 text-primary tracking-tight">
          Welcome back, <span className="text-accent">{user?.name?.split(' ')[0] || 'Student'}</span>!
        </h1>
        <p className="text-secondary text-lg mb-8">You've learned for 14 hours this week. Keep up the great work!</p>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats-grid mt-8">
        <Card className="stat-card hoverable" padding="lg">
          <div className="stat-icon-wrapper bg-accent-glass text-accent">
            <FiPlayCircle />
          </div>
          <div className="stat-info">
            <p className="stat-label">Active Courses</p>
            <h3 className="stat-value">4</h3>
          </div>
        </Card>
        
        <Card className="stat-card hoverable" padding="lg">
          <div className="stat-icon-wrapper bg-success-glass text-success">
            <FiAward />
          </div>
          <div className="stat-info">
            <p className="stat-label">Completed Lessons</p>
            <h3 className="stat-value">28</h3>
          </div>
        </Card>

        <Card className="stat-card hoverable" padding="lg">
          <div className="stat-icon-wrapper bg-info-glass text-info">
            <FiClock />
          </div>
          <div className="stat-info">
            <p className="stat-label">Hours Learned</p>
            <h3 className="stat-value">42.5</h3>
          </div>
        </Card>

        <Card className="stat-card hoverable" padding="lg">
          <div className="stat-icon-wrapper bg-warning-glass text-warning">
            <FiActivity />
          </div>
          <div className="stat-info">
            <p className="stat-label">Current Streak</p>
            <h3 className="stat-value">7 Days</h3>
          </div>
        </Card>
      </div>

      {/* Recommended Courses Section */}
      <div className="dashboard-section mt-16">
        <div className="dashboard-section-header">
          <h2 className="text-2xl font-bold text-primary">Recommended Courses</h2>
          <Button variant="ghost" size="sm" className="view-all-btn" onClick={() => navigate('/courses')}>
            View All
          </Button>
        </div>
        
        <div className="dashboard-courses-grid">
          {MOCK_COURSES.slice(0, 3).map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
