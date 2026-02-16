const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const Employee = require('./models/empSchema')

app.use(cors(), express.json());

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/empdetails_db';

if (!MONGODB_URI || MONGODB_URI === 'mongodb://localhost:27017/empdetails_db') {
    if (process.env.NODE_ENV === 'production') {
        console.warn("WARNING: Using local MongoDB URI in production!");
    }
}

let lastDbError = null;
let cachedDb = null;
let connectionPromise = null;

async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }

    if (!connectionPromise) {
        console.log("Starting new MongoDB connection...");
        const options = {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };
        connectionPromise = mongoose.connect(MONGODB_URI, options);
    }

    try {
        await connectionPromise;
        cachedDb = mongoose.connection;
        console.log("MongoDB connected successfully");
        lastDbError = null;
        return cachedDb;
    } catch (err) {
        console.error("CRITICAL: MongoDB connection failed:", err.message);
        lastDbError = err.message;
        connectionPromise = null; // Reset promise to allow retry
        throw err;
    }
}

// Initial connection attempt
connectToDatabase().catch(() => { });

app.get('/api/health', async (req, res) => {
    try {
        // Try to connect or check status
        const state = mongoose.connection.readyState;
        let connectionStatus = "disconnected";

        if (state === 1) connectionStatus = "connected";
        else if (state === 2) connectionStatus = "connecting";

        res.json({
            status: "ok",
            db: connectionStatus,
            dbState: state,
            error: lastDbError,
            env: process.env.NODE_ENV,
            uriPrefix: MONGODB_URI ? MONGODB_URI.split('@')[0] : "none"
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});


app.post('/api/employee', async (req, res) => {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.json(saved);

})


app.get('/api/employee', async (req, res) => {
    const getEmp = await Employee.find();
    res.json(getEmp);

})

app.get('/api/employee/:id', async (req, res) => {
    const empId = await Employee.findById(req.params.id);
    res.json(empId)
})

app.put('/api/employee/:id', async (req, res) => {
    const updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updateEmp);
})

app.delete('/api/employee/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: "deleted" })
})

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;

