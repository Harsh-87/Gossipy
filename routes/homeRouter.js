var path = require('path');
var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

router.use(bodyParser.json());

router.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        res.sendFile(path.resolve("index.html"));
    });

module.exports = router;
