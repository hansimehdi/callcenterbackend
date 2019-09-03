var responseRender = require('../middlewares/responseRender');
var adminEntity = require('../Entities/AdminEntity');
var dbConnect = require('../Data/DataAccess');
var uuid = require('uuid/v4');
var serverErrors = require('../constant/errors');
var serverMessages = require('../constant/messages');
var Joi = require('@hapi/joi');
var crypt = require('bcrypt');
var jwt = require("jsonwebtoken");
var fs = require('fs')
module.exports = {
    userLogin: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required().max(50),
            password: Joi.string().min(8).max(30).required(),
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_CREDENTIALS, "")) }

        dbConnect.connectToDb();
        dbConnect.getUserByEmail(rq.body.email, (err, user) => {
            dbConnect.disconnect();
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
            } else {
                if (typeof (user) != "undefined" && user != null && user.id != "") {
                    crypt.compare(String(rq.body.password), user.password, (err, success) => {
                        if (err || !success) {
                            return rs.status(200).json(responseRender({}, serverErrors.PASSWORD_INCORRECT, ""))
                        } else {
                            //load ssl private key for signiture
                            var privateKey = fs.readFileSync(process.cwd() + "/cert/jwtRS256.key");

                            // token expiration time 
                            const tokenExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24);

                            //generate signed authorization token token
                            var token = jwt.sign({
                                iss: process.env.APP_URL,
                                exp: tokenExpireTime,
                                nbf: 1000,
                                auth: "AUTHORIZATION",
                                iat: Date.now(),
                                sub: user.id,
                                role: "USER"
                            }, privateKey.toString(), { algorithm: 'RS256' });
                            rs.status(200).json(responseRender(token, "", serverMessages.OK))
                        }
                    });
                } else {
                    return rs.status(200).json(responseRender({}, serverErrors.INVALID_CREDENTIALS, ""))
                }
            }
        })
    },
    adminLogin: (rq, rs, nx) => {
        const schema = Joi.object().keys({
            email: Joi.string().email({ minDomainSegments: 2 }).required().max(50),
            password: Joi.string().min(8).max(30).required(),
        });

        const { error, value } = Joi.validate(rq.body, schema);

        if (error) { return rs.status(200).json(responseRender({}, serverErrors.INVALID_CREDENTIALS, "")) }

        dbConnect.connectToDb();
        dbConnect.getAdminByEmail(rq.body.email, (err, admin) => {
            dbConnect.disconnect();
            if (err) {
                return rs.status(500).json(responseRender({}, serverErrors.SERVER_ERROR, ""))
            } else {
                if (typeof (admin) != "undefined" && admin != null && admin.id != "") {
                    crypt.compare(String(rq.body.password), admin.password, (err, success) => {
                        if (err || !success) {
                            return rs.status(200).json(responseRender({}, serverErrors.PASSWORD_INCORRECT, ""))
                        } else {
                            //load ssl private key for signiture
                            var privateKey = fs.readFileSync(process.cwd() + "/cert/jwtRS256.key");

                            // token expiration time 
                            const tokenExpireTime = Math.floor(Date.now() / 1000) + (60 * 60 * 24);

                            //generate signed authorization token token
                            var token = jwt.sign({
                                iss: process.env.APP_URL,
                                exp: tokenExpireTime,
                                nbf: 1000,
                                auth: "AUTHORIZATION",
                                iat: Date.now(),
                                sub: admin.id,
                                role: admin.role
                            }, privateKey.toString(), { algorithm: 'RS256' });
                            rs.status(200).json(responseRender(token, "", serverMessages.OK))
                        }
                    });
                } else {
                    return rs.status(200).json(responseRender({}, serverErrors.INVALID_CREDENTIALS, ""))
                }
            }
        })
    }
}