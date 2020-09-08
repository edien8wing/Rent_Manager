import COOKIE from "./COOKIE.js";
var config = {};
//预定义功能功能
config.userRule = {
  admin: [
    "100",
    /*主页 一般都有*/ "101" /*维修图表*/,
    ,
    "102" /*task金额*/,
    "103" /*标签云*/,
    "200",
    /*物业管理*/ "201" /*当前维修记录*/,
    "202" /*历史维修记录*/,
    "300" /*日常*/,
    "302" /*是否查看其他人*/,
    "301" /*合同节点*/,
    "303" /*添加节点功能*/,
    "304" /*是否能够结算功能*/,
    "400" /*短信平台*/,
    "401" /*短信平台1*/,
    "500" /*权限*/,
  ],

  user: ["100"],
  "": ["0"],
};
//附加功能在数据库中的rule中能找到
//完整的功能 页面
config.menu = [
  { name: "主页", key: "100", path: "/", icon: "" },
  {
    name: "物业管理",
    key: "200",
    icon: "tool",
    children: [
      { name: "当前维修记录", key: "201", path: "/wuye_currentFix", icon: "" },
      { name: "历史维修", key: "202", path: "/wuye_historyFix", icon: "" },
    ],
  },
  {
    name: "日常",
    key: "300",
    icon: "",
    children: [
      {
        name: "合同节点",
        key: "301",
        path: "/richang_hetong_unfinish",
        icon: "",
      },
      //302查找别人的权限
    ],
  },
  {
    name: "租售",
    key: "600",
    icon: "",
    children: [
      { name: "房源(列表)", key: "605", path: "/rent_building", icon: "" },
      { name: "房源(剖面)", key: "601", path: "/rentBuildingProfile" },
      { name: "合同", key: "602", path: "/rent_contract", icon: "" },
      { name: "账单", key: "603", path: "/rent_bill", icon: "" },
      { name: "BI", key: "604", path: "/rentBI", icon: "" },
    ],
  },
  {
    name: "短信",
    key: "400",
    icon: "",
    children: [{ name: "短信平台", key: "401", path: "/SMessenger", icon: "" }],
  },
  { name: "权限", key: "500", path: "/rules", icon: "" },
];
//功能性功能
config.item = [
  { name: "维修图表", key: "101" },
  { name: "task金额", key: "102" },
  { name: "标签云", key: "103" },
  { name: "是否查看其他人", key: "302" },
  { name: "添加合同", key: "303" },
  { name: "结算功能", key: "304" },
  { name: "合同发起", key: "606" },
  { name: "合同下载", key: "607" },
  { name: "下载单据", key: "608" },
  { name: "结算bill", key: "609" },
  { name: "企业更名", key: "610" },
  { name: "发起退租", key: "611" },
];
//查找本账户是否有这个功能
config.hasRule = (value) => {
  let rule = COOKIE.get("rule");
  let ans = false;
  if (rule) {
    rule = rule.split(",");
    //console.info('hasvalue:',rule);

    for (let i = 0; i < rule.length; i++) {
      if (rule[i] == value) {
        ans = true;
        break;
      }
    }
  }
  return ans;
};
export default config;
