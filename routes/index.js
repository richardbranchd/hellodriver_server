var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/userCtrl');
var beaconCtrl = require('../controllers/beaconCtrl');

/* pages */
router.get('/', function(req, res, next) {res.render('index', { title: 'Express' });});

/* user routes */
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.put('/loginFB', userCtrl.loginFB);
router.get('/verify', userCtrl.verify);
router.post('/forgot', userCtrl.forgot);
router.get('/beaconCost/:locale', beaconCtrl.cost);
router.post('/beaconVerify', beaconCtrl.verify);

module.exports = router;
