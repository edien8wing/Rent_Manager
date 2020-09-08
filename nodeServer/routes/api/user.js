var db = require("../../bin/db.js");
var logg = require("../../bin/log4js.js");
var STR = require("../../bin/STR.js");

var user = {};

user.fun = function (req, res, next) {
  console.info("user.fun");
  switch (req.body.fun) {
    case "login":
      user.login(req, res, next);
      break;
    case "logout":
      logout(req, res, next);
      break;
    default:
      break;
  }
};
/*
    var sql = 'SELECT *  from fix.fix';
    //res.writeHead(200, {"Content-Type": "application/json"});
    var otherArray = ["item1", "item2"];
    var otherObject = { item1: "item1val", item2: "item2val" };


    db.query(sql,function(err,result){
      //logg.error(result);

      //  logg.error(result[i]);
        var json = JSON.stringify({
          type: 0,
          code: "1234",
          data: result,
        });
      //  res.end( json );//！！一定要加配置的回调方法名
    //  var _data = { email: 'example@163.com', name: 'jaxu' };
       res.type('application/json');

       res.jsonp(json);
    });
*/

user.login = function (req, res, next) {
  var ans = [];
  console.info("user.login");
  logg.info(req.body.type + " " + req.body.fun);
  var jsontxt = req.body.json;
  logg.info(json);
  var json = JSON.parse(jsontxt);
  logg.info(json);
  logg.info(
    "处理结果:" +
      STR.standard(json.username) +
      " " +
      STR.standard(json.password)
  );
  var sql =
    "select user.id,user.userName,user.name,user.type,user.rule,user.dingId,user.depId from guarantee.user where username='" +
    json.username +
    "' and password='" +
    json.password +
    "'";
  db.query(sql, function (err, result) {
    if (result.length > 0) {
      ans = JSON.stringify({
        type: 1,
        code: "1234",
        data: result[0],
      });
    } else {
      ans = JSON.stringify({
        type: 0,
        code: "没有相应结果",
      });
    }
    res.type("application/json");
    res.jsonp(ans);
  });
};
user.funlist = function (req, res, next) {
  var ans = [];
  console.info("user.funlist");
  logg.info(req.body.type + " " + req.body.fun);
  var jsontxt = req.body.json;
  logg.info(json);
  var json = JSON.parse(jsontxt);
  logg.info(json);
  logg.info(
    "处理结果:" +
      STR.standard(json.username) +
      " " +
      STR.standard(json.password)
  );
  var sql =
    "select user.id,user.userName,user.name,user.type,user.rule from guarantee.user where username='" +
    json.username +
    "' and password='" +
    json.password +
    "'";
  db.query(sql, function (err, result) {
    if (result.length > 0) {
      ans = JSON.stringify({
        type: 1,
        code: "1234",
        data: result[0],
      });
    } else {
      ans = JSON.stringify({
        type: 0,
        code: "没有相应结果",
      });
    }
    res.type("application/json");
    res.jsonp(ans);
  });
};

user.logout = function (req, res, next) {};
module.exports = user;
