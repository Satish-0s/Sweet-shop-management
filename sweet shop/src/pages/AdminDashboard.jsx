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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Form Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow sm:rounded-lg p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Name</label>
                                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <input type="text" name="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Price</label>
                                        <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                        <input type="number" name="quantity" required value={formData.quantity} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                        <input type="url" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/sweet.jpg" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-primary focus:border-primary" />
                                    </div>
                                    <div className="flex space-x-3 pt-2">
                                        <button type="submit" className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                            {isEditing ? 'Update' : 'Add'}
                                        </button>
                                        {isEditing && (
                                            <button type="button" onClick={handleCancel} className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none">
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* List Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <ul className="divide-y divide-gray-200">
                                    {sweets.map(sweet => (
                                        <li key={sweet.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                            <div>
                                                <p className="text-sm font-medium text-primary truncate">{sweet.name}</p>
                                                <div className="flex space-x-4 text-sm text-gray-500">
                                                    <span>{sweet.category}</span>
                                                    <span>${sweet.price}</span>
                                                    <span>Qty: {sweet.quantity}</span>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEdit(sweet)} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
                                                <button onClick={() => handleDelete(sweet.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
                                            </div>
                                        </li>
                                    ))}
                                    {sweets.length === 0 && !loading && (
                                        <li className="p-4 text-center text-gray-500">No sweets available.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
