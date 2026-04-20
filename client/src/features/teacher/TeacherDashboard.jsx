import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/UI/Card';
import { FiUsers, FiBook, FiDollarSign, FiStar } from 'react-icons/fi';

export default function TeacherDashboard() {
  const { user } = useAuth();

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header mb-8">
        <h1>Teacher Dashboard</h1>
        <p className="text-secondary mt-1">Manage your courses, students, and review analytics.</p>
      </div>

      <div className="stats-grid grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card className="stat-card" padding="md">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-info-light text-info flex items-center justify-center text-xl">
              <FiUsers />
            </div>
            <div>
              <p className="text-secondary text-sm">Total Students</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </div>
        </Card>
        <Card className="stat-card" padding="md">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center text-xl">
              <FiBook />
            </div>
            <div>
              <p className="text-secondary text-sm">Active Courses</p>
              <h3 className="text-2xl font-bold">4</h3>
            </div>
          </div>
        </Card>
        <Card className="stat-card" padding="md">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-light text-success flex items-center justify-center text-xl">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-secondary text-sm">Total Revenue</p>
              <h3 className="text-2xl font-bold">$12,450</h3>
            </div>
          </div>
        </Card>
        <Card className="stat-card" padding="md">
           <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning-light text-warning flex items-center justify-center text-xl">
              <FiStar />
            </div>
            <div>
              <p className="text-secondary text-sm">Avg. Rating</p>
              <h3 className="text-2xl font-bold">4.8</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Recent Enrollments</h2>
            <button className="text-sm text-accent hover:underline">View All</button>
          </div>
          
          <div className="divide-y divide-glass border border-glass rounded-lg overflow-hidden">
             {[1,2,3,4].map(num => (
                <div key={num} className="p-4 flex items-center justify-between hover:bg-glass/30 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-bg-glass flex items-center justify-center text-lg">👩‍🎓</div>
                      <div>
                        <p className="font-semibold text-sm">Student {num}</p>
                        <p className="text-xs text-secondary">Enrolled in React Masterclass</p>
                      </div>
                   </div>
                   <span className="text-xs text-muted">{num} hours ago</span>
                </div>
             ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold mb-6">Course Performance Overview</h2>
          <div className="space-y-4">
             <div className="p-4 rounded-lg bg-bg-secondary border border-glass">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-sm">React Masterclass</span>
                  <span className="text-sm font-bold text-success">+$450</span>
                </div>
                <div className="w-full bg-bg-primary rounded-full h-2">
                  <div className="bg-success rounded-full h-2" style={{width: '85%'}}></div>
                </div>
             </div>
             <div className="p-4 rounded-lg bg-bg-secondary border border-glass">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-sm">System Design</span>
                  <span className="text-sm font-bold text-success">+$210</span>
                </div>
                <div className="w-full bg-bg-primary rounded-full h-2">
                  <div className="bg-success rounded-full h-2" style={{width: '65%'}}></div>
                </div>
             </div>
             <div className="p-4 rounded-lg bg-bg-secondary border border-glass flex items-center justify-center flex-col mt-4">
                <p className="text-sm text-secondary mb-2">Want deeper insights?</p>
                <button className="text-accent text-sm font-medium hover:underline">Go to Analytics</button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
