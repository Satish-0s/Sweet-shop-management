import { useState, useEffect } from 'react';
import api from '../api/axios';
import SweetCard from '../components/SweetCard';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });

    const fetchSweets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.name) params.append('name', filters.name);

            // Basic search logic for the single search bar
            const endpoint = filters.name ? `/sweets/search` : `/sweets`;

            const response = await api.get(endpoint, { params });
            setSweets(response.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, [filters]);

    const handleSearchChange = (e) => {
        setFilters({ ...filters, name: e.target.value });
    };

    // Admin handlers (Mocking logic for now since AdminDashboard is separate, 
    // but if we want buttons to work here we need handlers)
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this sweet?")) return;
        try { await api.delete(`/sweets/${id}`); fetchSweets(); } catch (e) { alert("Error deleting"); }
    };

    const handleEdit = (sweet) => {
        // Redirect or open modal - for now just alert
        alert(`Edit ${sweet.name} - Go to Admin Dashboard for full edit`);
    };

    return (
        <div className="min-h-screen bg-[#FBF8F6] font-sans pb-20">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 font-display">Sweet Collection</h1>
                    <p className="text-gray-500 mt-1">Browse our delicious selection of sweets and treats</p>
                </div>

                {/* Search & Toolbar */}
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-3 rounded-xl border-gray-200 shadow-sm focus:ring-pink-500 focus:border-pink-500 bg-white placeholder-gray-400"
                            placeholder="Search sweets..."
                            value={filters.name}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <button className="bg-white px-6 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        Filters
                    </button>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center p-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sweets.length > 0 ? (
                            sweets.map(sweet => (
                                <SweetCard
                                    key={sweet.id}
                                    sweet={sweet}
                                    onPurchase={fetchSweets}
                                    isAdmin={isAdmin}
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                No sweets found matching your search.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
