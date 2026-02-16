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

async function connectToDatabase(retryCount = 0) {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const clusterAddr = MONGODB_URI ? MONGODB_URI.split('@')[1]?.split('/')[0] : "unknown";
    console.log(`Connecting to cluster: ${clusterAddr} (Attempt ${retryCount + 1})`);

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
            console.log("Retrying in 2 seconds...");
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
        const clusterAddr = MONGODB_URI ? MONGODB_URI.split('@')[1]?.split('/')[0] : "none";

        res.json({
            status: "ok",
            db: states[state] || "unknown",
            dbState: state,
            dbName: mongoose.connection.name || "none",
            cluster: clusterAddr,
            error: lastDbError,
            env: process.env.NODE_ENV,
            uriPrefix: MONGODB_URI ? MONGODB_URI.substring(0, 25) + "..." : "none"
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
    try {
        await connectToDatabase();
        const newEmp = new Employee(req.body);
        const saved = await newEmp.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


app.get('/api/employee', async (req, res) => {
    try {
        await connectToDatabase();
        const getEmp = await Employee.find();
        res.json(getEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const empId = await Employee.findById(req.params.id);
        res.json(empId)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.put('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        const updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.delete('/api/employee/:id', async (req, res) => {
    try {
        await connectToDatabase();
        await Employee.findByIdAndDelete(req.params.id)
        res.json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
