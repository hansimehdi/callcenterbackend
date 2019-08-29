var express = require('express');
var router = express.Router();
var userController = require('../controllers/UsersController');

router.get('/', (rq, rs, nx) => {
    rs.status(200).json("Welcome to call center solution");
});

/* GET home page. */
router.post('/user', userController.addUser);

router.delete('/user/:id', userController.deleteUser)

router.get('/user/:id', userController.getUser)

router.get('/users',userController.list)

router.put('/user', userController.update)

router.delete('/user/:id', userController.deleteUser);

module.exports = router;
