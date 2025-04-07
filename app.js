const express = require('express');
const db = require("./models/db.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const path = require('path');
const listing = require('./routes/listing.js');
const review = require("./routes/review.js");
const app = express();
const port = 8000;


/** == Middleware == **/
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public/css')))
app.use(express.static(path.join(__dirname, 'public/js')))

app.get("/", (req,res)=>{
res.send("Welcome to Airbnb")
})

// For Router 
app.use("/listings", listing); // Mounting the router
app.use("/listings/:id/reviews",review); // Mounting the router)

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500, message="Something went wrong"} = err; // De construct
    res.status(statuscode).render("error.ejs", {err});
    // res.status(statuscode).send(message);
})
app.listen(port,()=>{
    console.log("Server is listing on port", port);
})