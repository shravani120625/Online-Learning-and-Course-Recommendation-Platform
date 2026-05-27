import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import Learn from './pages/Learn';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-cyber-bg">
          <Navbar />
          
          {/* Main Content Router */}
          <div className="flex-1">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/catalog" 
                element={
                  <ProtectedRoute>
                    <Catalog />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/course/:id" 
                element={
                  <ProtectedRoute>
                    <CourseDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learn/:courseId" 
                element={
                  <ProtectedRoute>
                    <Learn />
                  </ProtectedRoute>
                } 
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
