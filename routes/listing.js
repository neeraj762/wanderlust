const express = require("express");
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn,validateListing, isOwner} = require("../middleware.js")
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

//Listing route and create listing route
router
.route("/")
.get(wrapAsync(ListingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'), 
    validateListing ,
    wrapAsync (ListingController.createListing)
)






// Create New Listing Route
router.get('/new', isLoggedIn ,wrapAsync(ListingController.renderNewForm))


// get detail ,update listing,delete listing route
router
.route("/:id")
.get(wrapAsync(ListingController.showListing))
.patch(isLoggedIn, 
    upload.single('listing[image]'), 
    validateListing,
    wrapAsync (ListingController.updateListing))
.delete(isLoggedIn,
    wrapAsync(ListingController.destroyListing))






// Edit route
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync (ListingController.renderEditForm))




module.exports = router;
 