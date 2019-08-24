var responseRender = require('../middlewares/responseRender');
var userEntity = require('../Entities/User');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');
var serverErrors = require('../constant/errors');
var serverMessages = require('../constant/messages');
var Joi = require('@hapi/joi');

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

        userEntity = rq.body;
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
                rs.status(200).json(responseRender(user, "", serverMessages.ACCOUNT_CREATED));
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
                if (user == "") {
                    return rs.status(200).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
                }
                rs.status(200).json(responseRender(user, "", serverMessages.OK));
            }
        })
    },

    deleteUser: (rq, rs, nx) => {
        if (typeof (rq.params.id) == "undefined") { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")) }
        dbConnect.connectToDb();
        dbConnect.deleteUser(rq.params.id, function (err) {
            dbConnect.disconnect();
            if (err) { return rs.status(500).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, "")) }
        });
        dbConnect.disconnect();
        return rs.status(200).json(responseRender({}, "", serverMessages.OK))
    },

    update: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            id: Joi.string().required(),
            username: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            lastname: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z_ ]+$/),
            address: Joi.string().required().min(3).max(30),
            isActive: Joi.boolean().optional(),
            phone: Joi.string().optional().min(6).max(15),
            email: Joi.string().email({ minDomainSegments: 2 }).required().max(50),
            password: Joi.string().min(8).max(30).required(),
            createdAt: Joi.string().optional(),
            updatedAt: Joi.string().optional()
        });

        const { error, value } = Joi.validate(rq.body, schema);
        console.log(error)

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")); }

        dbConnect.connectToDb();
        userEntity.id = rq.body.id;
        userEntity.address = rq.body.address;
        userEntity.email = rq.body.email;
        userEntity.lastname = rq.body.lastname;
        userEntity.username = rq.body.username;
        userEntity.password = rq.body.password;
        userEntity.createdAt = rq.body.createdAt;
        userEntity.updatedAt = new Date();
        userEntity.isActive = rq.body.isActive
        dbConnect.updateUser(userEntity, function (err, user) {
            dbConnect.disconnect();
            if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
            if (user && user != "") {
                return rs.status(200).json(responseRender(user, "", serverMessages.OK))
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
                rs.status(500).json(responseRender(err, 'server errror', ''));
            }
            if (success) {
                rs.status(200).json(responseRender(success, '', ''));
            }
        });
    }
}