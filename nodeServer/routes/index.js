var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('index');
  res.render('index', { title: 'Express' });
  res.end();
});

module.exports = router;
