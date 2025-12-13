const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// Basic health check
app.get('/', (req, res) => {
    res.send('Sweet Shop API is running...');
});

module.exports = app;
