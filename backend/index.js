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

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
        lastDbError = null;
    })
    .catch(err => {
        console.error("CRITICAL: MongoDB connection failed:", err.message);
        lastDbError = err.message;
    });

app.get('/api/health', (req, res) => {
    try {
        res.json({
            status: "ok",
            db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            dbState: mongoose.connection.readyState,
            error: lastDbError,
            env: process.env.NODE_ENV,
            uriPrefix: MONGODB_URI ? MONGODB_URI.split('@')[0] : "none" // Safe check for URI mask
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

