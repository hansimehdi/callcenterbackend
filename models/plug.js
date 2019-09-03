const mongoose = require("mongoose"),
    Schema = mongoose.Schema;

// create a schema for Dish
let PlugSchema = new Schema({
    id: String,
    firstname: String,
    lastname: String,
    address: String,
    email: String,
    phone: String,
    mobile: String,
    zipCode: String,
    city: String,
    situation: String,
    numberOfChild: String,
    activity: String,
    age: String,
    guarentee: String,
    mutual: String,
    bank: String,
    availability: Boolean,
    role: String,
    createdAt: Date,
    updatedAt: Date
});

// Create a model using schema
let Plug = mongoose.model("plug", PlugSchema);

// make this model available
module.exports = Plug;