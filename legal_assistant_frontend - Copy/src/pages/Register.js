import React, { useState } from 'react';
import './Auth.css';

const Register = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    religion: '',
    kandyResident: false
  });

  // State for validation errors
  const [errors, setErrors] = useState({});
  const [apiResponse, setApiResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
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
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.religion) newErrors.religion = 'Please select a religion';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiResponse(null);

    try {
      // Prepare data for API
      const payload = {
        firstname: formData.name,
        email: formData.email,
        password: formData.password,
        religion: formData.religion,
        kandyResident: formData.kandyResident
      };
      
      const response = await fetch(API_BASE_URL + '/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setApiResponse({ success: true, message: 'Registration successful!' });
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        religion: '',
        kandyResident: false
      });
    } catch (error) {
      setApiResponse({ 
        success: false, 
        message: error.message || 'An error occurred during registration'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      
      {apiResponse && (
        <div className={`alert ${apiResponse.success ? 'success' : 'error'}`}>
          {apiResponse.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name Field */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        {/* Religion Dropdown */}
        <div className="form-group">
          <label>Religion</label>
          <select
            name="religion"
            value={formData.religion}
            onChange={handleChange}
          >
            <option value="">Select your religion</option>
            <option value="Buddhism">Buddhism</option>
            <option value="Hinduism">Hinduism</option>
            <option value="Islam">Islam</option>
            <option value="Christianity">Christianity</option>
            <option value="Other">Other</option>
          </select>
          {errors.religion && <span className="error">{errors.religion}</span>}
        </div>

        {/* Kandy Resident Checkbox */}
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="kandyResident"
              checked={formData.kandyResident}
              onChange={handleChange}
            />
            Are you a resident of Kandy?
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-btn"
        >
          {isSubmitting ? 'Registering...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default Register;