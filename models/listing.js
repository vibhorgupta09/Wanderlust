const { ref } = require('joi');
const mongoose = require('mongoose');
const Review=require("./review.js");
const { type } = require('os');

const listingSchema= new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String
    },
    image:{
        url:String,
        filename:String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
          },
          coordinates: {
            type: [Number],
          }
    },
    category: [{
        type: String,
        enum: ["rooms", "iconic-cities", "mountains", "castles", "amazing-pools", "camping", "farms", "arctic"]
    }]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;