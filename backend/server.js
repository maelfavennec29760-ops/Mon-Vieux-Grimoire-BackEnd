require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connection to MongoDB successful"))
    .catch((error) => console.log("connection to MongoDB failed", error));

app.listen(4000, () => {
    console.log("Server running on port 4000 :)")
})