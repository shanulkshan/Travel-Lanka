import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AddOwner = () => {
  const { apiCall } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    businessType: 'hotel',
    email: '',
    password: '',
    businessName: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await apiCall('/admin/owners', 'POST', formData);
      
      if (response.success) {
        setMessage(response.message);
        // Reset form
        setFormData({
          businessType: 'hotel',
          email: '',
          password: '',
          businessName: ''
        });
      } else {
        setMessage(`❌ ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating owner:', error);
      setMessage('❌ Failed to create owner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Add New Owner</h1>
          <p className="text-gray-600">Create a new business owner account</p>
        </div>
        
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Business Type *</label>
              <select 
                name="businessType" 
                value={formData.businessType} 
                onChange={handleInputChange} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="transport">Transport</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Business Name *</label>
              <input 
                type="text" 
                name="businessName" 
                value={formData.businessName} 
                onChange={handleInputChange} 
                required 
                placeholder="Enter business name" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Owner Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                placeholder="owner@email.com" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Password *</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                placeholder="Enter password" 
                minLength="6" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full px-4 py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Owner...' : 'Create Owner'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}
        </div>
        
        <div className="p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="mb-2 text-sm font-medium text-blue-800">📋 What happens next:</h3>
          <ul className="space-y-1 text-sm text-blue-700">
            <li>• Owner can login with the provided email and password</li>
            <li>• They will access their dashboard to complete their profile</li>
            <li>• They can then add items relevant to their business type</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddOwner;