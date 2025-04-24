const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./review.js');

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  image:{ 
    url:String,
    filename:String
   }, price: {
    type: Number,
    // required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  country: { type: String,
    //  required: true 
    },
    review:[{
      type:Schema.Types.ObjectId,
      ref: "Review"   // Review Model
    }],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"  // User Model
    }
});


// Post Middleware
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    const res = await Review.deleteMany({ _id: { $in: listing.review } });
    console.log(res);
    console.log("Post Middleware for Listing ");
  }

})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
