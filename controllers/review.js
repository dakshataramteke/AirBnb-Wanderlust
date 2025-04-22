const Review = require('../models/review.js');
const Listing = require("../models/listing.js");


const NewReview = async (req, res, next) => {
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
}

const deleteReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull :{reviews :reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}

module.exports = {NewReview,deleteReview}