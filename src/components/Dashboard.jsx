// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Users, LogOut, UserCircle } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalMeetings: 0,
    upcomingMeetings: 0,
    totalParticipants: 0,
    meetingsByDate: [],
    durationDistribution: [],
    participantDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`https://meeting-scheduler-backend-cj6o.onrender.com/api/meetings/dashboard/${user}`, {
        headers: {
          'user-email': user
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMeetingTrendOptions = () => ({
    chart: {
      type: 'line',
      toolbar: { show: false },
      background: 'transparent',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2
      }
    },
    stroke: {
      curve: 'smooth',
      width: [5, 3],
      dashArray: [0, 5]
    },
    colors: ['#8b5cf6', '#ec4899'],
    fill: {
      type: ['gradient', 'gradient'],
      gradient: {
        shade: 'dark',
        gradientToColors: ['#6366f1', '#db2777'],
        shadeIntensity: 1,
        type: 'horizontal',
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    markers: {
      size: 4,
      colors: ['#8b5cf6', '#ec4899'],
      strokeColors: '#fff',
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3,
      xaxis: {
        lines: { show: true }
      }
    },
    xaxis: {
      categories: dashboardData.meetingsByDate.map(item => item.date),
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    yaxis: [
      {
        title: {
          text: 'Meetings',
          style: { color: '#8b5cf6' }
        },
        labels: {
          style: { colors: '#9CA3AF' }
        }
      },
      {
        opposite: true,
        title: {
          text: 'Duration (mins)',
          style: { color: '#ec4899' }
        },
        labels: {
          style: { colors: '#9CA3AF' }
        }
      }
    ],
    tooltip: {
      theme: 'dark',
      y: [{
        title: {
          formatter: value => `${value} Meetings`
        }
      }, {
        title: {
          formatter: value => `${value} mins`
        }
      }]
    },
    legend: {
      labels: {
        colors: '#9CA3AF'
      }
    },
    theme: { mode: 'dark' }
  });

  const getDurationDistOptions = () => ({
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent'
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
        distributed: true
      }
    },
    colors: COLORS,
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 3
    },
    xaxis: {
      categories: dashboardData.durationDistribution.map(item => item.duration),
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' }
      }
    },
    theme: { mode: 'dark' }
  });

  const getParticipantDistOptions = () => ({
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    colors: COLORS,
    labels: dashboardData.participantDistribution.map(item => item.name),
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: '#9CA3AF'
            }
          }
        }
      }
    },
    dataLabels: {
      style: {
        colors: ['#F9FAFB']
      }
    },
    legend: {
      labels: {
        colors: '#9CA3AF'
      }
    },
    theme: { mode: 'dark' }
  });

  return (
    <div className="min-h-screen bg-gradient-radial from-gray-850 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Meeting Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/meetings" className="text-gray-300 hover:text-gray-100 px-3 py-2 rounded-md">
                Meetings
              </Link>
              <Link to="/create" className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:opacity-90">
                Create Meeting
              </Link>
              <div className="flex items-center space-x-2 text-gray-300">
                <UserCircle className="w-8 h-8" />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center text-gray-300 hover:text-gray-100">
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6">
            <div className="flex items-center">
              <Calendar className="w-12 h-12 text-blue-500" />
              <div className="ml-4">
                <p className="text-gray-300">Total Meetings</p>
                <h3 className="text-2xl font-bold text-white">{dashboardData.totalMeetings}</h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6">
            <div className="flex items-center">
              <Clock className="w-12 h-12 text-green-500" />
              <div className="ml-4">
                <p className="text-gray-300">Upcoming Meetings</p>
                <h3 className="text-2xl font-bold text-white">{dashboardData.upcomingMeetings}</h3>
              </div>
            </div>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6">
            <div className="flex items-center">
              <Users className="w-12 h-12 text-purple-500" />
              <div className="ml-4">
                <p className="text-gray-300">Total Participants</p>
                <h3 className="text-2xl font-bold text-white">{dashboardData.totalParticipants}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meeting Trend Chart */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Meeting Trends</h3>
            <div className="h-80">
              <ReactApexChart
                options={getMeetingTrendOptions()}
                series={[
                  {
                    name: 'Number of Meetings',
                    data: dashboardData.meetingsByDate.map(item => item.meetings)
                  },
                  {
                    name: 'Average Duration',
                    data: dashboardData.meetingsByDate.map(item => 
                      item.averageDuration || 0
                    )
                  }
                ]}
                type="line"
                height="100%"
              />
            </div>
          </div>

          {/* Duration Distribution */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Duration Distribution</h3>
            <div className="h-80">
              <ReactApexChart
                options={getDurationDistOptions()}
                series={[{
                  name: 'Meetings',
                  data: dashboardData.durationDistribution.map(item => item.count)
                }]}
                type="bar"
                height="100%"
              />
            </div>
          </div>

          {/* Participant Distribution */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">Participant Distribution</h3>
            <div className="h-80">
              <ReactApexChart
                options={getParticipantDistOptions()}
                series={dashboardData.participantDistribution.map(item => item.value)}
                type="donut"
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;