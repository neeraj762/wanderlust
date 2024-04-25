const Listing = require("../models/listing")
const Review = require("../models/review")


module.exports.createReview= async (req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    console.log("new review saved");
    req.flash("success","New review created");
    res.redirect(`/listing/${listing._id}`)
    }


    module.exports.destroyListing = async (req,res)=>{
        let {id,revId} = req.params;
         await Listing.findByIdAndUpdate(id,{$pull:{reviews:revId}});
         await Review.findByIdAndDelete(revId);
      
         req.flash("success","Review deleted");
  
        res.redirect(`/listing/${id}`)
      
      }