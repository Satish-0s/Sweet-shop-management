import React, { createContext, useState, useEffect, useContext } from 'react';
import { parseJwt, isTokenExpired } from '../utils/jwt';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (!isTokenExpired(token)) {
                const userData = parseJwt(token);
                // Assuming the payload has { id, email, role }
                setUser({ token, ...userData });
            } else {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const userData = parseJwt(token);
        setUser({ token, ...userData });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
