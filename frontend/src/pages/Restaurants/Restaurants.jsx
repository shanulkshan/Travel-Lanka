import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    city: '',
    cuisine: '',
    priceRange: '',
    rating: ''
  });

  useEffect(() => {
    fetchRestaurants();
  }, [filters]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.cuisine) queryParams.append('cuisine', filters.cuisine);
      if (filters.priceRange) queryParams.append('priceRange', filters.priceRange);
      if (filters.rating) queryParams.append('rating', filters.rating);

      const response = await fetch(`http://localhost:5000/api/restaurants?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setRestaurants(data.restaurants || []);
      } else {
        setError(data.message || 'Failed to fetch restaurants');
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

  const cities = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Anuradhapura', 'Ella', 'Sigiriya', 'Bentota'];
  const cuisines = ['Sri Lankan', 'Chinese', 'Indian', 'Italian', 'Thai', 'Japanese', 'Mediterranean', 'Seafood'];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Hero Section */}
      <section className="bg-gradient-secondary text-white py-16 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Cuisine
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              From authentic Sri Lankan dishes to international flavors
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-white shadow-sm border-b w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Cuisine Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">All Cuisines</option>
                {cuisines.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Any Price</option>
                <option value="budget">Budget ($)</option>
                <option value="mid">Mid-range ($$)</option>
                <option value="fine">Fine Dining ($$$)</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({ city: '', cuisine: '', priceRange: '', rating: '' })}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section className="py-12 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="spinner w-12 h-12"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={fetchRestaurants}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : restaurants.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">No restaurants found</h3>
              <p className="text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="bg-white rounded-xl shadow-lg overflow-hidden card-hover">
                  <div className="relative h-48">
                    <img
                      src={restaurant.images?.[0] || '/api/placeholder/400/300'}
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-sm font-medium ml-1">{restaurant.rating}</span>
                      </div>
                    </div>
                    {restaurant.featured && (
                      <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                        {restaurant.cuisine}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{restaurant.name}</h3>
                      <p className="text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {restaurant.address?.city}, {restaurant.address?.country}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                    
                    {/* Opening Hours */}
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Open: {restaurant.openingHours?.open} - {restaurant.openingHours?.close}
                      </div>
                    </div>
                    
                    {/* Popular Dishes */}
                    {restaurant.popularDishes?.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.popularDishes.slice(0, 2).map((dish, index) => (
                            <span key={index} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                              {dish}
                            </span>
                          ))}
                          {restaurant.popularDishes.length > 2 && (
                            <span className="text-xs text-gray-500">+{restaurant.popularDishes.length - 2} more</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600">
                          {restaurant.priceRange === 'budget' && '$'}
                          {restaurant.priceRange === 'mid' && '$$'}
                          {restaurant.priceRange === 'fine' && '$$$'}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {restaurant.priceRange === 'budget' && 'Budget'}
                          {restaurant.priceRange === 'mid' && 'Mid-range'}
                          {restaurant.priceRange === 'fine' && 'Fine Dining'}
                        </span>
                      </div>
                      <Link
                        to={`/restaurants/${restaurant._id}`}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
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

export default Restaurants;
