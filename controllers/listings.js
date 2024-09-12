const Listing= require("../models/listing.js");
const mbxGeocoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient= mbxGeocoding({accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings= await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.indexCategory=async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category: category });
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
  let response= await geocodingClient
  .forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send();
   
  let url= req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing( req.body.listing);
    newListing.owner= req.user._id;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    console.log(newListing);
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm=async (req, res) => {
    let {id}=req.params;
    const listing= await Listing.findById(id);
    let orignalImageUrl=listing.image.url;
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{listing,orignalImageUrl});
};

module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
      throw new expressError(400,"send valid data for listing");
    }
    let {id}=req.params;
    let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (typeof req.file !== "undefined") {
      let url= req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
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