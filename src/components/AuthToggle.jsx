import React, { useState } from 'react';
import Signup from './Signup';
import Login from './Login';

const AuthToggle = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = (value) => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsSignup(value);
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-gradient-radial from-gray-850 to-gray-900 perspective-1000 pt-20">
      <div className="w-full max-w-md mx-auto px-4">
        <div className={`relative transition-transform duration-600 preserve-3d ${
          isAnimating ? (isSignup ? 'rotate-y-180' : 'rotate-y-0') : (isSignup ? 'rotate-y-0' : 'rotate-y-180')
        }`}>
          <div className="absolute inset-0 w-full backface-hidden">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-800/50">
              <Signup setIsSignup={handleToggle} />
            </div>
          </div>

          <div className="absolute inset-0 w-full backface-hidden rotate-y-180">
            <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-gray-800/50">
              <Login setIsSignup={handleToggle} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthToggle;
