import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Decorative Side */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-rose-600 relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-pattern opacity-10"></div>
                <div className="relative z-10 text-center px-10 text-white">
                    <h1 className="text-6xl font-display font-bold mb-6">Welcome Back!</h1>
                    <p className="text-xl text-pink-100">Login to access your dashboard and satisfy your sweet cravings.</p>
                </div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold font-display text-gray-900">Sign in</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Or{' '}
                            <Link to="/register" className="font-bold text-primary hover:text-primary-hover">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-8">
                        <div className="bg-white py-6">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {error && (
                                    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700 font-medium">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                        Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all transform hover:scale-[1.02]"
                                    >
                                        {loading ? 'Signing in...' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
