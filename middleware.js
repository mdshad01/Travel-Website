const Listing = require("./models/listing");
const Review = require("./models/review.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoogedIn = (req, res, next) => {
	//console.log(req.user); // by default passport store user information in current sesssion in req.user object when user logged in, when ever isAuthenticated() call it print user information except sensective information
	// console.log(req.path, req.originalUrl);
	if (!req.isAuthenticated()) {
		req.session.redirectUrl = req.originalUrl;
		req.flash("error", "You must be logged in to accessing listing!");
		return res.redirect("/login");
	}
	next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
	console.log(req.session.redirectUrl);
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	let listing = await Listing.findById(id);
	if (!listing.owner._id.equals(res.locals.currUser._id)) {
		req.flash("error", "You are not the owner of this listing");
		return res.redirect(`/listings/${id}`);
	}
	next();
};

module.exports.validateListing = (req, res, next) => {
	let { error } = listingSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((er) => er.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.validateReview = (req, res, next) => {
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		let errMsg = error.details.map((er) => er.message).join(",");
		throw new ExpressError(400, errMsg);
	} else {
		next();
	}
};

module.exports.isReviewAuthor = async (req, res, next) => {
	let { reviewId, id } = req.params;
	let review = await Review.findById(reviewId);
	if (!review.author.equals(res.locals.currUser._id)) {
		req.flash("error", "You are not the authoe of this review");
		return res.redirect(`/listings/${id}`);
	}
	next();
};
