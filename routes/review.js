const express = require("express");
const router = express.Router({ mergeParams: true }); // to send parent routes access to chid routes
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
	validateReview,
	isLoogedIn,
	isReviewAuthor,
} = require("../middleware.js");

const reviewControllers = require("../controllers/reviews.js");

// <---------------------------- Reviews------------------------------>
// < ---------------------- Post Review Raute ------------------------>
router.post(
	"/",
	isLoogedIn,
	validateReview,
	wrapAsync(reviewControllers.postReview)
);

// < ---------------------- Delete Review Raute ------------------------>
router.delete(
	"/:reviewId",
	isLoogedIn,
	isReviewAuthor,
	wrapAsync(reviewControllers.destoryReview)
);

module.exports = router;
