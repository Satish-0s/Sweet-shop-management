import { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSweet, setCurrentSweet] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        image: '' // New Image Field
    });

    const fetchSweets = async () => {
        setLoading(true);
        try {
            const response = await api.get('/sweets');
            setSweets(response.data);
        } catch (error) {
            console.error("Failed to fetch sweets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sweet?")) return;
        try {
            await api.delete(`/sweets/${id}`);
            fetchSweets();
        } catch (error) {
            alert("Failed to delete sweet");
        }
    };

    const handleEdit = (sweet) => {
        setIsEditing(true);
        setCurrentSweet(sweet);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            image: sweet.image || '' // Load existing image or empty
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentSweet(null);
        setFormData({ name: '', category: '', price: '', quantity: '', image: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && currentSweet) {
                await api.put(`/sweets/${currentSweet.id}`, formData);
            } else {
                await api.post('/sweets', formData);
            }
            handleCancel(); // Reset form
            fetchSweets(); // Refresh list
        } catch (error) {
            console.error("Operation failed", error);
            alert("Failed to save sweet");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">

                        <div className="lg:col-span-4">
                            <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-6 sticky top-6 min-h-[calc(100vh-180px)] flex flex-col">
                                <div className="flex items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {isEditing ? 'Update details and save changes.' : 'Add a new sweet to the catalog.'}
                                        </p>
                                    </div>
                                    {isEditing && (
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2.5 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <input
                                            type="text"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2.5 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Price</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="price"
                                                required
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2.5 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                required
                                                value={formData.quantity}
                                                onChange={handleChange}
                                                className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2.5 focus:ring-primary focus:border-primary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input
                                            type="url"
                                            name="image"
                                            value={formData.image}
                                            onChange={handleChange}
                                            placeholder="https://example.com/sweet.jpg"
                                            className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm px-3 py-2.5 focus:ring-primary focus:border-primary"
                                        />
                                    </div>

                                    <div className="pt-2 mt-auto">
                                        <button
                                            type="submit"
                                            className="w-full bg-primary text-white py-3 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm"
                                        >
                                            {isEditing ? 'Update Sweet' : 'Add Sweet'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-base font-semibold text-gray-900">Sweets</h3>
                                        <p className="text-sm text-gray-500">Manage your inventory</p>
                                    </div>
                                    <div className="text-sm text-gray-500">{loading ? 'Loading…' : `${sweets.length} items`}</div>
                                </div>

                                <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                                    <div className="p-4 grid grid-cols-1 gap-4">
                                        {sweets.map((sweet) => (
                                            <div
                                                key={sweet.id}
                                                className="group bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                                                        {sweet.image ? (
                                                            <img
                                                                src={sweet.image}
                                                                alt={sweet.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">IMG</span>
                                                        )}
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 truncate">{sweet.name}</p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    {sweet.category}
                                                                </p>
                                                            </div>

                                                            <div className="flex items-center gap-3 shrink-0">
                                                                <button
                                                                    onClick={() => handleEdit(sweet)}
                                                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(sweet.id)}
                                                                    className="text-sm font-medium text-red-600 hover:text-red-900"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                                ${sweet.price}
                                                            </span>
                                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                                                                Qty: {sweet.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {sweets.length === 0 && !loading && (
                                            <div className="p-10 text-center text-gray-500">No sweets available.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
