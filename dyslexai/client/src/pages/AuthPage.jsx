import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { Eye, EyeOff, BookOpen, Brain, BarChart3, Users } from 'lucide-react';

const AuthPage = () => {
  const { isAuthenticated, login, register, isLoading } = useAuth();
  const { getReadingStyles } = useAccessibility();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    hasDyslexia: false,
  });
  const [errors, setErrors] = useState({});

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isLogin && formData.age && (formData.age < 5 || formData.age > 100)) {
      newErrors.age = 'Age must be between 5 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      email: formData.email,
      password: formData.password,
    };

    if (!isLogin) {
      submitData.name = formData.name;
      submitData.age = formData.age ? parseInt(formData.age) : undefined;
      submitData.confirmPassword = formData.confirmPassword;
      submitData.hasDyslexia = formData.hasDyslexia;
      
      const result = await register(submitData);
      if (result.success) {
        // Navigation will be handled by the auth context
      }
    } else {
      const result = await login(submitData);
      if (result.success) {
        // Navigation will be handled by the auth context
      }
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Reading Analysis',
      description: 'AI-powered analysis of your reading patterns and errors',
    },
    {
      icon: Brain,
      title: 'Personalized Exercises',
      description: 'Adaptive exercises tailored to your specific needs',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Detailed reports and insights into your improvement',
    },
    {
      icon: Users,
      title: 'Dyslexia-Friendly',
      description: 'Designed specifically for users with reading difficulties',
    },
  ];

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-primary-500 to-accent-500 flex"
      style={{ backgroundColor: getReadingStyles().backgroundColor }}
    >
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 text-white">
        <div className="max-w-md">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 
              className="text-3xl font-bold"
              style={{ 
                fontFamily: getReadingStyles().fontFamily,
                fontSize: `${parseInt(getReadingStyles().fontSize) * 1.5}px`,
                color: 'white'
              }}
            >
              DyslexAI
            </h1>
          </div>
          
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontFamily: getReadingStyles().fontFamily,
              fontSize: `${parseInt(getReadingStyles().fontSize) * 2}px`,
              lineHeight: getReadingStyles().lineHeight,
              color: 'white'
            }}
          >
            Reading made easier, one word at a time.
          </h2>
          
          <p 
            className="text-xl mb-12 text-white/90"
            style={{ 
              fontFamily: getReadingStyles().fontFamily,
              fontSize: `${parseInt(getReadingStyles().fontSize) * 1.25}px`,
              lineHeight: getReadingStyles().lineHeight,
              letterSpacing: getReadingStyles().letterSpacing,
              color: 'white'
            }}
          >
            AI-powered dyslexia and reading difficulty assistant that helps you improve your reading skills through personalized analysis and exercises.
          </p>
          
          <div className="grid grid-cols-1 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 
                      className="font-semibold mb-1"
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: getReadingStyles().fontSize,
                        color: 'white'
                      }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm text-white/80"
                      style={{ 
                        fontFamily: getReadingStyles().fontFamily,
                        fontSize: `${parseInt(getReadingStyles().fontSize) * 0.875}px`,
                        lineHeight: getReadingStyles().lineHeight,
                        letterSpacing: getReadingStyles().letterSpacing,
                        color: 'rgba(255, 255, 255, 0.8)'
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-500" />
            </div>
            <h1 
              className="text-2xl font-bold text-white"
              style={{ 
                fontFamily: getReadingStyles().fontFamily,
                fontSize: `${parseInt(getReadingStyles().fontSize) * 1.25}px`,
                color: 'white'
              }}
            >
              DyslexAI
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Tab Headers */}
            <div className="flex mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  isLogin
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-center font-medium transition-colors ${
                  !isLogin
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`input ${errors.name ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-danger-600">{errors.name}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-danger-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input pr-10 ${errors.password ? 'input-error' : ''}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-danger-600">{errors.password}</p>
                )}
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`input pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age (Optional)
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={`input ${errors.age ? 'input-error' : ''}`}
                      placeholder="Enter your age"
                      min="5"
                      max="100"
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-danger-600">{errors.age}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasDyslexia"
                      id="hasDyslexia"
                      checked={formData.hasDyslexia}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasDyslexia" className="ml-2 block text-sm text-gray-700">
                      I have dyslexia (self-assessment)
                    </label>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  isLogin ? 'Login' : 'Create Account'
                )}
              </button>
            </form>

            {/* Demo Account Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                <span className="font-medium">Demo Account:</span><br />
                Email: demo@dyslexai.com<br />
                Password: demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
