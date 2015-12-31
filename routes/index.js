var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/userCtrl');

/* pages */
router.get('/', function(req, res, next) {res.render('index', { title: 'Express' });});

/* user routes */
router.post('/login', userCtrl.login);
router.post('/signup', userCtrl.signup);
router.put('/loginFB', userCtrl.loginFB);
router.get('/verify', userCtrl.verify);
router.post('/forgot', userCtrl.forgot);

module.exports = router;
