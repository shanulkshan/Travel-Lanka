import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Hotels from './pages/Hotels/Hotels';
import Restaurants from './pages/Restaurants/Restaurants';
import Transport from './pages/Transport/Transport';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AddOwner from './pages/Admin/AddOwner';
import AdminListings from './pages/Admin/AdminListings';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import OwnerProfile from './pages/Owner/OwnerProfile';
import AddHotel from './pages/Owner/AddItems/AddHotel';
import AddRestaurant from './pages/Owner/AddItems/AddRestaurant';
import AddTransport from './pages/Owner/AddItems/AddTransport';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen min-w-full w-full h-full flex flex-col">
          <Header />
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/transport" element={<Transport />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="p-8 text-center">Profile page coming soon...</div>
                </ProtectedRoute>
              } />
              <Route path="/owner/dashboard" element={
                <ProtectedRoute>
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/owner/profile" element={
                <ProtectedRoute>
                  <OwnerProfile />
                </ProtectedRoute>
              } />
              <Route path="/owner/add-hotel" element={
                <ProtectedRoute>
                  <AddHotel />
                </ProtectedRoute>
              } />
              <Route path="/owner/add-restaurant" element={
                <ProtectedRoute>
                  <AddRestaurant />
                </ProtectedRoute>
              } />
              <Route path="/owner/add-transport" element={
                <ProtectedRoute>
                  <AddTransport />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/add-owner" element={
                <ProtectedRoute requiredRole="admin">
                  <AddOwner />
                </ProtectedRoute>
              } />
              <Route path="/admin/listings" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminListings />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
