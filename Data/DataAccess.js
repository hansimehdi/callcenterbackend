/*globals  require, exports */

var mongoose = require("mongoose"),
    Admin = require("../models/admin"),
    User = require("../models/users");

// Function to establish connection for the Database
exports.connectToDb = function (callback) {
    // If the connection is already established, Then don't create one more connection
    if (mongoose.connection.readyState) {
        callback(undefined, { msg: "connected", code: 200 });
        return;
    }
    // Establish the DB connection
    mongoose.connect("mongodb://" + process.env.MONGO_HOST + "/transaction", { user: "admin", pass: "admin", useNewUrlParser: true });
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

// Function to get the information of a matched document
exports.GetAdmin = function (id, callback) {
    // Fetch the dish inforation
    Admin.find({ id: id }, function (err, admin) {
        callback(err, admin);
    });
};

// Function to create / update the Document for a dish
exports.createUser = function (userEntity, callback) {
    User.create(userEntity, function (err, success) {
        callback(err, success);
    });
};

// Function to create / update the Document for a dish
exports.createAdmin = function (adminEntity, callback) {
    Admin.create(adminEntity, function (err, success) {
        callback(err, success);
    });
};

exports.deleteUser = function (id, callback) {
    User.remove({ id: id }, function (err) {
        callback(err);
    });
}

exports.deleteAdmin = function (id, callback) {
    Admin.remove({ id: id }, function (err) {
        callback(err);
    });
}

exports.updateUser = function (user, callback) {
    User.update({ 'id': user.id }, user, function (err, success) {
        console.log(err);
        callback(err, success);
    });
}

exports.updateAdmin = function (admin, callback) {
    Admin.updateOne({ 'id': admin.id }, admin, function (err, admin) {
        console.log(err);
        callback(err, admin);
    });
}

exports.getAllUsers = function (callback) {
    User.find({}, function (err, success) {
        callback(err, success);
    });
}

exports.getAllAdmins = function (callback) {
    Admin.find({}, function (err, adminList) {
        callback(err, adminList);
    });
}