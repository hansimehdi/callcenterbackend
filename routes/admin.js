var express = require('express');
var router = express.Router();
var adminController = require('../controllers/AdminController');
var authorize = require('../middlewares/accessAuthorization');
var policy = require('../middlewares/policyControl')

router.post('/admin', authorize.AuthorizationCheck, policy.isSuperAdmin, adminController.addAdmin);

router.delete('/admin/:id', authorize.AuthorizationCheck, policy.isSuperAdmin, adminController.deleteAdmin)

router.get('/admin/:id', authorize.AuthorizationCheck, policy.isSuperAdmin, adminController.getAdmin)

router.get('/admins', authorize.AuthorizationCheck, policy.isSuperAdmin, adminController.list)

router.put('/admin', authorize.AuthorizationCheck, policy.isSuperAdmin, adminController.update)

module.exports = router;
