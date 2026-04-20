import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiMoreVertical } from 'react-icons/fi';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/courses/my-courses');
      setCourses(data.courses || []);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/courses/${id}`);
      addToast('Course deleted successfully', 'success');
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete course', 'error');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><div className="spinner w-8 h-8 border-accent-primary"></div></div>;
  }

  return (
    <div className="teacher-courses">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>My Courses</h1>
          <p className="text-secondary">Manage your published and draft courses.</p>
        </div>
        <Link to="/teacher/courses/new">
          <Button><FiPlus className="mr-2" /> Create Course</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card className="text-center py-16 px-4">
          <div className="w-16 h-16 bg-glass rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">📚</div>
          <h2 className="text-xl font-bold mb-2">No Courses Yet</h2>
          <p className="text-secondary mb-6 max-w-md mx-auto">You haven't created any courses. Start sharing your knowledge by creating your first course today.</p>
          <Link to="/teacher/courses/new">
            <Button>Create Your First Course</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <Card key={course._id} className="flex flex-col h-full" padding="none">
              <div className="relative h-48 w-full bg-glass">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover rounded-t-lg" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-secondary">
                    <span className="text-3xl mb-2">🖼️</span>
                    <span className="text-sm">No Thumbnail</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  {course.isPublished ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Draft</Badge>
                  )}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-4 text-sm text-secondary mb-4">
                  <span>💰 ${course.price}</span>
                  <span>👥 {course.enrolledCount || 0} Students</span>
                </div>
                
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-glass">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="px-2" title="Edit Course">
                      <FiEdit2 />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-2 text-error hover:bg-error/10 hover:text-error" onClick={() => handleDelete(course._id)} title="Delete Course">
                      <FiTrash2 />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">Manage Modules</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
