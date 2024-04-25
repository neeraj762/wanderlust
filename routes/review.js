const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync')
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const Listing = require('../models/listing');
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");
const reviewListing = require("../controllers/review.js");





// create review
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewListing.createReview))


//destroy review
router.delete('/:revId', isReviewAuthor, wrapAsync(reviewListing.destroyListing))


module.exports = router;