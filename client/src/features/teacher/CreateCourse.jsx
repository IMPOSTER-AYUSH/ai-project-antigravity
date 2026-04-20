import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiImage } from 'react-icons/fi';
import api from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';

export default function CreateCourse() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: 'Development',
    difficulty: 'Beginner',
    thumbnail: '',
    isPublished: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await api.post('/upload/image', data);
      setFormData(prev => ({ ...prev, thumbnail: res.data.url }));
      addToast('Image uploaded successfully', 'success');
    } catch (err) {
      addToast('Failed to upload image. Please check your Cloudinary keys.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/courses', formData);
      addToast('Course created successfully!', 'success');
      navigate('/teacher/courses');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create course', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Create New Course</h1>
          <p className="text-secondary mt-1">Fill out the details below to initialize a new course record.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/teacher/courses')}>Cancel</Button>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            name="title"
            label="Course Title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Master React JS in 21 Days"
          />

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-glass border border-glass rounded-md p-3 text-primary focus:border-accent-primary focus:outline-none transition-colors resize-y"
              placeholder="Provide a detailed description of what students will learn..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input 
              name="price"
              label="Price (USD)"
              type="number"
              min="0"
              required
              value={formData.price}
              onChange={handleChange}
            />
            
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-glass border border-glass rounded-md p-3 text-primary focus:border-accent-primary focus:outline-none transition-colors"
              >
                <option value="Development" className="bg-bg-primary text-primary">Development</option>
                <option value="Design" className="bg-bg-primary text-primary">Design</option>
                <option value="Business" className="bg-bg-primary text-primary">Business</option>
                <option value="Marketing" className="bg-bg-primary text-primary">Marketing</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Difficulty Level</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full bg-glass border border-glass rounded-md p-3 text-primary focus:border-accent-primary focus:outline-none transition-colors"
              >
                <option value="Beginner" className="bg-bg-primary text-primary">Beginner</option>
                <option value="Intermediate" className="bg-bg-primary text-primary">Intermediate</option>
                <option value="Advanced" className="bg-bg-primary text-primary">Advanced</option>
                <option value="All Levels" className="bg-bg-primary text-primary">All Levels</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Course Thumbnail (Cloudinary)</label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                formData.thumbnail ? 'border-accent-primary bg-accent-primary/5' : 'border-glass hover:bg-glass/50'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center py-4">
                  <div className="spinner w-8 h-8 border-accent-primary mb-3"></div>
                  <p>Uploading to Cloudinary...</p>
                </div>
              ) : formData.thumbnail ? (
                <div className="flex flex-col items-center">
                  <img src={formData.thumbnail} alt="Preview" className="h-40 rounded-md object-cover mb-4" />
                  <p className="text-accent text-sm font-medium">Click to change image</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-secondary py-4">
                  <FiUploadCloud className="text-4xl mb-3" />
                  <p className="font-medium">Click to browse your files</p>
                  <p className="text-sm mt-1">Recommended: 1280x720px JPG/PNG, max 5MB</p>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          <div className="flex items-center gap-3 py-4 border-t border-glass">
            <input 
              type="checkbox" 
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 accent-accent-primary"
            />
            <label htmlFor="isPublished" className="cursor-pointer font-medium">
              Publish immediately
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={loading} size="lg">Save Course</Button>
          </div>
        </form>
      </Card>
      
      <style>{`
        .space-y-6 > * + * { margin-top: 1.5rem; }
        .hidden { display: none; }
        .border-dashed { border-style: dashed; }
        .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
        .w-full { width: 100%; }
        .p-3 { padding: 0.75rem; }
      `}</style>
    </div>
  );
}
