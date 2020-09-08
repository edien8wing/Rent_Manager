var express = require("express");
var user = require("./api/user.js");
var errType = require("./api/errType.js");
var wuye = require("./api/wuye.js");
var hetong = require("./api/hetong.js");
var rules = require("./api/rules.js");
var rent = require("./api/rent.js");
var FileCreater = require("./api/FileCreater.js");
var dingding = require("./api/dingding.js");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  /*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();*/

  switch (req.body.type) {
    case "user":
      user.fun(req, res, next);
      break;
    default:
      errType.fun(req, res, next);
      break;
  }
});
router.post("/", function (req, res, next) {
  /*
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();*/

  //  console.info(req.body);
  //  console.info(req.body.fun);
  console.info("请求类：", req.body.type);
  console.info("请求函数：", req.body.fun);
  switch (req.body.type) {
    case "user":
      user.fun(req, res, next);
      break;
    case "wuye":
      wuye.fun(req, res, next);
      break;
    case "hetong":
      hetong.fun(req, res, next);
      break;
    case "rules":
      rules.fun(req, res, next);
      break;
    case "rent":
      rent.fun(req, res, next);
      break;
    case "FileCreater":
      FileCreater.fun(req, res, next);
      break;
    case "dingding":
      dingding.fun(req, res, next);
      break;
    default:
      user.fun(req, res, next);
      break;
  }
});

module.exports = router;
