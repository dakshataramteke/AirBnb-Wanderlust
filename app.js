require('dotenv').config();

const express = require('express');
const db = require("./models/db.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");
const path = require('path');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const UserRouter = require("./routes/User.js");

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

const sessionOptions = {
    secret :'AirnbSecret',
    resave: false,
  saveUninitialized: true,
  cookie:{
    expires :Date.now() + 7*24 * 60 *60 * 1000, // 7 days
    maxAge :7 *24*60*60*1000,
    httpOnly : true, // for security purposse
  }
}

app.get("/", (req,res)=>{
    res.send("Welcome to Airbnb")
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success"); 
    res.locals.errorMsg = req.flash("error");
    res.locals.curUser = req.user;
    next();
});


// For Router 
app.use("/listings", listingRouter); // Mounting the router
app.use("/listings/:id/reviews",reviewRouter); // Mounting the router
app.use("/",UserRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "Page not found"));
})
app.use((err,req,res,next)=>{
    let {statuscode=500, message="Something went wrong"} = err; 
    res.status(statuscode).render("error.ejs", {err});
    // res.status(statuscode).send(message);
})
app.listen(port,()=>{
    console.log("Server is listing on port", port);
})