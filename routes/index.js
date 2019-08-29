var express = require('express');
var router = express.Router();

router.get('/', (rq, rs, nx) => {
    rs.status(200).json("Welcome to call center solution");
});

module.exports = router;