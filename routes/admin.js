var express = require('express');
var router = express.Router();
var adminController = require('../controllers/AdminController');

/* GET home page. */
router.post('/admin', adminController.addAdmin);

router.delete('/admin/:id', adminController.deleteAdmin)

router.get('/admin/:id', adminController.getAdmin)

router.get('/admins',adminController.list)

router.put('/admin', adminController.update)

module.exports = router;
