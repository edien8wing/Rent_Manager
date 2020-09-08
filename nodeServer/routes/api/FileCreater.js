var db = require("../../bin/db.js");
var JSZip = require("pizzip");
var Docxtemplater = require("docxtemplater");
var fs = require("fs");
var path = require("path");
var moment = require("moment");
const STR = require("../../../web/src/bin/STR.js");

var FileCreater = {};

FileCreater.fun = function (req, res, next) {
  switch (req.body.fun) {
    case "getBillDoc":
      FileCreater.getBillDoc(req, res, next);
      break;
    case "getBuildingContract":
      FileCreater.getBuildingContract(req, res, next);
      break;
    case "getBillListDoc":
      FileCreater.getBillListDoc(req, res, next);
      break;
  }
};

FileCreater.getDocfilebymode = function (tempFile, data, res) {
  console.info(data);
  var content = fs.readFileSync(tempFile, "binary"); //你的模板文件
  //console.info(content);
  var zip = new JSZip(content);
  var doc = new Docxtemplater(zip);

  /* 替换列表
  清单
     contractId: 1,
     contractArea: 0,
     contractCODE: null,
     contractName: '一份合同',
     part_B: '星光公司',
     contractIsFinished: 1,
     contractBeginDate: '2020-06-09',
     contractEndDate: '2020-06-09',
     building: '1111111212',
     room: '101,101',
     roomSumArea: 161 
     id: 1,
     info: '租金',
     billBeginDate: '1900-01-01',
     billEndDate: '2021-01-01',
     billPaidDate: '0000-00-00',
     money: 1000.01,
     paid: 1000.01,
     isPaid: 1 
  */

  /**/
  doc.setData(data);
  doc.render();
  var buf = doc.getZip().generate({ type: "nodebuffer" });

  res.writeHead(200, {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-disposition": "attachment; filename=" + "download.docx",
  });

  res.end(buf);
};

/*浏览器端用AJAX.getFile接收 */
/*账单*/
FileCreater.getBillDoc = function (req, res, next) {
  let data = JSON.parse(req.body.data);
  console.info(data);
  let tempFile = path.resolve("./Template", "bill.docx");

  FileCreater.getDocfilebymode(
    tempFile,
    Object.assign(
      data.contractData,
      data.item,
      {
        dx: STR.DX(data.item.money),
      },
      { toDay: moment().format("YYYY-MM-DD") }
    ),
    res
  );
};

/*账单合集*/
FileCreater.getBillListDoc = function (req, res, next) {
  /*
billArray:[
billId:12
area: 135.74
billBeginDate: "2021-01-17"
billEndDate: "2021-04-16"
billId: 496
building: "12121212"
contractId: 100
info: "租金"
isFinished: 0
isPaid: 0
money: 24772.55
paid: 0
part_B: "测试公司"
room: "	316	"
type: 1
]
*/
  let finalBillList = { billArray: [] };
  let billList = JSON.parse(req.body.data);
  console.info("billList.length", billList.length);
  for (let i = 0; i < billList.length; i++) {
    let temp = Object.assign(
      {
        id: billList[i].billId,
        part_B: billList[i].part_B,
        building: billList[i].building,
        room: billList[i].room,
        roomSumArea: billList[i].area,
        billBeginDate: billList[i].billBeginDate,
        billEndDate: billList[i].billEndDate,
        info: billList[i].info,
        money: billList[i].money,
      },
      { dx: STR.DX(billList[i].money) },
      { toDay: moment().format("YYYY-MM-DD") }
    );
    finalBillList.billArray.push(temp);
  }
  console.info("finalBillList", finalBillList);
  let tempFile = path.resolve("./Template", "billList.docx");

  FileCreater.getDocfilebymode(tempFile, finalBillList, res);
};
/*合同*/
FileCreater.getBuildingContract = function (req, res, next) {
  let data = JSON.parse(req.body.data);
  let mouldType = req.body.mouldType;
  //console.info(mouldType);
  console.info("获取的数据打印一下:", data);
  let tempFile = path.resolve("./Template", mouldType + ".docx");
  let depositList = [];
  let depositPrices = 0;
  let freeList = [];
  let addRateList = [];
  let contractBasicPrices = 0;
  for (let i = 0; i < data.billData.length; i++) {
    if (data.billData[i].type == 0) {
      freeList.push(data.billData[i]);
    }
    if (data.billData[i].type == 1) {
    }
    if (data.billData[i].type == 2) {
      depositList.push(data.billData[i]);
      depositPrices += data.billData[i].money;
    }
    if (data.billData[i].rate > 0) {
      addRateList.push(data.billData[i]);
    }
    if (contractBasicPrices == 0) {
      contractBasicPrices = data.billData[i].basicPrices;
    }
  }
  data1 = {
    contractCode: data.contractData.contractCODE,

    contractId: data.contractData.contractId,
    part_B: data.contractData.part_B,
    location: data.contractData.location,
    building: data.contractData.building,
    room: data.contractData.room,
    contractArea: data.contractData.roomSumArea,
    code: data.contractData.code,
    beginDate: data.contractData.contractBeginDate,
    endDate: data.contractData.contractEndDate,
    billList: data.billData,
    depositList: depositList,
    freeList: freeList,
    depositPrices: depositPrices.toFixed(2),
    addRateList: addRateList,
    contractBasicPrices: contractBasicPrices,
  };
  console.info(data1);
  FileCreater.getDocfilebymode(tempFile, data1, res);
};

module.exports = FileCreater;
