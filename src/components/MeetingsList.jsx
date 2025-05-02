import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CalendarView from './CalendarView';

const MeetingCard = ({ meeting, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatEmails = (emails) => {
    if (!emails) return '';
    const emailList = emails.split(',');
    if (!isExpanded && emailList.length > 2) {
      return `${emailList.slice(0, 2).join(', ')} +${emailList.length - 2} more`;
    }
    return emailList.join(', ');
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        const response = await fetch(`https://meeting-scheduler-backend-cj6o.onrender.com/api/meetings/${meeting._id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          onDelete(meeting._id);
        }
      } catch (error) {
        console.error('Error deleting meeting:', error);
      }
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6 hover:transform hover:scale-[1.02] transition-all duration-300">
      <div className="flex justify-between items-start">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {meeting.title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
            {meeting.duration} mins
          </span>
          <button
            onClick={handleDelete}
            className="p-1 text-red-400 hover:text-red-300 transition-colors"
            title="Delete meeting"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center text-gray-400">
          <Calendar className="w-5 h-5 mr-2 text-purple-400" />
          <span>{new Date(meeting.date).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center text-gray-400">
          <Clock className="w-5 h-5 mr-2 text-green-400" />
          <span>{meeting.time}</span>
        </div>
        
        <div className="flex items-start text-gray-400">
          <Users className="w-5 h-5 mr-2 text-blue-400 mt-1 flex-shrink-0" />
          <div className="flex flex-col">
            <div className="break-words">
              {formatEmails(meeting.participants)}
            </div>
            {meeting.participants && meeting.participants.split(',').length > 2 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-sm text-purple-400 hover:text-purple-300 mt-1 focus:outline-none"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center text-gray-400 mt-4 pt-4 border-t border-gray-800">
          <LinkIcon className="w-5 h-5 mr-2 text-pink-400" />
          <code className="font-mono bg-gray-800/50 px-3 py-1 rounded-lg break-all">
            {meeting.description}
          </code>
        </div>
      </div>
    </div>
  );
};

const MeetingsList = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://meeting-scheduler-backend-cj6o.onrender.com/api/meetings', {
        headers: {
          'user-email': user
        }
      });
      const data = await response.json();
      setMeetings(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (deletedId) => {
    setMeetings(meetings.filter(meeting => meeting._id !== deletedId));
  };

  if (isLoading) return <div className="text-white text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-radial from-gray-850 to-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-8">
          Scheduled Meetings
        </h2>
        
        <CalendarView meetings={meetings} />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <MeetingCard 
              key={meeting._id} 
              meeting={meeting} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingsList;