import mongoose from 'mongoose';

const DB_url = process.env.DB_URL;

async function connectDB() {
    try {
        const db = await mongoose.connect(DB_url);
        console.log("Database connected");
        return db;
    } catch (err) {  // Add `err` to capture the error
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    }
}

export default connectDB;
