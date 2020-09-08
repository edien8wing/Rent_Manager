var TOOLS = {};

TOOLS.downloadFile = function (fileName, content) {
  // 创建隐藏的可下载链接
  var eleLink = document.createElement("a");
  eleLink.download = fileName;
  eleLink.style.display = "none";
  // 字符内容转变成blob地址
  var blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};
TOOLS.json2Csv = function (json) {
  var csv = "";
  for (var i = 0; i < json.length; i++) {
    for (var key in json[i]) {
      csv += '"' + json[i][key] + '",';
    }
    csv += "\r\n";
  }
  //console.info(csv);
  return csv;
};

module.exports = TOOLS;
