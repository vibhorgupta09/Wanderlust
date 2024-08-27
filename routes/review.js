const express = require('express');
const router = express.Router({mergeParams:true});
const Review=require('../models/review.js');
const Listing=require('../models/listing.js');
const wrapAsync= require("../util/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
  
  router.post('/',isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created!");
    res.redirect(`/listings/${listing._id}`);
  }));
  
  router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted!");
    res.redirect(`/listings/${id}`);
  }));
  
module.exports= router;