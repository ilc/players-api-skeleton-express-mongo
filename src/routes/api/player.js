const Boom = require('boom');
const { jwtsecret } = require('config');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const { Player } = require('../../models');

const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/', function (req, res, next) {
    const token = verifyAuthHeader(req.get('Authorization'), res);
    if (token == null) {
	return;
    }
    
    Player.find({created_by: token.userId}, function (err, records) {
	res.status(200).send({
	    success: true,
	    players: records.map(cleanPlayer)
	});
    });
});

router.delete('/:player_id', function (req, res, next) {
    const token = verifyAuthHeader(req.get('Authorization'), res);
    if (token == null) {
	return;
    }
    Player.findOne({created_by: token.userId, _id: req.params.player_id}, function (err, record) {
	if(!record) {
	    res.status(404).send('');
	} else {
	    record.remove();
	    res.status(200).send({success: true});
	}
    });
});

router.post('/', function(req, res, next) {
    const token = verifyAuthHeader(req.get('Authorization'), res);
    // get out if we didn't verify.
    if (token == null) {
	return;
    }
    
    const id = token['userId'];
    var player_ = new Player(req.body);
    
    player_.created_by = id;

    player_
	.save(function (err, player) {
	    if (player == null) {
		res.status(409).send(err);
	    } else {
		res.status(201).send({
		    success: true,
		    player: player_
		});
	    }
	});
});

const verifyAuthHeader = function (header, res) {
    if (!header) {
	res.status(403).send('Bad Authorization Token.');
	return null;
    } else {
	try {
	    const token = verifyAuthHeaderString(header);
	    if (!token) {
		res.status(403).send('Bad Authorization Token.');
		return null;
	    } else {
		return token;
	    }
	} catch(err) {
	    res.status(403).send('Bad Authorization Token');
	    return null;
	}
    }
};

const verifyAuthHeaderString = function (header) {
    if (header.match(/^Bearer /) == null) {
	return null;
    }
    const token = header.replace(/^Bearer /,'');
    return verifyToken(token);
};

const verifyToken = token => jwt.verify(token, jwtsecret);

const cleanPlayer = x => {
    var x = Object.assign({},x,{id: x._id});
    delete x._id;
    return x;
};

module.exports = router;
