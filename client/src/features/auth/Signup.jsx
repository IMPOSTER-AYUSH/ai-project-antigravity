import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Logo from '../../components/UI/Logo';
import DarkVeil from '../../components/UI/DarkVeil';
import './Auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      addToast('Account created successfully!', 'success');
      navigate('/select-role');
    } catch (err) {
      addToast(err.message || 'Signup failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          scanlineIntensity={0}
          speed={0.5}
          scanlineFrequency={0}
          warpAmount={0}
        />
      </div>
      
      <div className="auth-container">
        <div className="auth-header">
          <Link to="/" className="brand-logo">
            <Logo size={40} />
            <span className="brand-text">Human AI</span>
          </Link>
        </div>

        <Card className="auth-card animate-fadeInUp">
          <div className="auth-title-wrapper">
            <h1>Create an account</h1>
            <p>Join Human AI and start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<FiUser />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<FiMail />}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<FiLock />}
              required
              minLength={6}
            />

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={loading}
              className="mt-4"
            >
              Sign Up
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
