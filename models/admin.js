const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// create a schema for Dish
let AdminSchema = new Schema({
    id: String,
    username: String,
    lastname: String,
    address: String,
    email: String,
    password: String,
    phone: String,
    isActive: Boolean,
    role: String,
    createdAt: Date,
    updatedAt: Date
});

// Create a model using schema
let Admin = mongoose.model("admin", AdminSchema);

// make this model available
module.exports = Admin;