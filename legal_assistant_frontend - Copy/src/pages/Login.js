import { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // State for form data
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiResponse(null);

    try { 
      const response = await fetch(API_BASE_URL + '/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      setApiResponse({ success: true, message: 'Login successful! Redirecting...' });
      navigate('/home');
      
    } catch (error) {
      setApiResponse({ 
        success: false, 
        message: error.message || 'An error occurred during login'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your account</p>
        </div>
        
        {apiResponse && (
          <div className={`alert ${apiResponse.success ? 'success' : 'error'}`}>
            {apiResponse.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Email Field */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <div>
              <input
              type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'input-error' : ''}
              />
        
            </div>
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="#">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;