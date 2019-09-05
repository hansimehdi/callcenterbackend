var express = require('express');
var router = express.Router();
var plugController = require('../controllers/PlugController');

var authorize = require('../middlewares/accessAuthorization');
var policy = require('../middlewares/policyControl')
/* GET home page. */
router.post('/plug', authorize.AuthorizationCheck, policy.isUser, plugController.addPlug);

router.delete('/plug/:id', authorize.AuthorizationCheck,
    (rq, rs, nx) => {
        policy.grantRoles(rq, rs, nx, ["ADMIN", "USER"]);
    }, plugController.deletePlug)

router.get('/plug/:id', authorize.AuthorizationCheck, (rq, rs, nx) => {
    policy.grantRoles(rq, rs, nx, ["ADMIN", "USER"]);
}, plugController.getPlug)

router.get('/plugs', authorize.AuthorizationCheck, (rq, rs, nx) => {
    policy.grantRoles(rq, rs, nx, ["ADMIN", "USER"]);
}, plugController.list)

router.get('/plugs/admin', authorize.AuthorizationCheck, policy.isAdmin, plugController.listAdminPlugs);

router.put('/plug', authorize.AuthorizationCheck, policy.isUser, plugController.update)

module.exports = router;
