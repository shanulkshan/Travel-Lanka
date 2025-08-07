import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const BusinessEditor = () => {
  const { user, apiCall } = useAuth();
  const [businessData, setBusinessData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('basicInfo');

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const response = await apiCall('/api/owner/business', 'GET');
      if (response.success) {
        setBusinessData(response);
        setFormData(response.business);
      } else {
        setError(response.message || 'Failed to fetch business data');
      }
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError('Failed to load business information');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: arrayValue
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiCall('/api/owner/business', 'PUT', formData);
      if (response.success) {
        alert('Business details saved successfully!');
        setBusinessData(prev => ({ ...prev, business: response.business }));
      } else {
        alert(response.message || 'Failed to save business details');
      }
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business details');
    } finally {
      setSaving(false);
    }
  };

  const getSectionStatus = (section) => {
    if (!businessData?.business?.completionProgress) return false;
    return businessData.business.completionProgress[section] || false;
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          type="text"
          value={formData.name || ''}
          disabled
          className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50"
        />
        <p className="mt-1 text-xs text-gray-500">Business name is set by admin and cannot be changed</p>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows="4"
          placeholder="Describe your business, services, and what makes you unique..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.location?.address || ''}
          onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
          placeholder="Enter your business address"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.location?.city || ''}
            onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
            placeholder="City"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            District *
          </label>
          <select
            name="district"
            value={formData.location?.district || ''}
            onChange={(e) => handleNestedInputChange('location', 'district', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select District</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kalutara">Kalutara</option>
            <option value="Kandy">Kandy</option>
            <option value="Matale">Matale</option>
            <option value="Nuwara Eliya">Nuwara Eliya</option>
            <option value="Galle">Galle</option>
            <option value="Matara">Matara</option>
            <option value="Hambantota">Hambantota</option>
            <option value="Jaffna">Jaffna</option>
            <option value="Kilinochchi">Kilinochchi</option>
            <option value="Mannar">Mannar</option>
            <option value="Vavuniya">Vavuniya</option>
            <option value="Mullaitivu">Mullaitivu</option>
            <option value="Batticaloa">Batticaloa</option>
            <option value="Ampara">Ampara</option>
            <option value="Trincomalee">Trincomalee</option>
            <option value="Kurunegala">Kurunegala</option>
            <option value="Puttalam">Puttalam</option>
            <option value="Anuradhapura">Anuradhapura</option>
            <option value="Polonnaruwa">Polonnaruwa</option>
            <option value="Badulla">Badulla</option>
            <option value="Moneragala">Moneragala</option>
            <option value="Ratnapura">Ratnapura</option>
            <option value="Kegalle">Kegalle</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Latitude (Optional)
          </label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={formData.location?.coordinates?.latitude || ''}
            onChange={(e) => handleNestedInputChange('location', 'coordinates', {
              ...formData.location?.coordinates,
              latitude: parseFloat(e.target.value) || null
            })}
            placeholder="6.9271"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Longitude (Optional)
          </label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={formData.location?.coordinates?.longitude || ''}
            onChange={(e) => handleNestedInputChange('location', 'coordinates', {
              ...formData.location?.coordinates,
              longitude: parseFloat(e.target.value) || null
            })}
            placeholder="79.8612"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.contact?.phone || ''}
          onChange={(e) => handleNestedInputChange('contact', 'phone', e.target.value)}
          placeholder="+94771234567"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email (Optional)
        </label>
        <input
          type="email"
          name="email"
          value={formData.contact?.email || ''}
          onChange={(e) => handleNestedInputChange('contact', 'email', e.target.value)}
          placeholder="business@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Website (Optional)
        </label>
        <input
          type="url"
          name="website"
          value={formData.contact?.website || ''}
          onChange={(e) => handleNestedInputChange('contact', 'website', e.target.value)}
          placeholder="https://www.yourbusiness.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  const renderBusinessSpecific = () => {
    const businessType = businessData?.owner?.businessType;

    if (businessType === 'hotel') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Star Rating *
            </label>
            <select
              name="starRating"
              value={formData.starRating || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Star Rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Check-in Time *
              </label>
              <input
                type="time"
                name="checkInTime"
                value={formData.checkInTime || '14:00'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Check-out Time *
              </label>
              <input
                type="time"
                name="checkOutTime"
                value={formData.checkOutTime || '11:00'}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={formData.amenities?.join(', ') || ''}
              onChange={(e) => handleArrayInputChange('amenities', e.target.value)}
              placeholder="WiFi, Pool, Spa, Restaurant, Bar, Gym"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );
    }

    if (businessType === 'restaurant') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Seating Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleInputChange}
              min="1"
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Price Range *
            </label>
            <select
              name="priceRange"
              value={formData.priceRange || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Price Range</option>
              <option value="Budget">Budget</option>
              <option value="Mid-range">Mid-range</option>
              <option value="Fine Dining">Fine Dining</option>
              <option value="Luxury">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Cuisine Types (comma separated) *
            </label>
            <input
              type="text"
              value={formData.cuisine?.join(', ') || ''}
              onChange={(e) => handleArrayInputChange('cuisine', e.target.value)}
              placeholder="Sri Lankan, Indian, Chinese, Italian, Seafood"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      );
    }

    if (businessType === 'transport') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Transport Type
            </label>
            <input
              type="text"
              value={formData.type || ''}
              disabled
              className="w-full px-3 py-2 text-gray-500 border border-gray-300 rounded-lg bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">Transport type is set by admin and cannot be changed</p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Service Areas (comma separated) *
            </label>
            <input
              type="text"
              value={formData.serviceArea?.map(area => `${area.city}, ${area.district}`).join('; ') || ''}
              onChange={(e) => {
                const areas = e.target.value.split(';').map(area => {
                  const [city, district] = area.split(',').map(s => s.trim());
                  return { city: city || '', district: district || '' };
                }).filter(area => area.city && area.district);
                setFormData(prev => ({ ...prev, serviceArea: areas }));
              }}
              placeholder="Colombo, Colombo; Kandy, Kandy"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">Format: City, District; City, District</p>
          </div>
        </div>
      );
    }

    return null;
  };

  const sections = [
    { id: 'basicInfo', name: 'Basic Info', icon: '📝' },
    { id: 'location', name: 'Location', icon: '📍' },
    { id: 'contact', name: 'Contact', icon: '📞' },
    { id: 'specific', name: 'Business Details', icon: '🏢' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading business editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">⚠️</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Error Loading Editor</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Edit Business Details
          </h1>
          <p className="text-gray-600">
            Complete your {businessData?.owner?.businessType} business setup
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{section.icon}</span>
                  <span className="font-medium">{section.name}</span>
                  {getSectionStatus(section.id) && (
                    <span className="ml-auto">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {sections.find(s => s.id === activeSection)?.name}
                </h2>
              </div>

              {activeSection === 'basicInfo' && renderBasicInfo()}
              {activeSection === 'location' && renderLocation()}
              {activeSection === 'contact' && renderContact()}
              {activeSection === 'specific' && renderBusinessSpecific()}

              {/* Save Button */}
              <div className="flex justify-end mt-8 space-x-4">
                <a
                  href="/owner/dashboard"
                  className="px-6 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Back to Dashboard
                </a>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessEditor;