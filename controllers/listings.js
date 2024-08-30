const Listing= require("../models/listing.js");

module.exports.index=async (req, res) => {
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm=(req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing=async (req, res) => {
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
};

module.exports.createListing=async (req, res,next) => {
    const newListing=new Listing( req.body.listing);
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
      throw new expressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req, res) => {
    let {id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","listing deleted!");
    res.redirect("/listings");
};