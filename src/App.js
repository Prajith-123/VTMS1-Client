import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CustomNavbar from './components/Common/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import PasswordRecovery from './components/Auth/PasswordRecovery';
import ResetPassword from './components/Auth/ResetPassword'
import HomePage from './components/homepage';
import AddVisitor from './components/Dashboard/Visitors/AddVisitor';
import ManageRecords from './components/Dashboard/Visitors/ManageRecords';
import GenerateReport from './components/Dashboard/Reports/GenerateReport';
import SearchBar from './components/Dashboard/Search/SearchBar';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <CustomNavbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <div className= 'container mt-4'>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/recover-password" element={<PasswordRecovery />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/add-visitor" element={isAuthenticated ? <AddVisitor /> : <Navigate to="/login" />} />
          <Route path="/manage-records" element={isAuthenticated ? <ManageRecords /> : <Navigate to="/login" />} />
          <Route path="/generate-report" element={isAuthenticated ? <GenerateReport /> : <Navigate to="/login" />} />
          <Route path="/search" element={isAuthenticated ? <SearchBar /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;