import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FiMail, FiLock } from 'react-icons/fi';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import Logo from '../../components/UI/Logo';
import DarkVeil from '../../components/UI/DarkVeil';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      addToast('Welcome back!', 'success');
      
      if (!user.role) {
        navigate('/select-role');
      } else {
        navigate(user.role === 'teacher' ? '/teacher' : '/dashboard');
      }
    } catch (err) {
      addToast(err.message || 'Login failed. Please try again.', 'error');
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
            <h1>Welcome back</h1>
            <p>Log in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
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
            />
            
            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={loading}
              className="mt-4"
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
