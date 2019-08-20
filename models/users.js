const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// create a schema for Dish
let UserSchema = new Schema({
    id: String,
    username: String,
    lastname: String,
    address: String,
    email: String,
    password: String,
    phone: String,
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
});

// Create a model using schema
let User = mongoose.model("user", UserSchema);

// make this model available
module.exports = User;