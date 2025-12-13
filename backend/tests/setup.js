const mongoose = require('mongoose');

beforeAll(async () => {
    // Optional: Connect to in-memory DB or test DB if needed
});

afterAll(async () => {
    await mongoose.connection.close();
});
