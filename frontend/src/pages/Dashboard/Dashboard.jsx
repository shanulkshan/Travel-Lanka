import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, apiCall } = useAuth();
  const [stats, setStats] = useState({
    hotels: 0,
    restaurants: 0,
    transport: 0,
    bookings: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // For now, using mock data. In real app, fetch from API
      setStats({
        hotels: 25,
        restaurants: 45,
        transport: 12,
        bookings: 8,
      });
      
      setRecentActivity([
        { id: 1, type: 'booking', title: 'Hotel Booking Confirmed', time: '2 hours ago' },
        { id: 2, type: 'review', title: 'Review Added for Ocean View Resort', time: '1 day ago' },
        { id: 3, type: 'booking', title: 'Transport Booked', time: '2 days ago' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRoleBasedContent = () => {
    switch (user?.role) {
      case 'admin':
        return {
          title: 'Admin Dashboard',
          description: 'Manage the entire Travel Lanka platform',
          actions: [
            { title: 'Add New Owner', href: '/admin/add-owner', color: 'blue' },
            { title: 'Manage Listings', href: '/admin/listings', color: 'green' },
            { title: 'View Users', href: '/admin/users', color: 'purple' },
          ],
        };
      case 'owner':
        // Redirect owners to their specific dashboard
        window.location.href = '/owner/dashboard';
        return null;
      default:
        return {
          title: 'Travel Dashboard',
          description: 'Plan and manage your Sri Lankan adventure',
          actions: [
            { title: 'Browse Hotels', href: '/hotels', color: 'blue' },
            { title: 'Find Restaurants', href: '/restaurants', color: 'green' },
            { title: 'Book Transport', href: '/transport', color: 'purple' },
          ],
        };
    }
  };

  const roleContent = getRoleBasedContent();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600">{roleContent.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hotels</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hotels}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{stats.restaurants}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transport</p>
                <p className="text-2xl font-bold text-gray-900">{stats.transport}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bookings}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {roleContent.actions.map((action, index) => (
                  <a
                    key={index}
                    href={action.href}
                    className={`p-4 rounded-xl border-2 border-${action.color}-200 hover:border-${action.color}-400 hover:bg-${action.color}-50 transition-all duration-200 group`}
                  >
                    <h3 className={`font-semibold text-${action.color}-600 group-hover:text-${action.color}-700`}>
                      {action.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Click to get started
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <h2 className="mb-6 text-xl font-bold text-gray-900">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm font-medium text-blue-600 hover:text-blue-700">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
