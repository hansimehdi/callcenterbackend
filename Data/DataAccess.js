/*globals  require, exports */

var mongoose = require("mongoose"),
    Admin = require("../models/admin"),
    User = require("../models/users"),
    userEntity = require('../Entities/User');

// Function to establish connection for the Database
exports.connectToDb = function (callback) {
    // If the connection is already established, Then don't create one more connection
    if (mongoose.connection.readyState) {
        callback(undefined, { msg: "connected", code: 200 });
        return;
    }
    // Establish the DB connection
    mongoose.connect("mongodb://" + process.env.MONGO_HOST + "/admin", { user: "admin", pass: "admin" });
    // Event for successfully connecting database
    mongoose.connection.on("connected", function () {
        console.log('connected')
    });
    // Event when there is an error connecting for database
    mongoose.connection.on("error", function (err) {
        console.log(err)
    });
};

exports.disconnect = function (callback) {
    mongoose.disconnect();
};


// Function to get the information of a matched document
exports.getUser = function (id, callback) {
    // Fetch the dish inforation
    User.find({ id: id }, function (err, user) {
        callback(err, user);
    });
};

// Function to create / update the Document for a dish
exports.createUser = function (userEntity, callback) {
    User.create(userEntity, function (err, success) {
        callback(err, success);
    });
};

exports.getAllUsers = function (callback) {
    User.find({}, function (err, success) {
        callback(err, success);
    });
}