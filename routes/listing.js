const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const db = require("../models/db.js");
const listingSchema = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const {Index, EditListing, NewListing, CreateListing,UpdateListing,DeleteListing,ShowListing} = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../CloudConfig.js");
const upload = multer({ storage });

// All Listings Data 
const validateListing = (req, res, next) => {
    console.log("Incoming request body:", req.body); // Log the incoming request body for debugging
    const { error } = listingSchema.validate(req.body);
    
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        console.log("Validation error:", msg); // Log the validation error message
        return next(new ExpressError(400, msg)); // Use next() to pass the error to the error handler
    } else {
        next(); // Proceed to the next middleware if validation passes
    }
};
//Index Route & //Create Route
router.route("/")
.get(Index)
.post(isLoggedIn,validateListing, wrapAsync, upload.single('listing[image]'),(CreateListing))


//New Route
router.get("/new", isLoggedIn, NewListing)


//Edit Route
router.get("/:id/edit",wrapAsync(EditListing))

// Update Routes
router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing= await Listing.findById(id).populate("review").populate("owner");
    if(!listing){
        req.flash("error","Listing Not Found");
        res.redirect(`/listings`);
       }
    res.render("listings/edit.ejs",{listing});
}))


router.put("/:id",isLoggedIn, isOwner, validateListing, wrapAsync(UpdateListing))

//Delete Route
router.delete("/:id",wrapAsync(DeleteListing))

//Show Route
router.get("/:id",wrapAsync(ShowListing))


module.exports = router;