const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userControllers = require("../controllers/users");

// signup
router
	.route("/signup")
	.get(userControllers.renderSignup)
	.post(wrapAsync(userControllers.signup));

// login
router
	.route("/login")
	.get(userControllers.renderLogin)
	.post(
		saveRedirectUrl,
		passport.authenticate("local", {
			// "local" use for username or password
			failureRedirect: "/login",
			failureFlash: true,
		}),
		userControllers.login
	);

router.get("/logout", userControllers.logout);

module.exports = router;
