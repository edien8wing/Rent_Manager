var db = require('../../bin/db.js');
var logg =require('../../bin/log4js.js');


  var errType    = {};

  errType.fun = function(req, res, next){
    console.log('error type');
    logg.error('testerror');
    res.end('error type');
  }


  module.exports = errType;
