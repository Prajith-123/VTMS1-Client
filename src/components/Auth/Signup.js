import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
            toast.success('Signup Successful', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: false,
            });

            setName('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                navigate('/login');
            }, 4000);

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error('User already exist');
            } else {
                toast.error('Error occurred during signup');
            }
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
                <h2>Create Account</h2>
                <p>Sign-up to continue</p>
                <div className="curve curve-animation"></div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label>
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        Sign up
                    </button>
                    <p className="mt-3">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default Signup;