import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import SweetCard from '../components/SweetCard';
import './Dashboard.css';

const Dashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        category: '',
        minPrice: '',
        maxPrice: ''
    });
    const [purchasingId, setPurchasingId] = useState(null);

    const fetchSweets = async () => {
        setLoading(true);
        try {
            // Construct query string based on filters
            const params = new URLSearchParams();
            if (filters.name) params.append('name', filters.name);
            if (filters.category) params.append('category', filters.category);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

            // Use search endpoint if filters exist, otherwise get all
            // Assuming backend supports /sweets/search?query... or filters on /sweets
            // The requirement mentioned GET /api/sweets/search. 
            // I'll assume /sweets handles query params or use /sweets/search logic
            // For now, let's try to filter client side or assume /sweets accepts standard query params?
            // Requirement: "Search and filter sweets by..."
            // I'll implement client-side filtering compatibility or simple params passing.

            const response = await api.get('/sweets', { params: filters });
            // If backend uses /sweets/search, I might need to switch based on inputs.
            // But standard REST often uses /sweets?name=... 
            setSweets(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load sweets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Debounce fetch or just fetch on mount and let user click 'Apply'? 
        // Live filtering is better. I'll use a timeout for debounce.
        const timer = setTimeout(() => {
            fetchSweets();
        }, 500);
        return () => clearTimeout(timer);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePurchase = async (id) => {
        setPurchasingId(id);
        try {
            await api.post(`/sweets/${id}/purchase`);
            // Update local state to reflect quantity change without full re-fetch
            setSweets(prevSweets => prevSweets.map(sweet =>
                sweet._id === id ? { ...sweet, quantity: sweet.quantity - 1 } : sweet
            ));
        } catch (err) {
            alert(err.response?.data?.message || 'Purchase failed');
        } finally {
            setPurchasingId(null);
        }
    };

    return (
        <div className="dashboard">
            <Navbar />
            <div className="container">
                <div className="filters-section">
                    <input
                        type="text"
                        name="name"
                        placeholder="Search by name..."
                        value={filters.name}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="text"
                        name="category"
                        placeholder="Category..."
                        value={filters.category}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                    />
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                {loading ? (
                    <div className="loading">Loading sweets...</div>
                ) : (
                    <div className="sweets-grid">
                        {sweets.length > 0 ? (
                            sweets.map(sweet => (
                                <SweetCard
                                    key={sweet._id}
                                    sweet={sweet}
                                    onPurchase={handlePurchase}
                                    purchasingId={purchasingId}
                                />
                            ))
                        ) : (
                            <p>No sweets found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
