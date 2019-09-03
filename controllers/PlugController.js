var responseRender = require('../middlewares/responseRender');
var plugEntity = require('../Entities/plugEntity');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');
var serverErrors = require('../constant/errors');
var serverMessages = require('../constant/messages');
var Joi = require('@hapi/joi');
module.exports = {
    addPlug: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            firstname: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z_ ]+$/),
            lastname: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            address: Joi.string().required().min(3).max(30),
            phone: Joi.string().optional().min(6).max(15),
            email: Joi.string().optional(),
            mobile: Joi.string().optional().min(6).max(15),
            zipCode: Joi.string().optional().min(4).max(6),
            city: Joi.string().optional().min(3).max(15),
            situation: Joi.string().required(),
            numberOfChild: Joi.string().required(),
            activity: Joi.string().required(),
            age: Joi.string().required(),
            guarentee: Joi.string().optional(),
            mutual: Joi.string().required(),
            bank: Joi.string().optional(),
            availability: Joi.boolean().required()
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({ error }, serverErrors.INVALID_DATA, "")) }

        plugEntity.id = uuid();
        plugEntity.activity = rq.body.activity;
        plugEntity.address = rq.body.address;
        plugEntity.age = rq.body.age;
        plugEntity.availability = rq.body.availability;
        plugEntity.bank = rq.body.bank;
        plugEntity.city = rq.body.city;
        plugEntity.email = rq.body.email;
        plugEntity.zipCode = rq.body.zipCode;
        plugEntity.phone = rq.body.phone;
        plugEntity.mobile = rq.body.mobile;
        plugEntity.situation = rq.body.situation;
        plugEntity.numberOfChild = rq.body.numberOfChild;
        plugEntity.mutual = rq.body.mutual;
        plugEntity.firstname = rq.body.firstname;
        plugEntity.guarentee = rq.body.guarentee;
        plugEntity.lastname = rq.body.lastname;

        dbConnect.connectToDb();
        dbConnect.AddPlug(plugEntity, (err, plug) => {
            dbConnect.disconnect();
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            } else {
                if (plug) {
                    return rs.status(200).json(responseRender(plug, "", serverMessages.OK));
                }
            }
        })
    },

    getPlug: (rq, rs, nx) => {
        if (typeof (rq.params.id) == "undefined" || rq.params.id == "") {
            return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, ""));
        }
        dbConnect.connectToDb();
        dbConnect.GetPlug(rq.params.id, (err, plug) => {
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""));
            } else {
                if (plug) {
                    return rs.status(200).json(responseRender(plug, "", serverMessages.OK))
                } else {
                    return rs.status(404).json(responseRender({}, serverErrors.PLUG_NOT_FOUND, ""))
                }
            }
        })
    },

    deletePlug: (rq, rs, nx) => {
        if (typeof (rq.params.id) == "undefined") { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")) }
        dbConnect.connectToDb();
        dbConnect.DeletePlug(rq.params.id, function (err) {
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
            firstname: Joi.string().required().min(3).max(30).regex(/^[a-zA-Z_ ]+$/),
            lastname: Joi.string().required().max(30).min(3).regex(/^[a-zA-Z_ ]+$/),
            address: Joi.string().required().min(3).max(30),
            phone: Joi.string().optional().min(6).max(15),
            email: Joi.string().optional(),
            mobile: Joi.string().optional().min(6).max(15),
            zipCode: Joi.string().optional().min(4).max(6),
            city: Joi.string().optional().min(3).max(15),
            situation: Joi.string().required(),
            numberOfChild: Joi.string().required(),
            activity: Joi.string().required(),
            age: Joi.string().required(),
            guarentee: Joi.string().optional(),
            mutual: Joi.string().required(),
            bank: Joi.string().optional(),
            availability: Joi.boolean().required()
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_DATA, "")); }

        dbConnect.connectToDb();
        plugEntity.id = rq.body.id;
        plugEntity.activity = rq.body.activity;
        plugEntity.address = rq.body.address;
        plugEntity.age = rq.body.age;
        plugEntity.availability = rq.body.availability;
        plugEntity.bank = rq.body.bank;
        plugEntity.city = rq.body.city;
        plugEntity.email = rq.body.email;
        plugEntity.zipCode = rq.body.zipCode;
        plugEntity.phone = rq.body.phone;
        plugEntity.mobile = rq.body.mobile;
        plugEntity.situation = rq.body.situation;
        plugEntity.numberOfChild = rq.body.numberOfChild;
        plugEntity.mutual = rq.body.mutual;
        plugEntity.firstname = rq.body.firstname;
        plugEntity.guarentee = rq.body.guarentee;
        plugEntity.lastname = rq.body.lastname;
        plugEntity.updatedAt = new Date();
        dbConnect.GetPlug(plugEntity.id, (err, plg) => {
            if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
            else if (plg) {
                plg.activity = plugEntity.activity;
                plg.address = plugEntity.address;
                plg.age = plugEntity.age;
                plg.availability = plugEntity.availability;
                plg.bank = plugEntity.bank;
                plg.city = plugEntity.city;
                plg.email = plugEntity.email;
                plg.zipCode = plugEntity.zipCode;
                plg.phone = plugEntity.phone;
                plg.mobile = plugEntity.mobile;
                plg.situation = plugEntity.situation;
                plg.numberOfChild = plugEntity.numberOfChild;
                plg.mutual = plugEntity.mutual;
                plg.firstname = plugEntity.firstname;
                plg.guarentee = plugEntity.guarentee;
                plg.lastname = plugEntity.lastname;
                plg.updatedAt = plugEntity.updatedAt;

                dbConnect.UpdatePlug(plg.id, plg, function (err, success) {
                    dbConnect.disconnect();
                    if (err) { return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, "")) }
                    if (success && success != "") {
                        return rs.status(200).json(responseRender(success, "", serverMessages.OK))
                    } else {
                        return rs.status(404).json(responseRender({}, serverErrors.PLUG_NOT_FOUND, ""))
                    }
                });
            } else {
                return rs.status(404).json(responseRender({}, serverErrors.PLUG_NOT_FOUND, ""))
            }
        });
    },
    list: (rq, rs, nx) => {
        dbConnect.connectToDb();
        dbConnect.getAllPlugs(function (err, success) {
            dbConnect.disconnect();
            if (err) {
                rs.status(500).json(responseRender(err, serverErrors.SERVER_ERROR, ''));
            }
            if (success) {
                rs.status(200).json(responseRender(success, '', serverMessages.OK));
            }
        });
    }
}