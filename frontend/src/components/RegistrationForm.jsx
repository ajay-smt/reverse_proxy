import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Calendar, MapPin, Loader2, UserPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api/users';

/**
 * Modern User Registration Form Component
 * @param {Object} props
 * @param {function} props.showToast - Trigger toast notifications
 * @param {function} props.onSuccess - Callback after successful registration
 */
export default function RegistrationForm({ showToast, onSuccess }) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
  });

  // Validation / Loading States
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Form Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-Side Validation
  const validateForm = () => {
    const tempErrors = {};
    
    // Full Name Check
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      tempErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email Check
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      tempErrors.email = 'Please enter a valid email address';
    }

    // Phone Check
    const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      tempErrors.phone = 'Please enter a valid phone number';
    }

    // Age Check
    const ageNum = Number(formData.age);
    if (!formData.age) {
      tempErrors.age = 'Age is required';
    } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      tempErrors.age = 'Age must be a valid number between 1 and 120';
    }

    // City Check
    if (!formData.city.trim()) {
      tempErrors.city = 'City is required';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: formData.age,
        city: formData.city.trim(),
      });

      if (response.data.success) {
        showToast(response.data.message || 'Registration successful!', 'success');
        
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          age: '',
          city: '',
        });
        
        // Call success callback to switch tabs or refresh list
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      const errorMsg = error.response?.data?.message || 'Server error. Please try again.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="glass-panel p-8 rounded-3xl glow-indigo relative overflow-hidden transition-all duration-300">
        
        {/* Card Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-400 mt-2 text-sm">
            Fill in the details below to complete your registration
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="fullName" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm glass-input ${
                  errors.fullName ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/30' : ''
                }`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <span className="text-rose-400 text-xs font-medium pl-1 block animate-pulse">
                {errors.fullName}
              </span>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm glass-input ${
                  errors.email ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/30' : ''
                }`}
                placeholder="johndoe@example.com"
              />
            </div>
            {errors.email && (
              <span className="text-rose-400 text-xs font-medium pl-1 block animate-pulse">
                {errors.email}
              </span>
            )}
          </div>

          {/* Grid Layout for Phone & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Phone Number */}
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input ${
                    errors.phone ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/30' : ''
                  }`}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.phone && (
                <span className="text-rose-400 text-xs font-medium pl-1 block animate-pulse">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Age */}
            <div className="space-y-1.5">
              <label htmlFor="age" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Age
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm glass-input ${
                    errors.age ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/30' : ''
                  }`}
                  placeholder="25"
                  min="1"
                  max="120"
                />
              </div>
              {errors.age && (
                <span className="text-rose-400 text-xs font-medium pl-1 block animate-pulse">
                  {errors.age}
                </span>
              )}
            </div>

          </div>

          {/* City */}
          <div className="space-y-1.5">
            <label htmlFor="city" className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              City
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-5 h-5" />
              </span>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm glass-input ${
                  errors.city ? 'border-rose-500/50 focus:border-rose-500/70 focus:ring-1 focus:ring-rose-500/30' : ''
                }`}
                placeholder="New York"
              />
            </div>
            {errors.city && (
              <span className="text-rose-400 text-xs font-medium pl-1 block animate-pulse">
                {errors.city}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="submit-btn"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Registering Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
