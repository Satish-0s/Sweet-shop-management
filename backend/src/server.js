require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to DB only if not in test mode (though server.js is entry point)
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
