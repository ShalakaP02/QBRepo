var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('respond with a resource');
});

module.exports = router;
