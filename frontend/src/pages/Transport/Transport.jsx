// ...existing code...
// Only one import block and one component definition
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Transport = () => {
  const [transports, setTransports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/transports');
      const data = await response.json();
      if (response.ok) {
        setTransports(data.transports || []);
      } else {
        setError(data.message || 'Failed to fetch transports');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full" style={{background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)'}}>
      {/* Hero Section */}
      <section className="text-white py-24 w-full relative overflow-hidden" style={{background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)'}}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8" style={{background: 'linear-gradient(45deg, #fff 0%, #43cea2 50%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 0 30px rgba(255,255,255,0.5)'}}>
              Find Your<br />
              <span style={{background: 'linear-gradient(45deg, #43cea2 0%, #185a9d 50%, #43cea2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Transport</span>
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed" style={{color: '#f1f5f9', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontWeight: '300'}}>
              Travel across Sri Lanka with reliable transport options for every journey and adventure.
            </p>
          </div>
        </div>
      </section>
      {/* Transport Grid */}
      <section className="py-16 w-full">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" style={{animation: 'spin 1s linear infinite'}}></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="text-red-500 mb-6 text-lg font-semibold" style={{background: 'linear-gradient(to right, #fef2f2, #fecaca)', padding: '20px', borderRadius: '16px', border: '2px solid #fca5a5'}}>{error}</div>
              <button onClick={fetchTransports} className="px-8 py-3 text-white rounded-xl font-semibold transition-all duration-200" style={{background: 'linear-gradient(to right, #dc2626, #b91c1c)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)'}}>Try Again</button>
            </div>
          ) : transports.length === 0 ? (
            <div className="text-center py-20" style={{background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)', borderRadius: '24px', border: '2px solid #cbd5e1'}}>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No transport options found</h3>
              <p className="text-gray-500 text-lg">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {transports.map((transport) => (
                <div key={transport._id} className="rounded-2xl overflow-hidden transition-all duration-300" style={{background: 'linear-gradient(to bottom, #fff, #f8fafc)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0'}}>
                  <div className="relative h-56 overflow-hidden">
                    <img src={transport.images?.[0] || '/api/placeholder/400/300'} alt={transport.name} className="w-full h-full object-cover transition-transform duration-500" style={{filter: 'brightness(1.05) contrast(1.05)'}} />
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{transport.name}</h3>
                      <p className="text-gray-600 flex items-center">{transport.type} - {transport.address?.city}, {transport.address?.country}</p>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2" style={{lineHeight: '1.5'}}>{transport.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold" style={{background: 'linear-gradient(to right, #43cea2, #185a9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{transport.pricePerDay ? `$${transport.pricePerDay}/day` : 'Contact for price'}</span>
                      </div>
                      <Link to={`/transport/${transport._id}`} className="px-6 py-2 text-white rounded-xl font-semibold transition-all duration-200" style={{background: 'linear-gradient(to right, #43cea2, #185a9d)', boxShadow: '0 4px 15px rgba(67,206,162,0.3)', textDecoration: 'none'}}>View Details</Link>
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

export default Transport;
//             <>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
//       {/* Transport Options */}
//       <section className="py-12 w-full">
//         <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           {loading ? (
//             <div className="flex justify-center items-center py-20">
//               <div className="spinner w-12 h-12"></div>
//             </div>
//           ) : error ? (
//             <div className="text-center py-20">
//               <div className="text-red-500 mb-4">{error}</div>
