import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';

export default function TeacherStudents() {
  const [searchTerm, setSearchTerm] = useState('');

  const mockStudents = [
    { id: 1, name: 'Alice Smith', email: 'alice.s@example.com', enrolledCourses: 3, lastActive: '2 hours ago', progress: { avg: 78 } },
    { id: 2, name: 'John Doe', email: 'john.d@example.com', enrolledCourses: 1, lastActive: '1 day ago', progress: { avg: 45 } },
    { id: 3, name: 'Emma Wilson', email: 'emma.w@example.com', enrolledCourses: 5, lastActive: 'Just now', progress: { avg: 92 } },
    { id: 4, name: 'Michael Brown', email: 'mbrown@example.com', enrolledCourses: 2, lastActive: '5 days ago', progress: { avg: 12 } },
    { id: 5, name: 'Sophia Lee', email: 'sophia.l@example.com', enrolledCourses: 4, lastActive: '3 hours ago', progress: { avg: 60 } },
  ];

  const filtered = mockStudents.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="teacher-students max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Student Roster</h1>
          <p className="text-secondary">View and manage all students enrolled in your courses.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Search students..." 
            className="bg-bg-secondary border border-glass rounded-md px-4 py-2 w-full md:w-64 focus:border-accent-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-glass border-b border-glass text-sm text-secondary uppercase tracking-wider">
                <th className="p-4 font-medium min-w-[250px]">Student Name</th>
                <th className="p-4 font-medium">Enrolled Courses</th>
                <th className="p-4 font-medium">Avg. Progress</th>
                <th className="p-4 font-medium hidden md:table-cell">Last Active</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass text-sm">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-glass/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent-gradient flex items-center justify-center text-white font-bold">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{student.name}</p>
                        <p className="text-xs text-secondary">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{student.enrolledCourses}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-full bg-bg-primary rounded-full h-2 min-w-[100px]">
                          <div 
                            className={`h-2 rounded-full ${student.progress.avg > 70 ? 'bg-success' : student.progress.avg < 30 ? 'bg-error' : 'bg-warning'}`} 
                            style={{ width: `${student.progress.avg}%` }}
                          ></div>
                       </div>
                       <span>{student.progress.avg}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-secondary hidden md:table-cell">{student.lastActive}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="text-accent underline">Message</Button>
                  </td>
                </tr>
              ))}
              
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-secondary">
                    No students match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <style>{`
        .border-collapse { border-collapse: collapse; }
        .divide-y > * + * { border-top-width: 1px; border-color: var(--border-glass); }
        .tracking-wider { letter-spacing: 0.05em; }
        .min-w-\\[250px\\] { min-width: 250px; }
        .min-w-\\[100px\\] { min-width: 100px; }
        .underline { text-decoration: underline; }
      `}</style>
    </div>
  );
}
