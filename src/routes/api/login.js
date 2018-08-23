const Boom = require('boom');
const { Router } = require('express');
const { User } = require('../../models');

const asyncHandler = require('express-async-handler');

const router = new Router();

router.post('/', function (req, res, next) {
    const { email , password } = req.body;
    User.findOne({email: email }, function(err, record) {
	if (record == null) {
	    res.status(401).send({
		success: false
	    });
	} else {
	    if (record.passwordIsValid(password)) {
		res.status(200).send({
		    success: true,
		    user: record.getCleanUser(),
		    token: record.getToken()
		});
	    } else {
		res.status(401).send({
		    success: false
		});
	    }
	}
    });
});

module.exports = router;
	  
