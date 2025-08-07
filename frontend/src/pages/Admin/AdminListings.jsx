import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminListings = () => {
  const { apiCall } = useAuth();
  const [listings, setListings] = useState({
    hotels: [],
    restaurants: [],
    transports: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hotels');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await apiCall('/api/admin/listings', 'GET');
      
      if (response.success !== false) {
        setListings({
          hotels: response.hotels || [],
          restaurants: response.restaurants || [],
          transports: response.transports || []
        });
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateListingStatus = async (type, id, status) => {
    try {
      const response = await apiCall('/api/admin/listings/status', 'PUT', {
        type,
        id,
        status
      });

      if (response.success !== false) {
        // Update local state
        setListings(prev => ({
          ...prev,
          [type + 's']: prev[type + 's'].map(item => 
            item._id === id ? { ...item, status } : item
          )
        }));
        alert('Listing status updated successfully');
      } else {
        alert(response.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error updating listing status:', error);
      alert('Error updating listing status');
    }
  };

  const deleteListing = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await apiCall(`/api/admin/listings/${type}/${id}`, 'DELETE');

      if (response.success !== false) {
        // Remove from local state
        setListings(prev => ({
          ...prev,
          [type + 's']: prev[type + 's'].filter(item => item._id !== id)
        }));
        alert('Listing deleted successfully');
      } else {
        alert(response.message || 'Error deleting listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Error deleting listing');
    }
  };

  const getFilteredListings = (data) => {
    if (filterStatus === 'all') return data;
    return data.filter(item => item.status === filterStatus);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-600';
      case 'inactive':
        return 'bg-red-100 text-red-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Listings</h1>
          <p className="text-gray-600">View and manage all business listings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-xl">
                <span className="text-2xl">🏨</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hotels</p>
                <p className="text-2xl font-bold text-gray-900">{listings.hotels.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-xl">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Restaurants</p>
                <p className="text-2xl font-bold text-gray-900">{listings.restaurants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-xl">
                <span className="text-2xl">🚗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transport</p>
                <p className="text-2xl font-bold text-gray-900">{listings.transports.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Tabs */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'hotels', name: 'Hotels', icon: '🏨' },
                  { id: 'restaurants', name: 'Restaurants', icon: '🍽️' },
                  { id: 'transports', name: 'Transport', icon: '🚗' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter by status:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Name</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Owner</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Location</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Contact</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Status</th>
                  {activeTab === 'transports' && (
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Type</th>
                  )}
                  {activeTab === 'restaurants' && (
                    <th className="text-left py-4 px-6 font-medium text-gray-600">Cuisine</th>
                  )}
                  <th className="text-left py-4 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredListings(listings[activeTab]).map((listing) => (
                  <tr key={listing._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{listing.name}</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {listing.description}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">
                          {listing.owner?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {listing.owner?.email || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-sm text-gray-900">
                          {listing.location?.city}, {listing.location?.district}
                        </div>
                        <div className="text-xs text-gray-600">
                          {listing.location?.address}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-sm text-gray-900">{listing.contact?.phone}</div>
                        <div className="text-xs text-gray-600">{listing.contact?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}>
                        {listing.status}
                      </span>
                    </td>
                    {activeTab === 'transports' && (
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">{listing.type}</span>
                      </td>
                    )}
                    {activeTab === 'restaurants' && (
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-900">
                          {listing.cuisine?.slice(0, 2).join(', ')}
                          {listing.cuisine?.length > 2 && '...'}
                        </span>
                      </td>
                    )}
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        {/* Status Toggle */}
                        <select
                          value={listing.status}
                          onChange={(e) => updateListingStatus(activeTab.slice(0, -1), listing._id, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => deleteListing(activeTab.slice(0, -1), listing._id)}
                          className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {getFilteredListings(listings[activeTab]).length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg mb-2">No {activeTab} found</div>
                <p className="text-gray-400">
                  {filterStatus !== 'all' 
                    ? `No ${activeTab} with ${filterStatus} status found.`
                    : `No ${activeTab} have been added yet.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminListings;
