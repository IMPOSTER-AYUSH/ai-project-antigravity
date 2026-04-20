import React, { useState } from 'react';
import Card from '../../components/UI/Card';
import Badge from '../../components/UI/Badge';
import { FiClock, FiStar, FiPlayCircle, FiMoreHorizontal } from 'react-icons/fi';
import './Courses.css';

// Mock Data
export const MOCK_COURSES = [
  { id: 1, title: 'Advanced Full-Stack Engineering with React & Node', instructor: 'Sarah Jenkins', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop', duration: '12h 30m', rating: 4.8, level: 'Advanced', progress: 45 },
  { id: 2, title: 'Mastering System Design & Architecture', instructor: 'David Chen', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop', duration: '8h 15m', rating: 4.9, level: 'Intermediate', progress: 12 },
  { id: 3, title: 'UI/UX Design Systems for Tech Teams', instructor: 'Elena Rodriguez', thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', duration: '5h 45m', rating: 4.7, level: 'Beginner', progress: 89 },
  { id: 4, title: 'Web3 & Blockchain Fundamentals', instructor: 'Alex Mercer', thumbnail: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&h=400&fit=crop', duration: '10h 0m', rating: 4.6, level: 'Beginner', progress: 0 },
  { id: 5, title: 'Machine Learning with Python: A Practical Approach', instructor: 'Dr. Alan Turing', thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop', duration: '18h 20m', rating: 4.9, level: 'Advanced', progress: 20 },
  { id: 6, title: 'Introduction to Cloud Computing & AWS', instructor: 'Maria Garcia', thumbnail: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop', duration: '7h 10m', rating: 4.5, level: 'Beginner', progress: 5 },
  { id: 7, title: 'Advanced CSS and SASS Frameworks', instructor: 'Kevin Powell', thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop', duration: '6h 30m', rating: 4.8, level: 'Intermediate', progress: 60 },
  { id: 8, title: 'Cybersecurity Data Analysis', instructor: 'Jane Foster', thumbnail: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&h=400&fit=crop', duration: '14h 0m', rating: 4.7, level: 'Advanced', progress: 0 },
  { id: 9, title: 'Creative Coding with p5.js', instructor: 'Daniel Shiffman', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop', duration: '9h 15m', rating: 4.9, level: 'Beginner', progress: 100 },
  { id: 10, title: 'Database Optimization & Scaling PostgreSQL', instructor: 'Peter Parker', thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop', duration: '11h 45m', rating: 4.6, level: 'Advanced', progress: 30 },
  { id: 11, title: 'App Development with React Native', instructor: 'Stephen Grider', thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop', duration: '22h 0m', rating: 4.8, level: 'Intermediate', progress: 15 },
  { id: 12, title: 'Data Structures and Algorithms in Java', instructor: 'Robert Sedgewick', thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop', duration: '30h 0m', rating: 4.9, level: 'Advanced', progress: 0 },
  { id: 13, title: 'Digital Marketing & SEO Mastery', instructor: 'Chris Do', thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop', duration: '5h 0m', rating: 4.5, level: 'Beginner', progress: 75 },
  { id: 14, title: 'Game Development with Unity 3D', instructor: 'Brackeys', thumbnail: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&h=400&fit=crop', duration: '16h 20m', rating: 4.9, level: 'Intermediate', progress: 50 },
  { id: 15, title: 'Mastering Docker & Kubernetes', instructor: 'Nana Janashia', thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop', duration: '13h 40m', rating: 4.8, level: 'Advanced', progress: 10 },
  { id: 16, title: 'Introduction to Artificial Intelligence', instructor: 'Andrew Ng', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop', duration: '20h 0m', rating: 4.9, level: 'Beginner', progress: 0 }
];

export function CourseCard({ course }) {
  return (
    <Card hoverable className="course-card" padding="none">
      <div className="course-thumbnail">
        <img src={course.thumbnail} alt={course.title} />
        <div className="course-play-overlay">
          <FiPlayCircle className="play-icon" />
        </div>
        <Badge variant="secondary" className="level-badge">{course.level}</Badge>
      </div>
      
      <div className="course-content">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">by {course.instructor}</p>
        
        <div className="course-meta">
          <span className="meta-item"><FiClock /> {course.duration}</span>
          <span className="meta-item star text-warning"><FiStar /> {course.rating}</span>
        </div>
        
        {course.progress > 0 ? (
          <div className="course-progress-container mt-4">
            <div className="progress-header">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm">{course.progress}%</span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-2 border-t border-glass">
            <span className="text-accent text-sm font-semibold cursor-pointer hover:underline">Start Course</span>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function Courses() {
  const [filter, setFilter] = useState('All Courses');

  const filteredCourses = MOCK_COURSES.filter(course => {
    if (filter === 'All Courses') return true;
    if (filter === 'In Progress') return course.progress > 0 && course.progress < 100;
    if (filter === 'Completed') return course.progress === 100;
    if (filter === 'Saved') return course.progress === 0;
    return true;
  });

  return (
    <div className="courses-page">
      <div className="page-header mb-8" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'end' }}>
        <div></div>
        
        <div className="filter-nav hidden sm:flex gap-4">
          <button 
            className={filter === 'All Courses' ? 'active' : ''}
            onClick={() => setFilter('All Courses')}
          >
            All Courses
          </button>
          <button 
            className={filter === 'In Progress' ? 'active' : ''}
            onClick={() => setFilter('In Progress')}
          >
            In Progress
          </button>
          <button 
            className={filter === 'Saved' ? 'active' : ''}
            onClick={() => setFilter('Saved')}
          >
            Saved
          </button>
          <button 
            className={filter === 'Completed' ? 'active' : ''}
            onClick={() => setFilter('Completed')}
          >
            Completed
          </button>
        </div>

        <div>{/* Empty column for grid centering */}</div>
      </div>

      <div className="course-grid">
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', color: '#9ca3af', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
            No courses found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
