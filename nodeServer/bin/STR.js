var STR = {};
STR.DX = function (n) {
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) return "数据非法";
  var unit = "千百拾亿千百拾万千百拾元角分",
    str = "";
  n += "00";
  var p = n.indexOf(".");
  if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
  unit = unit.substr(unit.length - n.length);
  for (var i = 0; i < n.length; i++)
    str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);
  return str
    .replace(/零(千|百|拾|角)/g, "零")
    .replace(/(零)+/g, "零")
    .replace(/零(万|亿|元)/g, "$1")
    .replace(/(亿)万|壹(拾)/g, "$1$2")
    .replace(/^元零?|零分/g, "")
    .replace(/元$/g, "元整");
};
STR.standard = function (s) {
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',%\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
};
STR.replace = function (s) {
  return s.replace(
    /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,
    ""
  );
};
//正确
STR.SUCCESS = function (res, data, info) {
  let ans = JSON.stringify({
    type: 1,
    data: data,
    code: info,
  });
  res.type("application/json");
  res.jsonp(ans);
};
//错误
STR.ERR = function (res, err) {
  let ans = JSON.stringify({
    type: 0,
    code: err,
  });
  res.type("application/json");
  res.jsonp(ans);
};

module.exports = STR;
