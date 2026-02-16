const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const app = express();

const Employee = require('./models/empSchema')

app.use(cors(), express.json());

mongoose.connect('mongodb://localhost:27017/empdetails_db')
    .then(() => {
        console.log("mongodb connected")
    })
    .catch(err => {
        console.log("db connection error", err)
    })


app.post('/employee', async (req, res) => {
    const newEmp = new Employee(req.body);
    const saved = await newEmp.save();
    res.json(saved);

})


app.get('/employee', async (req, res) => {
    const getEmp = await Employee.find();
    res.json(getEmp);

})

app.get('/employee/:id', async (req, res) => {
    const empId = await Employee.findById(req.params.id);
    res.json(empId)
})

app.put('/employee/:id', async (req, res) => {
    const updateEmp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updateEmp);
})

app.delete('/employee/:id', async (req, res) => {
    await Employee.findByIdAndDelete(req.params.id)
    res.json({ message: "deleted" })
})

app.listen(process.env.PORT, () => {
    console.log("http://localhost:5000/employee")

})
