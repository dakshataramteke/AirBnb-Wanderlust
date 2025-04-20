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
    type:String,
set:(v)=> v ==="" ? "https://media.istockphoto.com/id/1550071750/photo/green-tea-tree-leaves-camellia-sinensis-in-organic-farm-sunlight-fresh-young-tender-bud.jpg?s=612x612&w=0&k=20&c=RC_xD5DY5qPH_hpqeOY1g1pM6bJgGJSssWYjVIvvoLw=": v,
default: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?cs=srgb&dl=pexels-pixabay-261102.jpg&fm=jpg"},
  price: {
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
