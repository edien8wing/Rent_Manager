const fetch = require("node-fetch");
const moment = require("moment");
const db = require("./db");
const STR = require("./STR");
const Users = require("./Users");
var MailTool = require("./MailTool");
var dingApi = {};
dingApi.AppKey = "APPKey";
dingApi.AppSecret = "AppSecret";
dingApi.token = "1111111";
/*
{ errcode: 0,
  access_token: '1111111',
  errmsg: 'ok',
  expires_in: 7200 }


  { errcode: 40096, errmsg: '不合法的appKey或appSecret' }
*/
dingApi.getAccessToken = async function () {
  let url =
    "https://oapi.dingtalk.com/gettoken?appkey=" +
    dingApi.AppKey +
    "&appsecret=" +
    dingApi.AppSecret;
  let a = {};
  await fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      a = myJson;
      if (a.errcode) {
        if (!MailTool.isSend) {
          MailTool.SendNoticeMail("连接钉钉失败", a.errmsg);
          db.saveSql(a.errmsg, "系统发送", "钉钉连接错误");
        }
      }
    });

  return a;
};
/*{
	"agent_id":"817054690",
	"msg":{
		"msgtype":"text",
		"text":{
			"content":"1"
		}
	},
	"userid_list":"manager5127"
} */
dingApi.sendPayMessage = async function (content) {
  console.info("sendPayMessage");
  let token_back = await dingApi.getAccessToken();
  let token = "";
  if (token_back.errcode) {
    /*如果有错误 */
    console.info(token_back.errcode);
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=" +
    token;
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      agent_id: "817054690",
      msg: {
        msgtype: "text",
        text: {
          content: content,
        },
      },
      /*接受信息的id */
      userid_list: "manager5127",
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      result = myJson;
    });
  //return result;
};

dingApi.createBillInstace = async function (
  user,
  uid,
  depid,
  contractData,
  billData,
  totalPaid,
  isPaid
) {
  let processCode = "PROC-12121212121";
  console.info("获取到的用户名：", user);
  //发起审批人的编号
  let gu_id = uid;
  let dep = depid;
  console.info("检查发送文本id:", gu_id, "dep:", dep);
  let token_back = await dingApi.getAccessToken();
  let token = "";
  let result;
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }

  let text =
    "账单ID:" +
    billData.id +
    "确认到[" +
    contractData.building +
    "]的租户[" +
    contractData.part_B +
    "]支付了" +
    billData.billBeginDate +
    "至" +
    billData.billEndDate +
    "发生的" +
    billData.info +
    "应付" +
    billData.money +
    "元,本次支付后合计";

  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/create?" +
    "access_token=" +
    token;

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_code: processCode,
      originator_user_id: gu_id,
      dept_id: dep,
      form_component_values: [
        { name: "费用确认信息", value: text },
        { name: "本期累计支付", value: totalPaid },
        { name: "状态传递", value: isPaid },
      ],
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      result = myJson;
    });
  return result;
};
//建立新合同审批
dingApi.createProcessinstance = async function (
  contractInfo,
  person,
  uid,
  depid
) {
  let processCode = "PROC-121212121212";
  console.info("获取到的用户名：", person);
  //发起审批人的编号
  let gu_id = uid;
  let dep = depid;
  console.info("检查发送文本id:", gu_id, "dep:", dep);
  let token_back = await dingApi.getAccessToken();
  let token = "";
  let result;
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let process_instance_id = contractInfo.buildingName + "中的";
  //console.info(token);
  roomListText = contractInfo.buildingName;
  for (let i = 0; i < contractInfo.roomList.length; i++) {
    roomListText += contractInfo.roomList[i].name;
    roomListText += ",";
  }
  // console.info(token);
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/create?" +
    "access_token=" +
    token;

  console.info("发送地址检查:", url);
  let depositList_d = [];
  let billList_d = [];

  for (let i = 0; i < contractInfo.billList.length; i++) {
    billList_d.push([
      {
        name: "开始时间",
        value: moment(contractInfo.billList[i].startDate).format("yyyy-MM-DD"),
      },
      {
        name: "结束时间",
        value: moment(contractInfo.billList[i].endDate).format("yyyy-MM-DD"),
      },
      { name: "类型", value: contractInfo.billList[i].info },
      { name: "单价", value: contractInfo.billList[i].basicPrice },
      { name: "金额", value: contractInfo.billList[i].prices + "元" },
    ]);
  }

  for (let i = 0; i < contractInfo.depositList.length; i++) {
    depositList_d.push([
      { name: "描述", value: contractInfo.depositList[i].info },
      { name: "金额", value: contractInfo.depositList[i].money },
    ]);
  }

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_code: processCode,
      originator_user_id: gu_id,
      dept_id: dep,
      form_component_values: [
        { name: "乙方", value: contractInfo.part_B },
        { name: "合同面积", value: contractInfo.contractRoomArea + "平方" },
        { name: "房源", value: roomListText },
        { name: "基础单价", value: contractInfo.basicPrice + "元/平方/天" },
        { name: "押金", value: depositList_d },
        { name: "周期", value: billList_d },
      ],
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      result = myJson;
    });
  return result;
};
//发起重命名审批
dingApi.renamePart_B = async function (
  contractData,
  newPartB,
  person,
  uid,
  depid
) {
  let processCode = "PROC-1212121212121212";
  let gu_id = uid;
  let token_back = await dingApi.getAccessToken();
  let token = "";

  console.info(contractData, newPartB);
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/create?" +
    "access_token=" +
    token;
  console.info(
    contractData.part_B,
    newPartB,
    contractData.contractBeginDate,
    contractData.contractEndDate,
    contractData.contractArea,
    contractData.building + contractData.room
  );
  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_code: processCode,
      originator_user_id: gu_id,
      dept_id: depid,
      form_component_values: [
        { name: "原乙方", value: contractData.part_B },
        { name: "新乙方", value: newPartB },
        { name: "合同起始", value: contractData.contractBeginDate },
        { name: "合同结束", value: contractData.contractEndDate },
        { name: "合同面积", value: contractData.contractArea },
        { name: "房源", value: contractData.building + contractData.room },
      ],
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      result = myJson;
    });
  return result;
};

//退租审批
dingApi.stopContract = async function (
  contractData,
  contractStopDate,
  payDeposit,
  stopInfo,
  person,
  uid,
  depid
) {
  let processCode = "PROC-121212121212";
  let gu_id = uid;
  let token_back = await dingApi.getAccessToken();
  let token = "";

  console.info(contractData, contractStopDate, payDeposit, stopInfo, person);
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/create?" +
    "access_token=" +
    token;
  let contractDes =
    contractData.building +
    "的租户:" +
    contractData.part_B +
    "提出退租审请。" +
    "租赁房源：" +
    contractData.room +
    "，合同面积" +
    contractData.contractArea +
    "，合同起止日：" +
    contractData.contractBeginDate +
    "~" +
    contractData.contractEndDate +
    "。合同ID" +
    contractData.contractId;

  await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_code: processCode,
      originator_user_id: gu_id,
      dept_id: depid,
      form_component_values: [
        { name: "租赁情况", value: contractDes },
        { name: "退租日期", value: contractStopDate },
        { name: "退还押金", value: payDeposit },
        { name: "退租信息", value: stopInfo },
      ],
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      console.info(myJson);
      result = myJson;
    });
  return result;
};

//检查有没有合同有实例申请
dingApi.checkallProcessinstanceIsFinished = function () {
  let sql =
    "select contractId,part_B,dingding,dingType from rent_contract where dingding !=''";
  db.query(sql, (err, result) => {
    result.forEach((item) => {
      console.info("审批进程:", item);
      switch (item.dingType) {
        case 0:
          break;
        case 1:
          dingApi.checkProcessinstance(item.dingding, item.contractId);
          break;
        case 2:
          dingApi.checkRenameinstance(item.dingding, item.contractId);
          break;
        case 3:
          dingApi.checkLeaveInstance(item.dingding, item.contractId);
          break;
      }
    });
  });
  let sql2 = "select * from rent_bill where dingId !=''";
  db.query(sql2, (err, result) => {
    result.forEach((item) => {
      setTimeout(() => {
        dingApi.checkBillInstance(item.dingId, item.id);
      }, 60);
    });
  });
};

dingApi.checkBillInstance = async function (dingId, billId) {
  let token_back = await dingApi.getAccessToken();
  let token = "";
  let result;
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/get?access_token=" +
    token;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_instance_id: dingId,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      /*RUNNING TERMINATED COMPLETED*/
      let status = myJson.process_instance.status;
      /*agree 和 refuse*/
      let result = myJson.process_instance.result;
      //console.info(myJson.process_instance);
      if (status == "COMPLETED" && result == "agree") {
        let paidMoney = myJson.process_instance.form_component_values[1].value;

        let isPaid = myJson.process_instance.form_component_values[2].value;
        let txt = myJson.process_instance.form_component_values[0].value;
        let sql =
          "update rent_bill set  dingId = '',paid=" +
          paidMoney +
          ",isPaid=" +
          isPaid +
          ",paidDate='" +
          moment().format("YYYY-MM-DD") +
          "' where dingId ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批通过自动更改账号状态");
            dingApi.sendPayMessage(txt + paidMoney + "元");
            console.info("修改成功");
          }
        });
        console.info("agree");
      }
      if (result == "refuse" || status == "TERMINATED") {
        let sql =
          "update rent_bill set dingId = '' where dingId ='" + dingId + "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批未通过取消dingId");
            console.info("修改成功");
          }
        });
      }
    });
};
//检测重命名实例
dingApi.checkRenameinstance = async function (dingId, contractId) {
  let token_back = await dingApi.getAccessToken();
  let token = "";

  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/get?access_token=" +
    token;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_instance_id: dingId,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      /*RUNNING TERMINATED COMPLETED*/
      console.info(myJson);
      let status = myJson.process_instance.status;
      /*agree 和 refuse*/
      let result = myJson.process_instance.result;
      let newName = STR.replace(
        myJson.process_instance.form_component_values[1].value
      );
      if (status == "COMPLETED" && result == "agree") {
        let sql =
          "update rent_contract set part_B='" +
          newName +
          "', dingding = '',dingType=0,isFinished=0 where dingding ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批通过自动更改乙方名称");
            console.info("修改成功");
          }
        });
        console.info("agree");
      }
      if (result == "refuse" || status == "TERMINATED") {
        let sql =
          "update rent_contract set  dingding = '',dingType=0,isFinished=0 where dingding ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批没通过不更改乙方名称");
          }
        });
      }
    });
};
/*检测合同实例  */
dingApi.checkProcessinstance = async function (dingId, contractId) {
  let token_back = await dingApi.getAccessToken();
  let token = "";
  let result;
  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/get?access_token=" +
    token;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_instance_id: dingId,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      /*RUNNING TERMINATED COMPLETED*/
      let status = myJson.process_instance.status;
      /*agree 和 refuse*/
      let result = myJson.process_instance.result;
      //console.info(myJson.process_instance);
      if (status == "COMPLETED" && result == "agree") {
        let sql =
          "update rent_contract set dingding = '',dingType=0,isFinished=0 where dingding ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批通过自动更改合同状态");
            console.info("修改成功");
          }
        });
        console.info("agree");
      }
      if (result == "refuse" || status == "TERMINATED") {
        let sql =
          "update rent_contract set dingding = '',dingType=0,isFinished=-1 where dingding ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "审批未通过设置合同状态为-1");
            console.info("修改成功");
          }
        });

        console.info("wrong");
      }
    });
};
/*检查退租实例 */
dingApi.checkLeaveInstance = async function (dingId, contractId) {
  let token_back = await dingApi.getAccessToken();
  let token = "";

  if (token_back.errcode) {
    /*如果有错误 */
    return token_back;
  } else {
    /*如果没错误 */
    token = token_back.access_token;
  }
  let url =
    "https://oapi.dingtalk.com/topapi/processinstance/get?access_token=" +
    token;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      process_instance_id: dingId,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (myJson) {
      /*RUNNING TERMINATED COMPLETED*/
      console.info(myJson);

      let status = myJson.process_instance.status;
      /*agree 和 refuse*/

      let result = myJson.process_instance.result;
      let stopDate = myJson.process_instance.form_component_values[1].value;
      let payDeposit = myJson.process_instance.form_component_values[2].value;
      console.info(stopDate, payDeposit);
      if (status == "COMPLETED" && result == "agree") {
        let sql =
          "update rent_contract set endDate='" +
          stopDate +
          "', dingding = '',dingType=0,isFinished=1 where  dingding ='" +
          dingId +
          "';update rent_bill set isPaid=2 where contract_id=" +
          contractId +
          " and beginDate>'" +
          stopDate +
          "';insert into rent_bill(contract_id,info,type,beginDate,endDate,money,isPaid) values(" +
          contractId +
          ",'退押金'" +
          ",-1,'" +
          stopDate +
          "','" +
          stopDate +
          "'," +
          payDeposit +
          ",0);";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(
              sql,
              "服务器后台",
              "审批通过自动更改enddate isFinished bill paid 增加退押金账单"
            );
            console.info("修改成功");
          }
        });
        console.info("agree");
      }
      if (result == "refuse" || status == "TERMINATED") {
        let sql =
          "update rent_contract set  dingding = '',dingType=0,isFinished=0 where dingding ='" +
          dingId +
          "'";
        db.query(sql, (err) => {
          if (err) {
            console.info(err);
          } else {
            db.saveSql(sql, "服务器后台", "退租审批未通过");
          }
        });
      }
    });
};
module.exports = dingApi;
