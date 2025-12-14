import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const form = e.currentTarget;
        const data = new FormData(form);
        const submittedEmail = String(data.get('email') || '').trim();
        const submittedPassword = String(data.get('password') || '');
        setEmail(submittedEmail);
        setPassword(submittedPassword);

        // Basic validation
        if (!submittedEmail || !submittedPassword) {
            setError('Please enter both email and password');
            return;
        }

        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(submittedEmail)) {
            setError('Please enter a valid email address (e.g., name@gmail.com)');
            return;
        }

        setLoading(true);

        try {
            await login(submittedEmail, submittedPassword);
            navigate('/');
        } catch (err) {
            // Check for specific error messages from the API
            let errorMessage = err?.response?.data?.message;

            // Fallback if no specific server message
            if (!errorMessage) {
                if (err?.message === 'Request failed with status code 401' || err?.response?.status === 401) {
                    errorMessage = 'Invalid email or password';
                } else {
                    errorMessage = err?.message || 'Login failed. Please try again.';
                }
            }

            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome to Sweet Land 🍬
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Login to enjoy your favorite sweets
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                defaultValue={email}
                                placeholder="satish@gmail.com"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                defaultValue={password}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500"
                            />
                        </div>

                        {/* Remember Me */}
                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-sm text-pink-600"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-600">
                        New here?{' '}
                        <Link
                            to="/register"
                            className="text-pink-600 font-medium"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-pink-100 items-center justify-center">
                <span className="text-6xl">🍰</span>
            </div>
        </div>
    );
};

export default LoginPage;
