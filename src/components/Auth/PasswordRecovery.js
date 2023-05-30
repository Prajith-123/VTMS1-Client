import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './auth.css';
import { motion } from 'framer-motion';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/recover-password', { email });
      console.log(response.data);
      toast.success('Password recovery instructions sent to your email');
    } catch (error) {
      toast.error('Account does not exist');
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
        <h2>Password Recovery</h2>
        <div className="curve curve-animation"></div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
          <p className="mt-3">
            Create New Account <Link to="/signup">Sign up</Link>
          </p>
          <p className="mt-3">
            <Link to="/login">Back to Login</Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordRecovery;