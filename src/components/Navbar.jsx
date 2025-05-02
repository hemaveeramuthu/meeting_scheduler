import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Meeting Scheduler
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-300 hover:text-gray-100">
              View Meetings
            </Link>
            <Link to="/create" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90">
              Create Meeting
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;