var STR = {};
//去除
STR.standard = function (s) {
  console.info("str.standard:" + s);
  var pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',%\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘']"
  );
  var rs = "";
  for (var i = 0; i < s.length; i++) {
    rs = rs + s.substr(i, 1).replace(pattern, "");
  }
  return rs;
};
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
//time1设置成计算时间
STR.minersTime = function (t1, t2) {
  var time1 = new Date(t1).getTime();
  var time2;
  if (t2) {
    time2 = new Date(t2).getTime();
  } else {
    time2 = new Date().getTime();
  }
  // = t2 || new Date().getTime();
  //计算出相差天数
  var isLarge = false;
  var date3 = time1 - time2;
  if (date3 >= 0) {
    isLarge = true;
  } else {
    isLarge = false;
  }
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  //计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  var ans = {
    isLarge: isLarge,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
  return ans;
};
STR.replace = function (s) {
  let ans = s.replace(
    /[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,
    ""
  );
  console.info(ans);
  return ans;
};
STR.minersNow = function (sDate) {
  var sdate = new Date(sDate.replace(/-/g, "/"));
  var now = new Date();
  var days = now.getTime() - sdate.getTime();
  var day = parseInt(days / (1000 * 60 * 60 * 24));
  return day;
};
module.exports = STR;
