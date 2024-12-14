const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
});
// we passportLocalMongoose in plugin because it automatically include username , hashing , slating,  or add password
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
