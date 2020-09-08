var db = require("../../bin/db.js");
var logg = require("../../bin/log4js.js");
var STR = require("../../bin/STR.js");

var rules = {};

rules.fun = function (req, res, next) {
  switch (req.body.fun) {
    case "getAllUser":
      rules.getAllUser(req, res, next);
      break;
    case "chageUserInfo":
      rules.chageUserInfo(req, res, next);
      break;
    default:
      break;
  }
};
rules.getAllUser = (req, res, next) => {
  var sql =
    "SELECT id,userName,password,name,type,rule,dingId,depId  from user where isDeleted=0";
  //res.writeHead(200, {"Content-Type": "application/json"});

  db.query(sql, function (err, result) {
    //logg.error(result);

    //  logg.error(result[i]);
    if (result) {
      STR.SUCCESS(res, result, "获取用户数据");
    } else {
      STR.ERR(res, err);
    }
  });
};
rules.chageUserInfo = (req, res, next) => {
  let userInfo = JSON.parse(req.body.data);
  console.info(userInfo);
  var sql =
    "update user set `password`='" +
    userInfo.password +
    "',name='" +
    userInfo.name +
    "',`type`='" +
    userInfo.type +
    "',`dingId`='" +
    userInfo.dingId +
    "',`depId`='" +
    userInfo.depId +
    "',rule='" +
    userInfo.rule.join(",") +
    "' where id=" +
    userInfo.id;
  //res.writeHead(200, {"Content-Type": "application/json"});

  db.query(sql, function (err, result) {
    //logg.error(result);

    //  logg.error(result[i]);
    if (result) {
      STR.SUCCESS(res, result, "修改正确");
    } else {
      STR.ERR(res, err);
    }
  });
};
module.exports = rules;
