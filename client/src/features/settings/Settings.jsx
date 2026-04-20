import React, { useState, useRef } from 'react';
import { FiCamera, FiUpload, FiUser } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../lib/api';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import './Settings.css';

export default function Settings() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (name === user?.name) return;

    setLoading(true);
    try {
      await updateProfile({ name });
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to Cloudinary via backend
      const uploadRes = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const avatarUrl = uploadRes.data.url;

      // 2. Save new avatar URL to user profile
      await updateProfile({ avatar: avatarUrl });
      addToast('Profile picture updated!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to upload image', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header mb-8 text-center sm:text-left">
        <h1>Account Settings</h1>
        <p className="text-secondary">Manage your profile and preferences.</p>
      </div>

      <div className="settings-grid">
        <Card className="profile-card">
          <h2 className="mb-6 border-b border-glass pb-4">Profile Information</h2>
          
          <div className="avatar-section">
            <div className="avatar-wrapper" onClick={handleAvatarClick}>
              {uploading ? (
                <div className="avatar-loading">
                  <div className="spinner"></div>
                </div>
              ) : user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="avatar-overlay">
                <FiCamera />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
            />
            
            <div className="avatar-instructions">
              <h3>Profile Picture</h3>
              <p>JPG, PNG or WebP, Max 5MB.</p>
              <Button size="sm" variant="outline" onClick={handleAvatarClick} disabled={uploading}>
                <FiUpload /> {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="profile-form mt-8">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<FiUser />}
              required
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              readOnly
              helpText="Your email cannot be changed."
            />
            
            <div className="mt-4 flex justify-end">
              <Button type="submit" isLoading={loading} disabled={name === user?.name}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
