const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require("../models/db.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require('../Schema');
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');
const Listing = require("../models/listing.js");

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
//Review 
// Post Route
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    console.log("Listing ID:", req.params.id);
    let listing = await Listing.findById(req.params.id);
    
    // Create a new review
    const newReview = new Review(req.body.review);
    
    // Save the new review to the database
    await newReview.save();
    
    // Push the new review's ID into the listing's review array
    listing.review.push(newReview._id); // Use newReview._id to push the ObjectId
    await listing.save();
    
    // Redirect after saving
    res.redirect(`/listings/${req.params.id}`); // Redirect to the specific listing
}));
  
  // Delete Review Route 
  router.delete("/:reviewId",async(req,res)=>{
      let {id,reviewId} = req.params;
      await Listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
      await Review.findByIdAndDelete(reviewId);
      res.redirect(`/listings/${id}`);
  })


  module.exports = router;