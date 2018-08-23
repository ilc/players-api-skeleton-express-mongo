const Boom = require('boom');
const { Router } = require('express');
const { User } = require('../../models');

const asyncHandler = require('express-async-handler');

const router = new Router();

router.post('/', asyncHandler(async function (req, res, next) {
    const { password, confirm_password, id } = req.body;
    if (!confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');
    const user = new User(req.body);
    user.hashPassword();
    user
    .save()
    .then(() => {
      res.status(201).send({
          success: true,
          token: user.getToken(),
          user: user.getCleanUser(),
      });
    }).catch(next);
}));



router.put('/:id', function (req, res, next) {
    const { password, confirm_password, id } = req.body;
    if (!confirm_password || password !== confirm_password) throw Boom.conflict('Passwords do not match');
    User.findOne({_id: req.params.id},function (err, record) {
	var password = record.password;
	Object.assign(record, req.body);
	if (password != record.password) {
	    record.hashPassword();
	}
	record.save().then(() => {
	    res.status(200).send({
		user: record.getCleanUser(),
		success: true,
	    });
	});
    });
});

module.exports = router;
