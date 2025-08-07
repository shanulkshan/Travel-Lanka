import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Remove image loading state since we're using pure CSS gradients
  // const [imageLoaded, setImageLoaded] = useState({});
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  // Sri Lanka travel themed carousel with images
  const carouselImages = [
    {
      src: 'https://www.authenticindiatours.com/app/uploads/2022/04/Temple-of-the-Sacred-Tooth-Relic-Kandy-Sri-Lanka-min-1400x550-c-default.jpg',
      alt: 'Temple of the Tooth, Kandy',
      caption: 'Sacred Temple of the Tooth'
    },
    {
      src: 'https://www.cdn.travejar.com/storage/india_attraction_tour_image/17484963390.webp',
      alt: 'Sigiriya Rock Fortress',
      caption: 'Ancient Sigiriya Rock Fortress'
    },
    {
      src: 'https://www.lawtontravels.com/wp-content/uploads/2022/09/tea-plantation-and-st-claire-waterfall-at-sunrise-2021-08-26-19-00-33-utc.jpg',
      alt: 'Tea Plantations in Nuwara Eliya',
      caption: 'Lush Tea Plantations'
    },
    {
      src: 'https://www.reddottours.com/uploads/Blogs/a-guide-to-sri-lankas-south-coast-beaches/a-guide-to-sri-lankas-south-coast-beaches-header.jpg',
      alt: 'Beautiful Beach in Sri Lanka',
      caption: 'Pristine Tropical Beaches'
    },
    {
      src: 'https://srilankatravelpages.com/my_content/uploads/2023/12/Where-to-See-Sri-Lankan-Elephants.jpg',
      alt: 'Sri Lankan Elephants',
      caption: 'Majestic Wildlife Safari'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % carouselImages.length
      );
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [carouselImages.length]);

  // No need for image preloading since we're using CSS gradients

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % carouselImages.length
    );
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section with Image Carousel */}
      <section 
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Image Carousel Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
          {carouselImages.map((slide, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: index === currentImageIndex ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
            >
              {/* Background Image */}
              <img
                src={slide.src}
                alt={slide.alt}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              
              {/* Dark overlay for text readability */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)'
              }}></div>
            </div>
          ))}
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={goToPrevious}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div style={{
          position: 'absolute',
          bottom: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          display: 'flex',
          gap: '8px'
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                if (index !== currentImageIndex) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== currentImageIndex) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }
              }}
            />
          ))}
        </div>

        {/* Image Caption */}
        <div style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          textAlign: 'center'
        }}>
          <p style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '500',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            margin: 0
          }}>
            {carouselImages[currentImageIndex].caption}
          </p>
        </div>
        {/* Hero Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
              <span style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>Discover the Magic of</span>{' '}
              <span style={{color: '#fbbf24', textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                Sri Lanka
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.7)'}}>
              Experience the pearl of the Indian Ocean with our comprehensive travel management platform. 
              Find the best hotels, restaurants, and transport services for your perfect journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/hotels"
                className="px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg"
                style={{
                  background: 'linear-gradient(to right, #2563eb, #9333ea)',
                  color: '#fde047',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #1d4ed8, #7c3aed)';
                  e.target.style.color = '#fef08a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(to right, #2563eb, #9333ea)';
                  e.target.style.color = '#fde047';
                }}
              >
                Explore Hotels
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl text-lg font-semibold border-2 transform hover:scale-105 transition-all duration-200"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: '#374151',
                  borderColor: 'white',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Gallery Section */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore Stunning Destinations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From ancient temples to pristine beaches, discover the diverse beauty of Sri Lanka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination Cards */}
            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://www.reddottours.com/uploads/Activities/Temple-of-the-Tooth/Temple-of-the-Tooth-header.jpg"
                alt="Kandy Temple"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold text-gray-200">Kandy</h3>
                <p className="text-sm opacity-90">Cultural Capital</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://www.lovidhu.com/uploads/posts/2021/03//sigiria-sri-lanka-945x630.jpg"
                alt="Sigiriya"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold text-gray-200">Sigiriya</h3>
                <p className="text-sm opacity-90">Ancient Rock Fortress</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://us.lakpura.com/cdn/shop/files/LK951R0000-10-E_4fb5ce5e-c060-481b-9ee3-429c7a3a7b72.jpg?v=1689939550&width=3840"
                alt="Nuwara Eliya"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold text-gray-200">Nuwara Eliya</h3>
                <p className="text-sm opacity-90">Tea Country</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://www.theglobetrottergp.com/wp-content/uploads/2019/05/oDZ1LpuSxCdJQd5UhbjSA_thumb_60bb.jpg"
                alt="Tropical Beach"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold text-gray-200">Mirissa</h3>
                <p className="text-sm opacity-90">Paradise Beach</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://cdn1.i-scmp.com/sites/default/files/styles/1020x680/public/images/methode/2018/01/18/34fc6bc4-fc13-11e7-b2f7-03450b80c791_1280x720_221404.JPG?itok=c0wN2Wmx"
                alt="Elephant Safari"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Yala National Park</h3>
                <p className="text-sm opacity-90">Wildlife Safari</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <img
                src="https://do6raq9h04ex.cloudfront.net/sites/8/2021/07/galle-fort-1050x700-1.jpg"
                alt="Galle Fort"
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Galle Fort</h3>
                <p className="text-sm opacity-90">Colonial Heritage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From luxury accommodations to authentic dining and reliable transport - we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Hotels Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background: 'linear-gradient(to right, #2563eb, #9333ea)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Hotels</h3>
              <p className="text-gray-600 mb-6">
                Discover handpicked hotels from budget-friendly to luxury resorts across Sri Lanka.
              </p>
              <Link
                to="/hotels"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Browse Hotels →
              </Link>
            </div>

            {/* Restaurants Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background: 'linear-gradient(to right, #9333ea, #ec4899)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authentic Dining</h3>
              <p className="text-gray-600 mb-6">
                Savor the flavors of Sri Lankan cuisine at the best restaurants and local eateries.
              </p>
              <Link
                to="/restaurants"
                className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Find Restaurants →
              </Link>
            </div>

            {/* Transport Feature */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background: 'linear-gradient(to right, #f59e0b, #ef4444)'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reliable Transport</h3>
              <p className="text-gray-600 mb-6">
                Get around Sri Lanka safely with our trusted transport partners and rental services.
              </p>
              <Link
                to="/transport"
                className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors"
              >
                Book Transport →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Hotels</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">1000+</div>
              <div className="text-gray-600 font-medium">Restaurants</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-600 mb-2">200+</div>
              <div className="text-gray-600 font-medium">Transport Options</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Happy Travelers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust Travel Lanka for their Sri Lankan journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started Today
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
