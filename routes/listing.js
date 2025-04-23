const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const db = require("../models/db.js");
const {listingSchema} = require('../Schema');
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const {Index, EditListing, NewListing, CreateListing,UpdateListing,DeleteListing,ShowListing} = require("../controllers/listings.js");
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
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
//Index Route & //Create Route
router.route("/")
.get(Index)
// .post(validateListing, wrapAsync, (CreateListing))
.post(upload.single('listing[image]'),(req,res)=>{
    res.send(req.file);
})



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