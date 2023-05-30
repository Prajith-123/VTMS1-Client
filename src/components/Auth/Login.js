import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name', response.data.name);
      navigate('/homepage');
    } catch (error) {
      toast.error('Invalid email or password');
    }
  };

  const containerVariants = {
    initial: {
      opacity: 0,
      y: 50,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
    },
  };

  const boxVariants = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
    },
  };

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <ToastContainer />
      <motion.div className="box box-inner" variants={boxVariants}>
        <h2>Welcome Back</h2>
        <p>Sign-in to continue</p>
        <div className="curve curve-animation"></div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>
              Password
            </label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className={`password-toggle-icon${showPassword ? ' show' : ''}`}
                onMouseEnter={() => setShowPassword(true)}
                onMouseLeave={() => setShowPassword(false)}
              >
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                />
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
          <p className="mt-3">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
          <p>
            <Link to="/recover-password">Forgot password?</Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;