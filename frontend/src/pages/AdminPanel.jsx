import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import './AdminPanel.css';

const AdminPanel = () => {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '' // Assuming description exists or optional
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');

    const fetchSweets = async () => {
        try {
            const response = await api.get('/sweets');
            setSweets(response.data);
        } catch (err) {
            setError('Failed to fetch sweets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSweets();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/sweets/${editingId}`, formData);
                setSweets(sweets.map(s => s._id === editingId ? { ...s, ...formData } : s));
            } else {
                const response = await api.post('/sweets', formData);
                setSweets([...sweets, response.data]);
            }
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (sweet) => {
        setEditingId(sweet._id);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            description: sweet.description || ''
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sweet?')) return;
        try {
            await api.delete(`/sweets/${id}`);
            setSweets(sweets.filter(s => s._id !== id));
        } catch (err) {
            setError('Failed to delete sweet');
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
        setError('');
    };

    return (
        <div className="admin-panel">
            <Navbar />
            <div className="container">
                <h1>Admin Panel</h1>

                <div className="admin-grid">
                    <div className="product-form">
                        <h2>{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required step="0.01" />
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
                            </div>
                            {/* Description optional if backend supports it */}
                            <div className="form-actions">
                                <button type="submit">{editingId ? 'Update' : 'Add Sweet'}</button>
                                {editingId && <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>}
                            </div>
                        </form>
                    </div>

                    <div className="product-list">
                        <h2>Current Inventory</h2>
                        {loading ? <p>Loading...</p> : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sweets.map(sweet => (
                                        <tr key={sweet._id}>
                                            <td>{sweet.name}</td>
                                            <td>${sweet.price}</td>
                                            <td>{sweet.quantity}</td>
                                            <td>
                                                <button onClick={() => handleEdit(sweet)} className="edit-btn">Edit</button>
                                                <button onClick={() => handleDelete(sweet._id)} className="delete-btn">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
