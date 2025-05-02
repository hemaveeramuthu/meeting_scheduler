import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreateMeeting = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    participants: '',
    description: ''
  });

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    
    let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    
    // Handle next day meetings
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }
    
    return durationMinutes.toString();
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    if ((name === 'startTime' && formData.endTime) || 
        (name === 'endTime' && formData.startTime)) {
      updatedFormData.duration = calculateDuration(
        name === 'startTime' ? value : formData.startTime,
        name === 'endTime' ? value : formData.endTime
      );
    }
    
    setFormData(updatedFormData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://meeting-scheduler-backend-cj6o.onrender.com/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-email': user
        },
        body: JSON.stringify({
          ...formData,
          time: formData.startTime,
        }),
      });
      
      if (response.ok) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-gray-850 to-gray-900 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-800/50 p-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
            Schedule New Meeting
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-200 block">Title</label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Date</label>
              <input
                type="date"
                name="date"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-200 mb-2">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.startTime}
                  onChange={handleTimeChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-200 mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.endTime}
                  onChange={handleTimeChange}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.duration}
                readOnly
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Participants (emails)</label>
              <input
                type="text"
                name="participants"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.participants}
                onChange={handleChange}
                placeholder="Enter email addresses separated by commas"
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 mb-2">Description</label>
              <textarea
                name="description"
                className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 transition duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
            >
              Schedule Meeting
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMeeting;
