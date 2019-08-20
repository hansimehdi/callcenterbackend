var express = require('express');
var router = express.Router();
var userController = require('../controllers/UsersController');

/* GET home page. */
router.post('/user', userController.addUser);

router.delete('/user/:id', userController.deleteUser)

router.get('/user/:id', userController.getUser)

router.put('/user/:id', userController.update)

module.exports = router;
