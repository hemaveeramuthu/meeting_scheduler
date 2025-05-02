import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ setIsSignup }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const data = await response.json();
        login(data.email);
        navigate('/dashboard');
      } else {
        console.error('Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Welcome Back
        </h2>
        <p className="text-gray-400 mt-2">Please enter your details to sign in</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Email</label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:bg-gray-800"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 hover:bg-gray-800"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-purple-500 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
            />
            <label className="ml-2 block text-sm text-gray-300">Remember me</label>
          </div>
          <a href="#" className="text-sm font-medium text-purple-400 hover:text-purple-300">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
        >
          Sign in
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <button className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
            Google
          </button>
          <button className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
            GitHub
          </button>
          <button className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900">
            Twitter
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <span
          onClick={() => setIsSignup(true)}
          className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer"
        >
          Sign up for free
        </span>
      </p>
    </div>
  );
};

export default Login;
