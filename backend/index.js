const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const Employee = require('./models/empSchema')

app.use(cors(), express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "../frontend/dist")));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/empdetails_db';

mongoose.connect(MONGODB_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/api/employee', async (req, res) => {
    try {
        const newEmp = new Employee(req.body);
        const saved = await newEmp.save();
        res.json(saved);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/employee', async (req, res) => {
    try {
        const getEmp = await Employee.find();
        res.json(getEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/employee/:id', async (req, res) => {
    try {
        const empId = await Employee.findById(req.params.id);
        res.json(empId)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/employee/:id', async (req, res) => {
    try {
        const updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updateEmp);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/employee/:id', async (req, res) => {
    try {
        await Employee.findByIdAndDelete(req.params.id)
        res.json({ message: "deleted" })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
