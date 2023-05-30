import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import './Navbar.css';

const CustomNavbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState('');

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const user = localStorage.getItem('name');
    setLoggedInUser(user);
  }, [location]);

  const hideNavbar = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/recover-password' || location.pathname.includes('/reset-password');

  useEffect(() => {
    if (hideNavbar) {
      document.body.style.background = 'repeating-linear-gradient(45deg, #ffe47a, #ff8eb4)';
      document.body.style.animation = 'gradientAnimation infinite alternate';
    } else {
      document.body.style.background = 'linear-gradient(45deg, #fdff, #fff)';
    }
  }, [hideNavbar]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    // localStorage.removeItem('token');
    window.location.href = '/login';
  }

  if (hideNavbar) {
    return null;
  }

  const getUsername = () => {
    const fullName = loggedInUser;
    const names = fullName.split(' ');
    const username = names[0].toUpperCase();
    return username;
  };

  return (
    <Navbar expand="lg" bg="light" variant="light">
      <Navbar.Toggle onClick={handleToggleMenu} aria-controls="navbarNav" />
      <Navbar.Brand >
        <span className="user-circle">{getUsername().charAt(0)}</span>
        <span className="navbar-brand">{getUsername()}</span>
      </Navbar.Brand>
      <Navbar.Collapse id="navbarNav" className={`justify-content-end ${showMenu ? 'show' : ''}`}>
        <Nav>
          <Nav.Link as={Link} to="/homepage" className="nav-link">
            Dashboard
          </Nav.Link>
          <Nav.Link as={Link} to="/add-visitor" className="nav-link">
            Add Visitor
          </Nav.Link>
          <Nav.Link as={Link} to="/manage-records" className="nav-link">
            Manage Records
          </Nav.Link>
          <Nav.Link as={Link} to="/generate-report" className="nav-link">
            Generate Report
          </Nav.Link>
          <Nav.Link as={Link} to="/search" className="nav-link">
            Search
          </Nav.Link>
          <Button variant="outline-primary" onClick={handleLogout} className="logout-button">
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar >
  );
};

export default CustomNavbar;