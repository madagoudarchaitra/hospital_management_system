import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { post } from '../services/api';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await post('/auth/login', { email, password });
    setLoading(false);
    if(res.status===200 && res.data.token){ 
      localStorage.setItem('token', res.data.token); 
      nav('/'); 
    }
    else setError(res.data.message || 'Login failed. Please check your credentials.');
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shape shape-1"></div>
        <div className="login-shape shape-2"></div>
        <div className="login-shape shape-3"></div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🏥</div>
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to access your hospital management dashboard</p>
        </div>

        {error && (
          <div className="login-error">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input 
                type="email"
                className="form-input"
                placeholder="Enter your email" 
                value={email} 
                onChange={e=>setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="Enter your password" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="btn-arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>or</span>
        </div>

        <div className="login-footer">
          <Link to="/forgot" className="footer-link">
            <span className="link-icon">🔑</span>
            Forgot password?
          </Link>
          <Link to="/register" className="footer-link register-link">
            <span className="link-icon">✨</span>
            Create new account
          </Link>
        </div>

        <div className="login-info">
          <p className="info-text">💡 Demo Credentials</p>
          <p className="info-detail">Email: admin@hospital.com | Password: admin123</p>
        </div>
      </div>
    </div>
  );
}
