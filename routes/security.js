var express = require('express');
var router = express.Router();
var securityController = require('../controllers/securityController');

router.post('/auth/user/login', securityController.userLogin);

router.post('/auth/admin/login', securityController.adminLogin);

module.exports = router;
