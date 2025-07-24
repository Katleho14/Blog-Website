import React from 'react';
import { Navigate } from 'react-router-dom'; // ✅ FIXED

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('myToken');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
