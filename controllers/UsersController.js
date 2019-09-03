var responseRender = require('../middlewares/responseRender');
var userEntity = require('../Entities/User');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');
var serverErrors = require('../constant/errors');
var serverMessages = require('../constant/messages');
var Joi = require('@hapi/joi');
var crypt = require('bcrypt');

module.exports = {
    addUser: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            id: Joi.string().allow(''),
            username: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            lastname: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z_ ]+$/),
            address: Joi.string().required().min(3).max(30),
            isActive: Joi.boolean().optional(),
            phone: Joi.string().optional().min(6).max(15),
            email: Joi.string().email({ minDomainSegments: 2 }).required().max(50),
            password: Joi.string().min(8).max(30).required(),
            createdAt: Joi.string().allow(''),
            updatedAt: Joi.string().allow('')
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")) }

        crypt.hash(rq.body.password, 11, (err, data) => {
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            } else {
                userEntity = rq.body;
                userEntity.password = data;
                userEntity.id = uuid();
                userEntity.isActive = false;
                userEntity.createdAt = userEntity.updatedAt = new Date();
                dbConnect.connectToDb();
                dbConnect.createUser(userEntity, function (err, user) {
                    dbConnect.disconnect();
                    if (err) {
                        rs.status(400).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
                    }
                    if (user) {
                        user.password = null;
                        rs.status(200).json(responseRender(user, "", serverMessages.ACCOUNT_CREATED));
                    }
                });
            }
        });
    },

    getUser: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getUser(rq.params.id, function (err, user) {
            dbConnect.disconnect();
            if (err) {
                rs.status(400).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            }
            if (user) {
                if (user.length == 0) {
                    return rs.status(200).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
                } else {
                    user[0].password = null;
                    rs.status(200).json(responseRender(user[0], "", serverMessages.OK));
                }
            }
        })
    },

    deleteUser: (rq, rs, nx) => {
        if (typeof (rq.params.id) == "undefined") { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")) }
        dbConnect.connectToDb();
        dbConnect.deleteUser(rq.params.id, function (err) {
            dbConnect.disconnect();
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
            } else {
                return rs.status(200).json(responseRender({}, "", serverMessages.OK))
            }
        });
    },

    update: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            username: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            lastname: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z_ ]+$/),
            address: Joi.string().required().min(3).max(30),
            phone: Joi.string().optional().min(6).max(15),
            email: Joi.string().email({ minDomainSegments: 2 }).required().max(50),
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")); }

        dbConnect.connectToDb();
        userEntity.id = rq.body.id;
        userEntity.address = rq.body.address;
        userEntity.email = rq.body.email;
        userEntity.lastname = rq.body.lastname;
        userEntity.username = rq.body.username;
        userEntity.phone = rq.body.phone;
        userEntity.updatedAt = new Date();
        dbConnect.getUser(userEntity.id, (err, usr) => {
            if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
            else if (usr && usr.length > 0) {
                usr[0].address = userEntity.address;
                usr[0].email = userEntity.email;
                usr[0].lastname = userEntity.lastname;
                usr[0].username = userEntity.username;
                usr[0].phone = userEntity.phone;
                usr[0].updatedAt = userEntity.updatedAt;
                dbConnect.updateUser(usr[0], function (err, user) {
                    dbConnect.disconnect();
                    if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
                    if (user && user != "") {
                        return rs.status(200).json(responseRender(user, "", serverMessages.OK))
                    } else {
                        return rs.status(404).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
                    }
                });
            } else {
                return rs.status(404).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
            }
        });
    },

    list: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getAllUsers(function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(500).json(responseRender(err, serverErrors.SERVER_ERROR, ''));
            }
            if (success) {
                success.forEach(element => {
                    element.password = null;
                });
                rs.status(200).json(responseRender(success, '', serverMessages.OK));
            }
        });
    }
}