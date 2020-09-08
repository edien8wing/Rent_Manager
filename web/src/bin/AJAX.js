import fetchJsonp from "fetch-jsonp";
import COOKIE from "./COOKIE";
var AJAX = {};
//前端访问后端地址
const server = "http://172.0.0.1:3000/api";

var license = "camera04";
AJAX.send = function (json) {
  //json使用'fun=&type=1'
  var name = COOKIE.get("name");
  var dingId = COOKIE.get("dingId");
  var depId = COOKIE.get("depId");
  var result = fetch(server, {
    //jsonpCallbackFunction: 'search_results',
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    // body: 'fun=&type=1'
    body:
      "person=" +
      name +
      "&dingId=" +
      dingId +
      "&depId=" +
      depId +
      "&license=" +
      license +
      "&" +
      json,
  });
  return result;
};
/*将response 的文件保存到本地*/

AJAX.getFile = function (link, filename) {
  let result = AJAX.send(link);
  result.then((response) => {
    response.blob().then((blob) => {
      console.info(blob);
      const anchor = document.createElement("a");
      const body = document.querySelector("body");
      anchor.href = window.URL.createObjectURL(blob);
      anchor.download = filename;
      anchor.style.display = "none";
      body.appendChild(anchor);
      anchor.click();
      body.removeChild(anchor);
      window.URL.revokeObjectURL(anchor.href);
    });
  });
};

AJAX.send2 = function (type, fun, data) {
  let link = "type=" + type;
  link = link + "&fun=" + fun;
  if (data) {
    link = link + "&data=" + JSON.stringify(data);
  }
  let json = AJAX.send(link).then(function (response) {
    return response.json();
  });
  return json;
};
//返回json
AJAX.send3 = function (type, fun, data) {
  let json = AJAX.send2(type, fun, data).then((ans) => {
    return JSON.parse(ans);
  });
  return json;
};

module.exports = AJAX;
