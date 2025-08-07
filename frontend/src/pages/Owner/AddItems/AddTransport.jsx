import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AddTransport = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    transportType: '',
    vehicleModel: '',
    capacity: '',
    pricePerKm: '',
    pricePerDay: '',
    location: '',
    features: [],
    description: '',
    availability: '',
    images: []
  });

  const transportTypes = [
    'Car Rental', 'Van Rental', 'Bus Rental', 'Motorcycle Rental', 
    'Bicycle Rental', 'Taxi Service', 'Chauffeur Service', 'Tour Vehicle'
  ];

  const vehicleFeatures = [
    'Air Conditioning', 'GPS Navigation', 'WiFi', 'Music System', 
    'USB Charging', 'Insurance Included', 'Driver Included', 'Fuel Included',
    'Child Seats Available', 'Luggage Space', 'Automatic Transmission'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      console.log('Adding transport service:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('✅ Transport service added successfully!');
      setFormData({
        name: '', transportType: '', vehicleModel: '', capacity: '', 
        pricePerKm: '', pricePerDay: '', location: '', features: [], 
        description: '', availability: '', images: []
      });
    } catch (error) {
      setMessage('❌ Failed to add transport service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/owner/dashboard" className="text-blue-600 hover:text-blue-800 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">Add New Transport Service</h1>
          <p className="text-gray-600">Add your transport service to the platform</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., City Car Rental"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type *</label>
                <select 
                  name="transportType"
                  value={formData.transportType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select transport type</option>
                  {transportTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model *</label>
                <input 
                  type="text" 
                  name="vehicleModel"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Toyota Corolla, Honda Civic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Passenger Capacity *</label>
                <input 
                  type="number" 
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per KM (LKR)</label>
                <input 
                  type="number" 
                  name="pricePerKm"
                  value={formData.pricePerKm}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (LKR)</label>
                <input 
                  type="number" 
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location/Pickup Area *</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Colombo, Airport"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <input 
                  type="text" 
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  placeholder="e.g., 24/7, 6 AM - 10 PM"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Features</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {vehicleFeatures.map(feature => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your transport service, terms, conditions..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Adding Transport Service...' : 'Add Transport Service'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddTransport;
