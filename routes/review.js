const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require("../models/db.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema} = require('../Schema');
const ExpressError = require("../utils/ExpressError.js");
const Review = require('../models/review.js');
const Listing = require("../models/listing.js");
const {NewReview,deleteReview} = require("../controllers/review.js");

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
router.post("/", validateReview, wrapAsync(NewReview));
  
  // Delete Review Route 
  router.delete("/:reviewId",deleteReview)


  module.exports = router;