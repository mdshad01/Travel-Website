const User = require("../models/user");

module.exports.renderSignup = (req, res) => {
	res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
	try {
		let { username, email, password } = req.body;
		let newUser = new User({ email, username });
		const registeredUser = await User.register(newUser, password);
		console.log(registeredUser);
		req.login(registeredUser, (err) => {
			if (err) {
				return next(err);
			}
			req.flash("success", "Welcome back to Wanderlust");
			res.redirect("/listings");
		});
	} catch (err) {
		req.flash("error", err.message);
		res.redirect("/signup");
	}
};

module.exports.renderLogin = (req, res) => {
	res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
	req.flash("success", "Welcome back to Wanderlust");
	let redirectUrl = res.locals.redirectUrl || "/listings";
	res.redirect(redirectUrl);
	// res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return nect(err);
		}
		req.flash("success", "You are logged out successfully");
		res.redirect("/login");
	});
};