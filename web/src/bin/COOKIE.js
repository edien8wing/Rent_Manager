var COOKIE = {};

COOKIE.set = function (name, value) {
  //json使用'fun=&type=1'
  //var DAYS=1;
  var exp = new Date();
  exp.setTime(exp.getTime() + 12 * 60 * 60 * 1000);
  document.cookie =
    name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};
COOKIE.get = function (name) {
  var arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
};
COOKIE.del = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = COOKIE.get(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};
module.exports = COOKIE;
//  COOKIE.set('S_NAME','sssss');
//  console.info(COOKIE.get('S_NAME'));
