const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const { isLoogedIn, isOwner, validateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index and Create route
router
	.route("/")
	.get(wrapAsync(listingControllers.index))
	.post(
		isLoogedIn,
		upload.single("listing[image]"),
		wrapAsync(listingControllers.createListing)
	);

// New Raute
router.get("/new", isLoogedIn, listingControllers.renderNewForm);

// Show Route , Update Raute and Destory Raute
router
	.route("/:id")
	.get(wrapAsync(listingControllers.showListing))
	.put(
		isLoogedIn,
		isOwner,
		upload.single("listing[image]"),
		validateListing,
		wrapAsync(listingControllers.updateListing)
	)
	.delete(isLoogedIn, isOwner, wrapAsync(listingControllers.destoryListing));

// Edit Raute
router.get(
	"/:id/edit",
	isLoogedIn,
	isOwner,
	wrapAsync(listingControllers.editListing)
);

module.exports = router;
