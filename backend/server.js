const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'super_secret_key';

app.use(cors());
app.use(bodyParser.json());

// Mock Data
let users = [
    { email: 'admin@example.com', password: 'password', role: 'admin', name: 'Admin User' },
    { email: 'user@example.com', password: 'password', role: 'user', name: 'Regular User' }
];

let sweets = [
    { id: 1, name: 'Chocolate Truffle', category: 'Chocolate', price: 2.99, quantity: 15, image: '' },
    { id: 2, name: 'Strawberry Gummy', category: 'Gummy', price: 1.49, quantity: 30, image: '' },
    { id: 3, name: 'Vanilla Fudge', category: 'Fudge', price: 3.49, quantity: 0, image: '' }, // Out of stock
    { id: 4, name: 'Caramel Candy', category: 'Caramel', price: 1.99, quantity: 25, image: '' },
    { id: 5, name: 'Mint Chocolate', category: 'Chocolate', price: 2.49, quantity: 18, image: '' },
    { id: 6, name: 'Sour Worms', category: 'Gummy', price: 1.29, quantity: 40, image: '' },
];

let purchases = [];

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Routes

// Auth
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = { email, password, role: 'user', name }; // Default to user
    users.push(newUser);
    res.status(201).json({ message: 'User created' });
});

// Sweets
app.get('/api/sweets', (req, res) => {
    res.json(sweets);
});

app.get('/api/sweets/search', (req, res) => {
    const { name, category, minPrice, maxPrice } = req.query;
    let result = sweets;

    if (name) {
        result = result.filter(s => s.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (category) {
        result = result.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (minPrice) {
        result = result.filter(s => s.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
        result = result.filter(s => s.price <= parseFloat(maxPrice));
    }
    res.json(result);
});

// Purchase
app.post('/api/sweets/:id/purchase', verifyToken, (req, res) => {
    const id = parseInt(req.params.id);
    const sweet = sweets.find(s => s.id === id);

    if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
    if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });

    sweet.quantity -= 1;
    purchases.push({ userId: req.user.email, sweetId: id, date: new Date() });

    res.json({ message: 'Purchase successful', sweet });
});

// Admin Sweets Management
app.post('/api/sweets', verifyToken, verifyAdmin, (req, res) => {
    const { name, category, price, quantity, image } = req.body;
    const newSweet = {
        id: sweets.length ? Math.max(...sweets.map(s => s.id)) + 1 : 1,
        name,
        category,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        image: image || ''
    };
    sweets.push(newSweet);
    res.status(201).json(newSweet);
});

app.put('/api/sweets/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const index = sweets.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ message: 'Not found' });

    const { name, category, price, quantity, image } = req.body;
    sweets[index] = { ...sweets[index], name, category, price: parseFloat(price), quantity: parseInt(quantity), image: image || sweets[index].image };
    res.json(sweets[index]);
});

app.delete('/api/sweets/:id', verifyToken, verifyAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    sweets = sweets.filter(s => s.id !== id);
    res.json({ message: 'Deleted' });
});

app.listen(PORT, () => {
    console.log(`Mock Backend running on http://localhost:${PORT}`);
});
