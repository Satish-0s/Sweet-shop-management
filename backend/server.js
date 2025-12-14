const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');
const User = require('./models/User');
const Sweet = require('./models/Sweet');
const Purchase = require('./models/Purchase');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'super_secret_key';

// Connect to Database
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Seed Data Function
const seedData = async () => {
    try {
        // Drop legacy username index if it exists
        try {
            await User.collection.dropIndex('username_1');
            console.log('Legacy username index dropped');
        } catch (e) {
            // Ignore error if index doesn't exist
        }

        const sweets = [
            { id: 1, name: 'Chocolate Truffle', category: 'Chocolate', price: 2.99, quantity: 15, image: 'http://localhost:5173/sweets/chocolate_truffle.png' },
            { id: 2, name: 'Strawberry Gummy', category: 'Gummy', price: 1.49, quantity: 30, image: 'http://localhost:5173/sweets/strawberry_gummy.png' },
            { id: 3, name: 'Vanilla Fudge', category: 'Fudge', price: 3.49, quantity: 0, image: 'http://localhost:5173/sweets/vanilla_fudge.png' }, // Out of stock
            { id: 4, name: 'Caramel Candy', category: 'Caramel', price: 1.99, quantity: 25, image: 'http://localhost:5173/sweets/caramel_candy.png' },
            { id: 5, name: 'Mint Chocolate', category: 'Chocolate', price: 2.49, quantity: 18, image: 'http://localhost:5173/sweets/mint_chocolate.png' },
            { id: 6, name: 'Sour Worms', category: 'Gummy', price: 1.29, quantity: 40, image: 'http://localhost:5173/sweets/sour_worms.png' },
            // New items requested - Reusing images due to quota limit
            { id: 7, name: 'Dark Chocolate Bar', category: 'Chocolate', price: 3.99, quantity: 20, image: 'http://localhost:5173/sweets/chocolate_truffle.png' },
            { id: 8, name: 'Rainbow Lollipop', category: 'Candy', price: 0.99, quantity: 50, image: 'http://localhost:5173/sweets/sour_worms.png' },
            { id: 9, name: 'Assorted Jelly Beans', category: 'Gummy', price: 2.49, quantity: 35, image: 'http://localhost:5173/sweets/strawberry_gummy.png' }
        ];

        for (const sweet of sweets) {
            await Sweet.findOneAndUpdate({ id: sweet.id }, sweet, { upsert: true, new: true });
        }
        console.log('Sweets Seeded/Updated');

        // Always ensure the requested admin exists
        const adminUser = { email: 'satishkr4548@gmail.com', password: 'password1234', role: 'admin', name: 'Satish Kumar' };
        await User.findOneAndUpdate({ email: adminUser.email }, adminUser, { upsert: true, new: true });

        const usersCount = await User.countDocuments();
        if (usersCount === 0) {
            const users = [
                { email: 'user@example.com', password: 'password', role: 'user', name: 'Regular User' }
            ];
            await User.insertMany(users);
            console.log('Regular Users Seeded');
        }
        console.log('Admin User Verified');
    } catch (error) {
        console.error('Seeding Error:', error);
    }
};

// Run seeding strictly once on startup
seedData();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1] ? authHeader.split(' ')[1].trim() : null;

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });

        // Fetch fresh user data from DB to ensure role changes apply if any
        try {
            const user = await User.findOne({ email: decoded.email });
            if (!user) return res.status(404).json({ message: 'User not found' });
            req.user = user;
            next();
        } catch (e) {
            return res.status(500).json({ message: 'Server error during auth' });
        }
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
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password }); // In prod: hash passwords!
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = new User({ email, password, role: 'user', name }); // Default to user
        await newUser.save();
        res.status(201).json({ message: 'User created' });
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Sweets
// Sweets
app.get('/api/sweets', async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.json(sweets);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/sweets/search', async (req, res) => {
    const { name, category, minPrice, maxPrice } = req.query;
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    try {
        const result = await Sweet.find(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Purchase
app.post('/api/sweets/:id/purchase', verifyToken, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const sweet = await Sweet.findOne({ id });
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });
        if (sweet.quantity <= 0) return res.status(400).json({ message: 'Out of stock' });

        sweet.quantity -= 1;
        await sweet.save();

        // If authenticated user is a mock user (no MongoDB _id), skip purchase record creation.
        if (req.user && req.user._id) {
            const purchase = new Purchase({
                user_id: req.user._id,
                sweet_id: sweet.id,
                date: new Date()
            });
            await purchase.save();
        }

        res.json({ message: 'Purchase successful', sweet });
    } catch (error) {
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
});

// Admin Sweets Management

// Restock Endpoint (New Feature)
app.post('/api/sweets/:id/restock', verifyToken, verifyAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
    }

    try {
        const sweet = await Sweet.findOne({ id });
        if (!sweet) return res.status(404).json({ message: 'Sweet not found' });

        sweet.quantity += parseInt(quantity);
        await sweet.save();
        res.json({ message: 'Restock successful', sweet });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/sweets', verifyToken, verifyAdmin, async (req, res) => {
    const { name, category, price, quantity, image } = req.body;
    try {
        // Find max ID for auto-increment logic (simple implementation)
        const lastSweet = await Sweet.findOne().sort({ id: -1 });
        const nextId = lastSweet && lastSweet.id ? lastSweet.id + 1 : 1;

        const newSweet = new Sweet({
            id: nextId,
            name,
            category,
            price: parseFloat(price),
            quantity: parseInt(quantity),
            image: image || ''
        });
        await newSweet.save();
        res.status(201).json(newSweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/sweets/:id', verifyToken, verifyAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { name, category, price, quantity, image } = req.body;
    try {
        const sweet = await Sweet.findOne({ id });
        if (!sweet) return res.status(404).json({ message: 'Not found' });

        sweet.name = name;
        sweet.category = category;
        sweet.price = parseFloat(price);
        sweet.quantity = parseInt(quantity);
        if (image) sweet.image = image;

        await sweet.save();
        res.json(sweet);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/sweets/:id', verifyToken, verifyAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        await Sweet.deleteOne({ id });
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
