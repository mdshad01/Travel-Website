if (process.env.NODE_ENV != "production") {
	require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport"); //used for authentication in Node.js applications.
const LocalStrategy = require("passport-local"); //This strategy is commonly used for username-password authentication.
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

const dbURL = process.env.ATLASDB_URL;

main()
	.then(() => {
		console.log("Connected to DB");
	})
	.catch((err) => {
		console.log(err);
	});

async function main() {
	mongoose.connect(dbURL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
	mongoUrl: dbURL,
	crypto: {
		secret: process.env.SECRET,
	},
	touchAfter: 24 * 60 * 60,
});

store.on("error", () => {
	console.log("ERROR IN SESSION STORE ", err);
});

let sessionOption = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	},
};

// app.get("/", (req, res) => {
// 	res.send("You are in root node");
// });

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize()); //Initializes Passport for use in the app. This middleware is required for Passport to function and should be added to the Express app.
app.use(passport.session()); //Integrates Passport with Express sessions. This enables persistent login sessions (storing user data in the session) so users don't have to log in repeatedly.
passport.use(new LocalStrategy(User.authenticate())); //It verifies if the username exists and the password matches (usually by checking a hashed password in the database).

passport.serializeUser(User.serializeUser()); //passport.serializeUser: Converts a user object into a unique identifier (e.g., user ID) to be stored in the session.
// User.serializeUser(): A method provided by passport-local-mongoose that defines how user data is serialized (converted into the session-storable format).
passport.deserializeUser(User.deserializeUser()); //passport.deserializeUser: Converts the unique identifier stored in the session back into a user object (retrieving it from the database).
//User.deserializeUser(): A method provided by passport-local-mongoose that defines how the user is deserialized.
app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	res.locals.currUser = req.user;
	next();
});

// app.get("/demouser", async (req, res) => {
// 	let newUser = new User({
// 		email: "student1@gmail.com",
// 		username: "delta-student1",
// 	});

// 	let registeredUser = await User.register(newUser, "hello1");
// 	res.send(registeredUser);
// });

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

// app.get("/testListing", async (req, res) => {
// 	let newListing = new Listing({
// 		title: "My new Villa",
// 		description: "By the beach",
// 		price: 12000,
// 		location: "Calanhute, Goa",
// 		country: "India",
// 	});

// 	await newListing.save();
// 	console.log("sample was saved");
// 	res.send("Successful testing");
// });

app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
	let { status = 500, message = "Something went wrong" } = err;
	res.render("listings/error.ejs", { status, message });
	// res.status(status).send(message);
});

app.listen(8080, () => {
	console.log("server is listining on port : 8080");
});
