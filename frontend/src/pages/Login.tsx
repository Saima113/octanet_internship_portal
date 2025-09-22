import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-thistle-400 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-cinnabar-400 mb-2">Welcome Back!</h2>
          <p className="text-puce-100">Sign in to your account</p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                value={form.email} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-dark_moss_green-700 rounded-lg placeholder-puce-100 focus:outline-none focus:ring-2 focus:ring-puce-300 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Password" 
                value={form.password} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-dark_moss_green-700 rounded-lg placeholder-puce-100 focus:outline-none focus:ring-2 focus:ring-puce-300 focus:border-transparent transition duration-200"
                required
              />
            </div>
            
            <button 
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-puce-400 hover:bg-cinnabar-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puce-300 transform transition duration-200 hover:scale-105"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-apricot-200  transition duration-200">
                  Create one.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;