const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const db = require("../models/db.js");
const {listingSchema} = require('../Schema');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

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
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Create Route
router.post("/",validateListing, wrapAsync(async(req,res,next)=>{
    const newListings = new Listing(req.body.listing);   
    await newListings.save();
    res.redirect("listings");
}))

//Edit Route
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}))

router.put("/:id",validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`${id}`);
}))

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
   res.redirect("listings");
}))

//Show Route
router.get("/:id",wrapAsync(async(req,res)=>{
   let {id} = req.params;
   const listing= await Listing.findById(id).populate("review");
   res.render("listings/show.ejs",{listing});
}))


module.exports = router;