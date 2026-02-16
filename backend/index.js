const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const Employee = require('./models/empSchema')

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/empdetails_db';

let lastDbError = null;

async function connectToDatabase(retryCount = 0) {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    try {
        const options = {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            family: 4,
            connectTimeoutMS: 15000
        };

        await mongoose.connect(MONGODB_URI, options);
        console.log("MongoDB connected successfully!");
        lastDbError = null;
        return mongoose.connection;
    } catch (err) {
        console.error(`Connection attempt ${retryCount + 1} failed:`, err.message);
        lastDbError = err.message;

        if (retryCount < 2) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return connectToDatabase(retryCount + 1);
        }
        throw err;
    }
}

// Initial connection attempt
connectToDatabase().catch(() => { });

app.get('/api/health', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        const states = ["disconnected", "connected", "connecting", "disconnecting"];
        res.json({
            status: "ok",
            db: states[state] || "unknown",
            error: lastDbError,
            env: process.env.NODE_ENV
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

// API Routes
app.post('/api/employee', async (req, res) => {
    try {
        await connectToDatabase();
        const newEmp = new Employee(req.body);
        const saved = await newEmp.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/employee', async (req, res) => {
    try {
        await connectToDatabase();
        const getEmp = await Employee.find();
        res.json(getEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const empId = await Employee.findById(req.params.id);
        res.json(empId)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        await Employee.findByIdAndDelete(req.params.id)
        res.json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
