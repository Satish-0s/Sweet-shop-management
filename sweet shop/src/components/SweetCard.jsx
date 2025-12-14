import { useState } from 'react';
import api from '../api/axios';

const SweetCard = ({ sweet, onPurchase, isAdmin, onDelete, onEdit }) => {
    const [loading, setLoading] = useState(false);

    const ensureAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return false;
        }
        return true;
    };

    const hasJwtToken = () => {
        const token = localStorage.getItem('token');
        return typeof token === 'string' && token.split('.').length === 3;
    };

    const applyLocalDelta = (id, delta) => {
        const raw = localStorage.getItem('local_qty_delta');
        const map = raw ? JSON.parse(raw) : {};
        const current = Number(map?.[id] || 0);
        map[id] = current + Number(delta);
        localStorage.setItem('local_qty_delta', JSON.stringify(map));
    };

    const handlePurchase = async () => {
        if (!ensureAuthenticated()) return;
        if (!hasJwtToken()) {
            if (sweet.quantity <= 0) return;
            applyLocalDelta(sweet.id, -1);
            onPurchase?.({ id: sweet.id, delta: -1 });
            return;
        }

        setLoading(true);
        try {
            await api.post(`/sweets/${sweet.id}/purchase`);
            onPurchase?.();
        } catch (error) {
            const msg = error.response?.data?.message;
            if (msg === 'Invalid token') {
                if (sweet.quantity > 0) {
                    applyLocalDelta(sweet.id, -1);
                    onPurchase?.({ id: sweet.id, delta: -1 });
                }
                return;
            }
            alert("Purchase failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRestock = async () => {
        if (!ensureAuthenticated()) return;
        if (!isAdmin) {
            alert('Admin access required');
            return;
        }

        if (!hasJwtToken()) {
            const input = window.prompt('Enter quantity to add:', '10');
            if (input === null) return;
            const qty = Number(input);
            if (!Number.isFinite(qty) || qty <= 0) {
                alert('Please enter a valid quantity');
                return;
            }
            applyLocalDelta(sweet.id, qty);
            onPurchase?.({ id: sweet.id, delta: qty });
            return;
        }

        const input = window.prompt('Enter quantity to add:', '10');
        if (input === null) return;

        const qty = Number(input);
        if (!Number.isFinite(qty) || qty <= 0) {
            alert('Please enter a valid quantity');
            return;
        }

        setLoading(true);
        try {
            await api.post(`/sweets/${sweet.id}/restock`, { quantity: qty });
            onPurchase?.();
        } catch (error) {
            const msg = error.response?.data?.message;
            if (msg === 'Invalid token') {
                applyLocalDelta(sweet.id, qty);
                onPurchase?.({ id: sweet.id, delta: qty });
                return;
            }
            alert("Restock failed: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Mock category colors to match screenshot vibes
    const getCategoryColor = (cat) => {
        const c = cat.toLowerCase();
        if (c.includes('chocolate')) return 'bg-amber-900 text-white';
        if (c.includes('gummy')) return 'bg-emerald-500 text-white';
        if (c.includes('brittle')) return 'bg-orange-100 text-orange-800';
        if (c.includes('candy')) return 'bg-gray-200 text-gray-700';
        return 'bg-gray-200 text-gray-700';
    };

    return (
        <div className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all ${sweet.quantity === 0 ? 'opacity-75' : ''}`}>
            {/* Header Row: Name & Price */}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900 font-display">{sweet.name}</h3>
                <span className="text-xl font-bold text-pink-500">${sweet.price}</span>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getCategoryColor(sweet.category)}`}>
                    {sweet.category}
                </span>
            </div>

            {/* Image integration */}
            <div className="mb-4 h-32 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden relative">
                {sweet.image ? (
                    <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                ) : (
                    <span className="text-4xl select-none">🍬</span>
                )}
            </div>

            {/* Stock Indicator */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-4 text-sm ${sweet.quantity === 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                    {sweet.quantity} in stock
                </div>
                <div className={`w-2 h-2 rounded-full ${sweet.quantity > 10 ? 'bg-emerald-400' : sweet.quantity > 0 ? 'bg-amber-400' : 'bg-red-400'}`}></div>
            </div>

            {/* Action Row */}
            {sweet.quantity === 0 ? (
                <button disabled className="w-full py-2.5 rounded-lg bg-red-400 text-white font-bold flex items-center justify-center shadow-sm opacity-90 cursor-not-allowed">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    Out of Stock
                </button>
            ) : (
                <div className="flex space-x-2">
                    <button
                        onClick={handlePurchase}
                        disabled={loading}
                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        {loading ? '...' : 'Purchase'}
                    </button>

                    {isAdmin && (
                        <>
                            {/* Add Qty / Restock Mock Button */}
                            <button
                                onClick={handleRestock}
                                disabled={loading}
                                className="p-2.5 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors disabled:opacity-60"
                                title="Restock"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </button>
                            {/* Edit Button */}
                            <button onClick={() => onEdit(sweet)} className="p-2.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                            </button>
                            {/* Delete Button */}
                            <button onClick={() => onDelete(sweet.id)} className="p-2.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SweetCard;
