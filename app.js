const express = require('express');
const db = require("./models/db.js");
const app = express();
const port = 8000;

app.get("/", (req,res)=>{
res.send("Welcome to Airbnb")
})

app.listen(port,()=>{
    console.log("Server is listing on port", port);
})