var responseRender = require('../middlewares/responseRender');
var userEntity = require('../Entities/User');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');

module.exports = {
    addUser: (rq, rs, nx) => {
        userEntity = rq.body;
        userEntity.id = uuid();
        userEntity.isActive = false;
        userEntity.createdAt = userEntity.updatedAt = new Date();
        dbConnect.connectToDb();
        dbConnect.createUser(userEntity, function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(200).json(responseRender({}, "error saving user", ""));
            }
            if (success) {
                rs.status(200).json(responseRender({ success }, "", "user created"));
            }
        });
    },

    getUser: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getUser(rq.params.id, function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(200).json(responseRender({}, "error fetching user", ""));
            }
            rs.status(200).json(responseRender(success, "", ""));
        })
    },

    deleteUser: (rq, rs, nx) => {
        rs.status(200).json(responseRender({}, "", ""));
    },

    update: (rq, rs, nx) => {
        rs.status(200).json(responseRender({}, "", ""));
    },
    list: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getAllUsers(function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(500).json(responseRender(err, 'server errror', ''));
            }
            if (success) {
                rs.status(200).json(responseRender(success, '', ''));
            }
        });
    }
}