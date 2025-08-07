import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOwnerListings();
  }, []);

  const fetchOwnerListings = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the API endpoints might not exist yet
      // Replace this with actual API call when backend is ready
      const mockListings = [
        {
          _id: '1',
          name: 'Ocean View Hotel',
          type: 'Hotel',
          description: 'Beautiful beachfront hotel with stunning ocean views',
          images: ['/api/placeholder/400/300'],
          status: 'active'
        },
        {
          _id: '2',
          name: 'Spice Garden Restaurant',
          type: 'Restaurant',
          description: 'Authentic Sri Lankan cuisine with fresh local ingredients',
          images: ['/api/placeholder/400/300'],
          status: 'pending'
        }
      ];
      
      setTimeout(() => {
        setListings(mockListings);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 rounded-full border-t-purple-600 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Dashboard</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-purple-500 rounded-lg hover:bg-purple-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen" style={{background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'}}>
      {/* Hero Section */}
      <section className="px-4 py-8 bg-white border-b shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Welcome Message and Business Icon */}
            <div className="flex items-center">
              <div className="p-4 mr-6 bg-blue-50 rounded-xl">
                {user?.businessType === 'hotel' && (
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
                {user?.businessType === 'restaurant' && (
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                  </svg>
                )}
                {user?.businessType === 'transport' && (
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome Back!
                </h1>
                <p className="mt-1 text-gray-600">
                  {user?.businessType === 'hotel' && "Manage your hotel properties"}
                  {user?.businessType === 'restaurant' && "Manage your restaurant"}
                  {user?.businessType === 'transport' && "Manage your transport services"}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-emerald-50 rounded-xl">
                <p className="text-sm font-medium text-emerald-600">Active Listings</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {listings.filter(l => l.status === 'active').length}
                </p>
              </div>
              <div className="px-6 py-4 bg-purple-50 rounded-xl">
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-2xl font-bold text-purple-700">0</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="w-full py-16">
        <div className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Profile Section */}
          <div className="mb-12 text-center">
            <Link to="/owner/profile" className="inline-flex items-center px-6 py-3 font-semibold text-white transition-colors bg-purple-600 rounded-xl hover:bg-purple-700">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Complete Your Profile
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
            {user?.businessType === 'hotel' && (
              <Link to="/owner/add-hotel" className="p-8 transition-all duration-300 rounded-2xl" style={{background: 'linear-gradient(to bottom, #fff, #f8fafc)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'}}>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'}}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Manage Hotel</h3>
                  <p className="text-gray-600">Update your hotel details</p>
                </div>
              </Link>
            )}

            {user?.businessType === 'restaurant' && (
              <Link to="/owner/add-restaurant" className="p-8 transition-all duration-300 rounded-2xl" style={{background: 'linear-gradient(to bottom, #fff, #f8fafc)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'}}>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Manage Restaurant</h3>
                  <p className="text-gray-600">Update your menu and services</p>
                </div>
              </Link>
            )}

            {user?.businessType === 'transport' && (
              <Link to="/owner/add-transport" className="p-8 transition-all duration-300 rounded-2xl" style={{background: 'linear-gradient(to bottom, #fff, #f8fafc)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'}}>
                <div className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4zm-6-2a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">Manage Transport</h3>
                  <p className="text-gray-600">Update your transport services</p>
                </div>
              </Link>
            )}
          </div>

          {/* Your Listings */}
          <h2 className="mb-8 text-3xl font-bold text-gray-900">Your Listings</h2>
          {listings.length === 0 ? (
            <div className="py-20 text-center" style={{background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)', borderRadius: '24px', border: '2px solid #cbd5e1'}}>
              <h3 className="mb-4 text-2xl font-bold text-gray-700">No listings yet</h3>
              <p className="text-lg text-gray-500">Start by adding your first property, restaurant, or transport service!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <div key={listing._id} className="overflow-hidden transition-all duration-300 rounded-2xl" style={{background: 'linear-gradient(to bottom, #fff, #f8fafc)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'}}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={listing.images?.[0] || '/api/placeholder/400/300'} alt={listing.name} className="object-cover w-full h-full transition-transform duration-500" style={{filter: 'brightness(1.05) contrast(1.05)'}} />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {listing.status === 'active' ? 'Live' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">{listing.name}</h3>
                      <p className="flex items-center text-gray-600">{listing.type}</p>
                    </div>
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2" style={{lineHeight: '1.5'}}>{listing.description}</p>
                    <div className="flex items-center justify-between">
                      <Link to={`/owner/listings/${listing._id}/edit`} className="px-6 py-2 font-semibold text-white transition-all duration-200 rounded-xl" style={{background: 'linear-gradient(to right, #8b5cf6, #ec4899)', boxShadow: '0 4px 15px rgba(139,92,246,0.3)', textDecoration: 'none'}}>Edit</Link>
                      <Link to={`/owner/listings/${listing._id}`} className="px-6 py-2 font-semibold text-purple-500 transition-all duration-200 border border-purple-500 rounded-xl hover:bg-purple-50" style={{textDecoration: 'none'}}>View</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OwnerDashboard;