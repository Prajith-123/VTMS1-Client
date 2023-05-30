import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './auth.css';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };

    const resetPassword = async () => {
        if (password !== confirmPassword) {
            // Display error message for password mismatch
            toast.error('Password and Confirm Password do not match');
            return;
        }

        const response = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        if (response.ok) {
            // Password reset successful
            setPassword('');
            setConfirmPassword('');

            // Display success message
            toast.success('Password reset successful!', {
                position: 'top-right',
                autoClose: 3000,
                progress: false,
            });

            setTimeout(() => {
                navigate('/login');
            }, 4000);

        } else {
            toast.error('The password reset link has expired. Redirecting to Password Recovery.', {
                position: 'top-right',
                autoClose: 5000,
                progress: false,
            });

            setTimeout(() => {
                navigate('/recover-password');
            }, 6000);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        resetPassword();
    };

    return (
        <div className="container start-body">
            <div className="box box-inner">
                <h2>Reset Password</h2>
                <div className="curve curve-animation"></div>
                <ToastContainer />
                <form onSubmit={handleSubmit}>
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={password}
                        className="form-control"
                        onChange={handlePasswordChange}
                    />
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        className="form-control"
                        onChange={handleConfirmPasswordChange}
                    />
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;