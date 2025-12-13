import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="bg-white py-4 px-6 border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Left: Logo and Nav Pills */}
                <div className="flex items-center space-x-8">
                    <Link to="/" className="text-2xl font-display font-bold text-gray-800 tracking-tight">
                        Sweet Shop
                    </Link>

                </div>
            </div>

            {/* Right: User User Stuff */}
            <div className="flex items-center space-x-4 relative">
                {/* Admin Button (Visible only to admins) */}
                {user?.role === 'admin' && (
                    <Link
                        to="/admin"
                        className="hidden md:flex items-center px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 font-bold transition-all text-sm"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Admin Panel
                    </Link>
                )}
                {user && (
                    <div className="relative group">
                        <button className="flex items-center focus:outline-none">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-400 to-orange-400 border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 hidden group-hover:block transition-all opacity-0 group-hover:opacity-100 transform origin-top-right z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-bold text-gray-900 truncate">{user.name || 'User'}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                <p className="text-xs font-semibold text-pink-500 mt-1 uppercase tracking-wide">{user.role}</p>
                            </div>
                            <button
                                onClick={() => { logout(); navigate('/login'); }}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
                {!user && (
                    <Link to="/login" className="text-sm font-bold text-pink-600">Login</Link>
                )}
            </div>
        </div>
        </nav >
    );
};

export default Navbar;
