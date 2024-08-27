const express = require('express');
const router = express.Router();

const Listing=require('../models/listing.js');
const wrapAsync= require("../util/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require('../middleware.js');



router.get('/', wrapAsync(async (req, res) => {
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
  }));
  
  router.get('/new',isLoggedIn,(req, res) => {
    res.render("./listings/new.ejs");
  });
  
  router.post('/',isLoggedIn,validateListing,wrapAsync(async (req, res,next) => {
    const newListing=new Listing( req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
  }));
  
  router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
  }));
  
  router.put('/:id',isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
    if(!req.body.listing){
      throw new expressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
  }));
  
  router.get('/:id', wrapAsync(async (req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews",
      populate:{
        path:"author"
      }
    })
    .populate("owner");
    if (!listing) {
      req.flash("error","listing was not found!");
    };
    res.render("./listings/show.ejs",{listing});
  }));
  
  router.delete('/:id',isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
  }));
  
  router.get('/:id/edit', wrapAsync(async (req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
  }));

  module.exports= router;