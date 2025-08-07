import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    priceRange: '',
    rating: '',
    amenities: []
  });

  useEffect(() => {
    fetchHotels();
  }, [filters]);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
      if (filters.rating) queryParams.append('rating', filters.rating);
      if (filters.amenities.length > 0) queryParams.append('amenities', filters.amenities.join(','));

      const response = await fetch(`http://localhost:5000/api/hotels?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setHotels(data.hotels || []);
      } else {
        setError(data.message || 'Failed to fetch hotels');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const cities = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Anuradhapura', 'Ella', 'Sigiriya', 'Bentota'];
  const amenitiesList = ['WiFi', 'Pool', 'Restaurant', 'Spa', 'Gym', 'Parking', 'Air Conditioning', 'Room Service'];

  return (
    <div className="min-h-screen w-full" style={{background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'}}>
      {/* Hero Section */}
      <section 
        className="text-white py-24 w-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', // teal to blue
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
        }}
      >
        {/* Animated Background Pattern */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.13) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.12) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)
            `
          }}
        ></div>
        
        {/* Floating Particles */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 2px, transparent 2px),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 1px, transparent 1px),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 80px 80px, 120px 120px',
            animation: 'drift 10s linear infinite'
          }}
        ></div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8"
              style={{
                background: 'linear-gradient(45deg, #ffffff 0%, #fbbf24 50%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 0 30px rgba(255,255,255,0.5)',
                letterSpacing: '-0.02em',
                lineHeight: '1.1'
              }}
            >
              Discover Your Dream
              <br />
              <span 
                style={{
                  background: 'linear-gradient(45deg, #fbbf24 0%, #f59e0b 50%, #fbbf24 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Perfect Stay
              </span>
            </h1>
            <p 
              className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: '#f1f5f9',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontWeight: '300',
                letterSpacing: '0.01em'
              }}
            >
              Immerse yourself in luxury and comfort at Sri Lanka's most stunning hotels, 
              where every moment becomes an unforgettable memory
            </p>
            
            {/* Decorative Elements */}
            <div className="flex justify-center mt-8 mb-6">
              <div 
                style={{
                  width: '100px',
                  height: '2px',
                  background: 'linear-gradient(to right, transparent, #fbbf24, transparent)',
                  borderRadius: '1px'
                }}
              ></div>
            </div>
            
            {/* Call to Action */}
            <div className="mt-8">
              <button
                className="px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.3)';
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                }}
              >
                Start Your Journey ✨
              </button>
            </div>
          </div>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes drift {
            0% { transform: translateX(0px); }
            100% { transform: translateX(100px); }
          }
        `}</style>
      </section>

      {/* Filters Section */}
      <section 
        className="shadow-lg border-b w-full"
        style={{
          background: 'linear-gradient(to right, #ffffff, #f8fafc)',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200"
                style={{
                  background: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: '14px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200"
                style={{
                  background: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: '14px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <option value="">Any Price</option>
                <option value="budget">Budget (Under $50)</option>
                <option value="mid">Mid-range ($50-150)</option>
                <option value="luxury">Luxury ($150+)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl transition-all duration-200"
                style={{
                  background: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: '14px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <option value="">Any Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ city: '', priceRange: '', rating: '', amenities: [] })}
                className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-200"
                style={{
                  background: 'linear-gradient(to right, #f8fafc, #ffffff)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #e2e8f0, #f1f5f9)';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #f8fafc, #ffffff)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Amenities Filter */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
            <div className="flex flex-wrap gap-3">
              {amenitiesList.map(amenity => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: filters.amenities.includes(amenity) 
                      ? 'linear-gradient(to right, #667eea, #764ba2)' 
                      : 'linear-gradient(to right, #f1f5f9, #e2e8f0)',
                    color: filters.amenities.includes(amenity) ? '#ffffff' : '#374151',
                    boxShadow: filters.amenities.includes(amenity) 
                      ? '0 4px 15px rgba(102, 126, 234, 0.3)' 
                      : '0 2px 8px rgba(0,0,0,0.1)',
                    border: filters.amenities.includes(amenity) ? 'none' : '1px solid #d1d5db'
                  }}
                  onMouseEnter={(e) => {
                    if (!filters.amenities.includes(amenity)) {
                      e.target.style.background = 'linear-gradient(to right, #e2e8f0, #cbd5e1)';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!filters.amenities.includes(amenity)) {
                      e.target.style.background = 'linear-gradient(to right, #f1f5f9, #e2e8f0)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-16 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div 
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              ></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div 
                className="text-red-500 mb-6 text-lg font-semibold"
                style={{
                  background: 'linear-gradient(to right, #fef2f2, #fecaca)',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '2px solid #fca5a5'
                }}
              >
                {error}
              </div>
              <button
                onClick={fetchHotels}
                className="px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.3)';
                }}
              >
                Try Again
              </button>
            </div>
          ) : hotels.length === 0 ? (
            <div 
              className="text-center py-20"
              style={{
                background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
                borderRadius: '24px',
                border: '2px solid #cbd5e1'
              }}
            >
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No hotels found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <div 
                  key={hotel._id} 
                  className="rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-8px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={hotel.images?.[0] || '/api/placeholder/400/300'}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{
                        filter: 'brightness(1.05) contrast(1.05)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                      }}
                    />
                    
                    {/* Rating Badge */}
                    <div 
                      className="absolute top-4 right-4 px-3 py-1 rounded-full"
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <div className="flex items-center">
                        <span className="text-yellow-500 text-sm mr-1">★</span>
                        <span className="text-sm font-bold text-gray-800">{hotel.rating}</span>
                      </div>
                    </div>
                    
                    {/* Featured Badge */}
                    {hotel.featured && (
                      <div 
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
                        style={{
                          background: 'linear-gradient(to right, #dc2626, #b91c1c)',
                          boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)'
                        }}
                      >
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {hotel.address?.city}, {hotel.address?.country}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{lineHeight: '1.5'}}>
                      {hotel.description}
                    </p>
                    
                    {/* Amenities */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities?.slice(0, 3).map((amenity, index) => (
                          <span 
                            key={index} 
                            className="text-xs px-3 py-1 rounded-full font-medium"
                            style={{
                              background: 'linear-gradient(to right, #e0e7ff, #c7d2fe)',
                              color: '#3730a3',
                              border: '1px solid #a5b4fc'
                            }}
                          >
                            {amenity}
                          </span>
                        ))}
                        {hotel.amenities?.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{hotel.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span 
                          className="text-2xl font-bold"
                          style={{
                            background: 'linear-gradient(to right, #667eea, #764ba2)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}
                        >
                          ${hotel.pricePerNight}
                        </span>
                        <span className="text-gray-500 text-sm ml-1">/night</span>
                      </div>
                      <Link
                        to={`/hotels/${hotel._id}`}
                        className="px-6 py-2 text-white rounded-xl font-semibold transition-all duration-200"
                        style={{
                          background: 'linear-gradient(to right, #667eea, #764ba2)',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                          textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                        }}
                      >
                        View Details
                      </Link>
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

export default Hotels;
