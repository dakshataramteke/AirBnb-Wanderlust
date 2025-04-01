const express = require('express');
const db = require("./models/db.js");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const path = require('path');
const {listingSchema, reviewSchema} = require('./Schema'); //From Joi
const Review = require('./models/review.js');
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


const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",")
        console.log(msg);
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el=>el.message).join(",")
        console.log(msg);
        throw new ExpressError(400, msg);
    }
    else{
        next();
    }
}

//Index Route
app.get("/listings",async(req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

//New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create Route
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
    const newListings = new Listing(req.body.listing);   
    await newListings.save();
    res.redirect("/listings");
}))

//Edit Route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

//Review 
// Post Route
app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res,next)=>{
  let listing= await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
     listing.review.push(newReview);
    await newReview.save();
    await listing.save()
    res.redirect(`/listings`);
}))
app.put("/listings/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
   res.redirect("/listings");
}))

//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   const listing= await Listing.findById(id).populate("review");
   res.render("listings/show.ejs",{listing});
}))

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