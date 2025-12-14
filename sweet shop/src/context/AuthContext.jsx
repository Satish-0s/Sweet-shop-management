import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode'; // Need to install jwt-decode

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ ...decoded, token });
            } catch (error) {
                const mockUserRaw = localStorage.getItem('mock_user');
                if (mockUserRaw) {
                    try {
                        const parsed = JSON.parse(mockUserRaw);
                        setUser(parsed);
                    } catch {
                        localStorage.removeItem('mock_user');
                        localStorage.removeItem('token');
                    }
                } else {
                    console.error("Invalid token", error);
                    localStorage.removeItem('token');
                }
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            localStorage.removeItem('mock_user');
            // When switching to real backend auth, clear any local inventory deltas.
            localStorage.removeItem('local_qty_delta');
            const decoded = jwtDecode(token);
            setUser({ ...decoded, token });
            return true;
        } catch (error) {
            const status = error?.response?.status;
            const serverMessage = error?.response?.data?.message;
            const raw = localStorage.getItem('mock_users');
            let users = [];
            try {
                users = raw ? JSON.parse(raw) : [];
            } catch {
                users = [];
            }
            const found = users.find((u) => u.email === email);

            // If backend is reachable but user isn't in backend DB (401), try to sync local user into backend.
            if (status === 401 && found) {
                try {
                    await api.post('/auth/register', { name: found.name, email: found.email, password: found.password });
                } catch (e) {
                    // Ignore if already exists; otherwise bubble up
                    const msg = e?.response?.data?.message;
                    const code = e?.response?.status;
                    if (!(code === 400 && msg === 'User already exists')) {
                        throw e;
                    }
                }

                const response = await api.post('/auth/login', { email, password });
                const { token } = response.data;
                localStorage.setItem('token', token);
                localStorage.removeItem('mock_user');
                localStorage.removeItem('local_qty_delta');
                const decoded = jwtDecode(token);
                setUser({ ...decoded, token });
                return true;
            }

            const canFallbackOn401 = status === 401 && !!found;
            const shouldFallback =
                !error?.response ||
                canFallbackOn401 ||
                (status >= 500 && (!serverMessage || serverMessage === 'Server error'));

            if (!shouldFallback) {
                console.error("Login failed", error);
                throw error;
            }

            // Backend returned a generic 5xx "Server error" and we can't use local auth.
            if ((status >= 500 || !status) && (!serverMessage || serverMessage === 'Server error') && !found) {
                throw new Error('Server is unavailable. Please start the backend + MongoDB, then try again.');
            }

            if (!found || found.password !== password) {
                throw new Error('Invalid email or password');
            }
            const mockUser = { id: found.id, name: found.name, email: found.email, token: 'mock-token' };
            localStorage.setItem('token', 'mock-token');
            localStorage.setItem('mock_user', JSON.stringify(mockUser));
            setUser(mockUser);
            return true;
        }
    };

    const register = async (userData) => {
        try {
            await api.post('/auth/register', userData);
            return true;
        } catch (error) {
            const status = error?.response?.status;
            const serverMessage = error?.response?.data?.message;
            const shouldFallback = !error?.response || (status >= 500 && (!serverMessage || serverMessage === 'Server error'));
            if (!shouldFallback) {
                console.error("Registration failed", error);
                throw error;
            }

            const raw = localStorage.getItem('mock_users');
            const users = raw ? JSON.parse(raw) : [];
            const exists = users.some((u) => u.email === userData.email);
            if (exists) {
                throw new Error('Email already registered');
            }
            const newUser = {
                id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
                name: userData.name,
                email: userData.email,
                password: userData.password
            };
            users.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(users));
            return true;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('mock_user');
        setUser(null);
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
