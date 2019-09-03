var express = require('express');
var router = express.Router();
var userController = require('../controllers/UsersController');
var authorize = require('../middlewares/accessAuthorization');
var policy = require('../middlewares/policyControl')

router.get('/', (rq, rs, nx) => {
    rs.status(200).json("Welcome to call center solution");
});

/* GET home page. */
router.post('/user', authorize.AuthorizationCheck, policy.isAdmin, userController.addUser);

router.delete('/user/:id', authorize.AuthorizationCheck, policy.isAdmin, userController.deleteUser)

router.get('/user/:id', authorize.AuthorizationCheck, policy.isAdmin, userController.getUser)

router.get('/users', authorize.AuthorizationCheck, policy.isAdmin, userController.list)

router.put('/user', authorize.AuthorizationCheck, policy.isAdmin, userController.update)

router.delete('/user/:id', authorize.AuthorizationCheck, policy.isAdmin, userController.deleteUser);

module.exports = router;
