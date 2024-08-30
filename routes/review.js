const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync= require("../util/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

  router.post('/',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  
  router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));
  
module.exports= router;