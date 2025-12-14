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
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-blue-400 relative overflow-hidden items-center justify-center">
                {/* Clouds */}
                <div className="absolute top-10 right-20 w-32 h-16 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-16 right-32 w-24 h-12 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-20 left-10 w-28 h-14 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-24 left-20 w-20 h-10 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-16 w-36 h-18 bg-white rounded-full opacity-90"></div>
                <div className="absolute bottom-24 right-28 w-28 h-14 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-32 left-12 w-32 h-16 bg-white rounded-full opacity-90"></div>

                {/* Floating Candies */}
                <div className="absolute top-32 left-1/4 w-12 h-16 bg-yellow-400 rounded-lg transform rotate-12 shadow-lg"></div>
                <div className="absolute top-48 right-1/4 w-10 h-14 bg-pink-400 rounded-lg transform -rotate-12 shadow-lg"></div>
                <div className="absolute bottom-1/3 left-16 w-14 h-10 bg-blue-300 rounded-full shadow-lg"></div>
                <div className="absolute top-1/3 right-20 w-12 h-12 bg-orange-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-48 right-32 w-10 h-16 bg-red-400 rounded-lg transform rotate-45 shadow-lg"></div>

                {/* Main Illustration Container */}
                <div className="relative z-10 flex items-center justify-center">
                    {/* Phone Mockup */}
                    <div className="relative">
                        <div className="w-64 h-96 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl border-8 border-gray-900 relative overflow-hidden">
                            {/* Phone Screen */}
                            <div className="absolute inset-2 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex flex-col items-center justify-center p-6">
                                {/* Lollipop Icon */}
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full relative">
                                            <div className="absolute inset-2 border-4 border-white rounded-full opacity-60"></div>
                                            <div className="absolute inset-4 border-4 border-white rounded-full opacity-40"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-white rounded-full"></div>
                                </div>
                                <div className="mt-8 bg-purple-600 bg-opacity-50 px-4 py-2 rounded-full">
                                    <span className="text-white text-sm font-semibold">Scan for Sweets</span>
                                </div>
                            </div>
                        </div>

                        {/* Candy Box */}
                        <div className="absolute -bottom-12 -right-16 w-32 h-24 bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl shadow-xl border-4 border-white transform rotate-12">
                            <div className="absolute inset-2 flex flex-wrap gap-1 p-2">
                                <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-red-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                            </div>
                        </div>

                        {/* Character (simplified) */}
                        <div className="absolute -left-24 top-8 flex flex-col items-center">
                            {/* Chef Hat */}
                            <div className="w-16 h-12 bg-white rounded-t-full relative">
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-full"></div>
                            </div>
                            {/* Head */}
                            <div className="w-14 h-16 bg-orange-200 rounded-full relative">
                                <div className="absolute top-4 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                                <div className="absolute top-4 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-orange-300 rounded-full"></div>
                            </div>
                            {/* Body */}
                            <div className="w-16 h-24 bg-white rounded-lg relative">
                                <div className="absolute inset-2 bg-gray-800 rounded-lg"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-gray-700 rounded-lg"></div>
                            </div>
                            {/* Legs */}
                            <div className="flex gap-2">
                                <div className="w-5 h-16 bg-gray-800 rounded-lg"></div>
                                <div className="w-5 h-16 bg-gray-800 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Checkmark bubble */}
                        <div className="absolute -top-8 left-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Sparkles */}
                <div className="absolute bottom-16 right-24 w-8 h-8 text-white opacity-80">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0l1.5 7.5L21 9l-7.5 1.5L12 18l-1.5-7.5L3 9l7.5-1.5L12 0z" />
                    </svg>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-8 sm:px-12 lg:px-16 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo */}
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span className="text-gray-800 font-semibold text-lg">Sweet Shop</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-2">
                            Holla,<br />Let's Get Sweet!
                        </h1>
                        <p className="text-gray-500 text-sm mt-4">Login to your delicious account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
                                email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="satishkr4548@gmail.com"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Remember me</span>
                            </label>
                            <button type="button" className="text-sm text-gray-500 hover:text-purple-600">
                                Forgot Password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
                        >
                            {loading ? 'Signing in...' : "Let's Dig In!"}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        New to Swet achon?{' '}
                        <Link to="/register" className="text-purple-600 font-semibold hover:text-purple-700">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-500 via-purple-400 to-blue-400 relative overflow-hidden items-center justify-center">
                {/* Clouds */}
                <div className="absolute top-10 right-20 w-32 h-16 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-16 right-32 w-24 h-12 bg-white rounded-full opacity-80"></div>
                <div className="absolute top-20 left-10 w-28 h-14 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-24 left-20 w-20 h-10 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-20 right-16 w-36 h-18 bg-white rounded-full opacity-90"></div>
                <div className="absolute bottom-24 right-28 w-28 h-14 bg-white rounded-full opacity-80"></div>
                <div className="absolute bottom-32 left-12 w-32 h-16 bg-white rounded-full opacity-90"></div>

                {/* Floating Candies */}
                <div className="absolute top-32 left-1/4 w-12 h-16 bg-yellow-400 rounded-lg transform rotate-12 shadow-lg"></div>
                <div className="absolute top-48 right-1/4 w-10 h-14 bg-pink-400 rounded-lg transform -rotate-12 shadow-lg"></div>
                <div className="absolute bottom-1/3 left-16 w-14 h-10 bg-blue-300 rounded-full shadow-lg"></div>
                <div className="absolute top-1/3 right-20 w-12 h-12 bg-orange-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-48 right-32 w-10 h-16 bg-red-400 rounded-lg transform rotate-45 shadow-lg"></div>

                {/* Main Illustration Container */}
                <div className="relative z-10 flex items-center justify-center">
                    {/* Phone Mockup */}
                    <div className="relative">
                        <div className="w-64 h-96 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl shadow-2xl border-8 border-gray-900 relative overflow-hidden">
                            {/* Phone Screen */}
                            <div className="absolute inset-2 bg-gradient-to-br from-pink-300 to-purple-400 rounded-2xl flex flex-col items-center justify-center p-6">
                                {/* Lollipop Icon */}
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full relative">
                                            <div className="absolute inset-2 border-4 border-white rounded-full opacity-60"></div>
                                            <div className="absolute inset-4 border-4 border-white rounded-full opacity-40"></div>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-2 h-16 bg-white rounded-full"></div>
                                </div>
                                <div className="mt-8 bg-purple-600 bg-opacity-50 px-4 py-2 rounded-full">
                                    <span className="text-white text-sm font-semibold">Scan for Sweets</span>
                                </div>
                            </div>
                        </div>

                        {/* Candy Box */}
                        <div className="absolute -bottom-12 -right-16 w-32 h-24 bg-gradient-to-br from-blue-300 to-blue-400 rounded-2xl shadow-xl border-4 border-white transform rotate-12">
                            <div className="absolute inset-2 flex flex-wrap gap-1 p-2">
                                <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                                <div className="w-6 h-6 bg-orange-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-red-400 rounded-full"></div>
                                <div className="w-6 h-6 bg-green-400 rounded-full"></div>
                            </div>
                        </div>

                        {/* Character (simplified) */}
                        <div className="absolute -left-24 top-8 flex flex-col items-center">
                            {/* Chef Hat */}
                            <div className="w-16 h-12 bg-white rounded-t-full relative">
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-full"></div>
                            </div>
                            {/* Head */}
                            <div className="w-14 h-16 bg-orange-200 rounded-full relative">
                                <div className="absolute top-4 left-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                                <div className="absolute top-4 right-3 w-2 h-2 bg-gray-800 rounded-full"></div>
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-orange-300 rounded-full"></div>
                            </div>
                            {/* Body */}
                            <div className="w-16 h-24 bg-white rounded-lg relative">
                                <div className="absolute inset-2 bg-gray-800 rounded-lg"></div>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-12 bg-gray-700 rounded-lg"></div>
                            </div>
                            {/* Legs */}
                            <div className="flex gap-2">
                                <div className="w-5 h-16 bg-gray-800 rounded-lg"></div>
                                <div className="w-5 h-16 bg-gray-800 rounded-lg"></div>
                            </div>
                        </div>

                        {/* Checkmark bubble */}
                        <div className="absolute -top-8 left-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Sparkles */}
                <div className="absolute bottom-16 right-24 w-8 h-8 text-white opacity-80">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0l1.5 7.5L21 9l-7.5 1.5L12 18l-1.5-7.5L3 9l7.5-1.5L12 0z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
