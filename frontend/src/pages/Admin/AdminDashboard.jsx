import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, apiCall } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalRestaurants: 0,
    totalTransport: 0,
    totalBookings: 0,
    revenue: 0,
    activeUsers: 0,
    pendingApprovals: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats from API
      const statsResponse = await apiCall('/admin/dashboard/stats', 'GET');
      if (statsResponse.success !== false) {
        setStats(statsResponse);
      } else {
        // Fallback to mock data if API fails
        setStats({
          totalUsers: 1250,
          totalHotels: 85,
          totalRestaurants: 156,
          totalTransport: 42,
          totalBookings: 3890,
          revenue: 125000,
          activeUsers: 890,
          pendingApprovals: 12
        });
      }

      // Mock recent activities (can be replaced with real API later)
      setRecentActivities([
        { id: 1, type: 'user', action: 'New user registered', user: 'John Doe', time: '5 minutes ago' },
        { id: 2, type: 'hotel', action: 'Hotel listing approved', user: 'Ocean View Resort', time: '1 hour ago' },
        { id: 3, type: 'booking', action: 'Booking completed', user: 'Sarah Smith', time: '2 hours ago' },
        { id: 4, type: 'restaurant', action: 'Restaurant added', user: 'Spice Garden', time: '3 hours ago' },
        { id: 5, type: 'user', action: 'User role updated', user: 'Mike Johnson', time: '4 hours ago' }
      ]);

      // Fetch users for the users tab
      const usersResponse = await apiCall('/users', 'GET');
      if (usersResponse.success !== false) {
        setUsers(usersResponse);
      } else {
        // Fallback to mock data
        setUsers([
          { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2025-01-20' },
          { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'owner', status: 'active', joinDate: '2025-01-18' },
          { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'inactive', joinDate: '2025-01-15' }
        ]);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
      // Set fallback data on error
      setStats({
        totalUsers: 1250,
        totalHotels: 85,
        totalRestaurants: 156,
        totalTransport: 42,
        totalBookings: 3890,
        revenue: 125000,
        activeUsers: 890,
        pendingApprovals: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (userId, newStatus) => {
    try {
      // API call to update user status
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      // API call to update user role
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 spinner"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage the Travel Lanka platform and monitor system performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Listings</p>
                <p className="text-2xl font-bold text-gray-900">{(stats.totalHotels + stats.totalRestaurants + stats.totalTransport).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px space-x-8">
              {[
                { id: 'overview', name: 'Overview' },
                { id: 'users', name: 'Users' },
                { id: 'listings', name: 'Listings' },
                { id: 'reports', name: 'Reports' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start p-3 space-x-3 rounded-lg hover:bg-gray-50">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'user' ? 'bg-blue-500' :
                        activity.type === 'hotel' ? 'bg-green-500' :
                        activity.type === 'restaurant' ? 'bg-purple-500' :
                        activity.type === 'booking' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-medium text-gray-900">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Approvals</span>
                    <span className="text-sm font-medium text-red-600">{stats.pendingApprovals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hotels</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalHotels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Restaurants</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalRestaurants}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transport</span>
                    <span className="text-sm font-medium text-gray-900">{stats.totalTransport}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    to="/admin/users"
                    className="block w-full px-3 py-2 text-sm text-left text-blue-600 transition-colors rounded-lg hover:bg-blue-50"
                  >
                    Manage Users
                  </Link>
                  <Link 
                    to="/admin/add-owner"
                    className="block w-full px-3 py-2 text-sm text-left text-green-600 transition-colors rounded-lg hover:bg-green-50"
                  >
                    Add New Owner
                  </Link>
                  <Link 
                    to="/admin/listings"
                    className="block w-full px-3 py-2 text-sm text-left text-purple-600 transition-colors rounded-lg hover:bg-purple-50"
                  >
                    Manage Listings
                  </Link>
                  <button className="w-full px-3 py-2 text-sm text-left text-yellow-600 rounded-lg hover:bg-yellow-50">
                    Generate System Report
                  </button>
                  <button className="w-full px-3 py-2 text-sm text-left text-red-600 rounded-lg hover:bg-red-50">
                    View System Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <button className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600">
                  Add New User
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 font-medium text-left text-gray-600">User</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Role</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Status</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Join Date</th>
                      <th className="px-4 py-3 font-medium text-left text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded"
                          >
                            <option value="user">User</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleUserStatusChange(user.id, user.status === 'active' ? 'inactive' : 'active')}
                              className={`text-xs px-2 py-1 rounded ${
                                user.status === 'active'
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {user.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button className="px-2 py-1 text-xs text-blue-600 rounded hover:bg-blue-50">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900">Listings Management</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold text-gray-900">Hotels</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalHotels}</p>
                <p className="text-sm text-gray-600">Active listings</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold text-gray-900">Restaurants</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalRestaurants}</p>
                <p className="text-sm text-gray-600">Active listings</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold text-gray-900">Transport</h3>
                <p className="text-2xl font-bold text-purple-600">{stats.totalTransport}</p>
                <p className="text-sm text-gray-600">Active listings</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
            <h2 className="mb-6 text-xl font-bold text-gray-900">System Reports</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold text-gray-900">Monthly Revenue</h3>
                <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">This month</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="mb-2 font-semibold text-gray-900">User Growth</h3>
                <p className="text-2xl font-bold text-blue-600">+12%</p>
                <p className="text-sm text-gray-600">Compared to last month</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
