var responseRender = require('../middlewares/responseRender');
var adminEntity = require('../Entities/AdminEntity');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');
var serverErrors = require('../constant/errors');
var serverMessages = require('../constant/messages');
var Joi = require('@hapi/joi');
var crypt = require('bcrypt');

module.exports = {
    addAdmin: (rq, rs, nx) => {
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

        //encrypt password
        crypt.hash(rq.body.password, 11, (err, data) => {
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            } else {
                adminEntity = rq.body;
                adminEntity.password = data;
                adminEntity.id = uuid();
                adminEntity.isActive = false;
                adminEntity.createdAt = adminEntity.updatedAt = new Date();
                dbConnect.connectToDb();
                dbConnect.createAdmin(adminEntity, function (err, admin) {
                    dbConnect.disconnect();
                    if (err) {
                        rs.status(400).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
                    }
                    if (admin) {
                        admin.password = null;
                        rs.status(200).json(responseRender(admin, "", serverMessages.ACCOUNT_CREATED));
                    }
                });
            }
        })
    },

    getAdmin: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.GetAdmin(rq.params.id, function (err, admin) {
            dbConnect.disconnect();
            if (err) {
                rs.status(400).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            }
            if (admin) {
                if (admin.length == 0) {
                    return rs.status(200).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
                }
                else {
                    admin[0].password = null;
                    return rs.status(200).json(responseRender(admin[0], "", serverMessages.OK));
                }
            } else {
                return rs.status(200).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
            }
        })
    },

    deleteAdmin: (rq, rs, nx) => {
        if (typeof (rq.params.id) == "undefined") { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")) }
        try {
            dbConnect.connectToDb();
            dbConnect.deleteAdmin(rq.params.id, function (err) {
                dbConnect.disconnect();
                if (err) {
                    return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
                } else {
                    return rs.status(200).json(responseRender({}, "", serverMessages.OK))
                }
            });
        } catch (e) {
            return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
        }
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

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")); }

        dbConnect.connectToDb();
        adminEntity.id = rq.body.id;
        adminEntity.address = rq.body.address;
        adminEntity.email = rq.body.email;
        adminEntity.lastname = rq.body.lastname;
        adminEntity.username = rq.body.username;
        adminEntity.password = rq.body.password;
        adminEntity.createdAt = rq.body.createdAt;
        adminEntity.updatedAt = new Date();
        adminEntity.isActive = rq.body.isActive
        dbConnect.updateAdmin(adminEntity, function (err, admin) {
            dbConnect.disconnect();
            if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
            if (admin != null && admin != "") {
                return rs.status(200).json(responseRender(admin, "", serverMessages.OK))
            } else {
                return rs.status(404).json(responseRender({}, serverErrors.ACCOUNT_NOT_FOUND, ""))
            }
        });
    },
    list: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getAllAdmins(function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(500).json(responseRender(err, 'server errror', ''));
            }
            if (success) {
                success.forEach(element => {
                    element.password = null;
                });
                rs.status(200).json(responseRender(success, '', ''));
            }
        });
    }
}