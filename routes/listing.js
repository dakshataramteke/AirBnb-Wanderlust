const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const db = require("../models/db.js");
const {listingSchema} = require('../Schema');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middleware.js");

// All Listings Data 
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
//Index Route
router.get("/",async(req,res)=>{
   const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings});
})

//New Route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    res.render("listings/new.ejs");
})

//Create Route
router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
    const newListings = new Listing(req.body.listing);  
    newListings.owner = req.user._id; 
    console.log(req.user);
    await newListings.save();
    req.flash("success","New Listing Created !");
    res.redirect("listings");
}))

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async(req,res)=>{
    
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated !");
    res.redirect(`${id}`);
}))

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted !");
   res.redirect("listings");
}))

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   const listing= await Listing.findById(id).populate("review").populate("owner");
//    console.log(listing);
   if(!listing){
    req.flash("error","Listing Not Found");
    res.redirect(`/listings`);
   }
   res.render("listings/show.ejs",{listing});
}))


module.exports = router;