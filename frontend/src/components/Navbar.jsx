import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Sweet Shop</Link>
            </div>
            <div className="navbar-links">
                {user ? (
                    <>
                        <span className="welcome-msg">Welcome, {user.sub || 'User'}</span>
                        <Link to="/">Dashboard</Link>
                        {user.role === 'admin' && <Link to="/admin">Admin access</Link>}
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
