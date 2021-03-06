var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/userCtrl');
var beaconCtrl = require('../controllers/beaconCtrl');
var tripCtrl = require('../controllers/tripCtrl');

/* pages */
router.get('/', function(req, res, next) {res.render('index', { title: 'Express' });});

/* user routes */
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.put('/loginFB', userCtrl.loginFB);
router.get('/verify', userCtrl.verify);
router.post('/forgot', userCtrl.forgot);
router.post('/user', userCtrl.update);

/* beacon routes */
router.get('/beaconCost/:locale', beaconCtrl.cost);
router.post('/beaconVerify', beaconCtrl.verify);

/* trip routes */
router.post('/trip', tripCtrl.update)

module.exports = router;
