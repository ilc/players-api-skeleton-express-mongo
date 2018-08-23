const { Router } = require('express');
const user = require('./user');
const player = require('./player');
const login = require('./login');

const router = new Router();

router.use('/user', user);
router.use('/players', player);
router.use('/login', login);

module.exports = router;
