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
        type: String,
        default:"https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc",
        set: (v) => v===""? "https://unsplash.com/photos/gray-wooden-house-178j8tJrNlc": v,
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
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if (listing) {
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;