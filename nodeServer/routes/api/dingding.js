var db = require("../../bin/db.js");
var logg = require("../../bin/log4js.js");
var dingApi = require("../../bin/dingApi.js");

var dingding = {};

dingding.fun = function (req, res, next) {
  switch (req.body.fun) {
    case "testLink":
      dingding.testLink(req, res, next);
      break;
    case "createProcessinstance":
      dingding.createProcessinstance(req, res, next);
      break;
    default:
      console("没有这个fun");
      break;
  }
};

dingding.testLink = async function (req, res, next) {
  let json;
  console.info("testLink");
  let ans = await dingApi.getAccessToken();
  if (ans.errcode) {
    json = JSON.stringify(ans);
  } else {
    delete ans.access_token;
    json = JSON.stringify(ans);
  }
  res.type("application/json");

  res.jsonp(json);
};

dingding.createProcessinstance = function (req, res, next) {};

module.exports = dingding;
