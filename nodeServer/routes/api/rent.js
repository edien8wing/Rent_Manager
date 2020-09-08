var db = require("../../bin/db.js");
var logg = require("../../bin/log4js.js");
var STR = require("../../bin/STR.js");
var dingApi = require("../../bin/dingApi");
var moment = require("moment");
const FileCreater = require("./FileCreater.js");
var rent = {};

rent.fun = function (req, res, next) {
  logg.info(req.body);
  switch (req.body.fun) {
    case "allBuilding":
      rent.allBuilding(req, res, next);
      break;

    case "getRoombyBuildingId":
      rent.getRoombyBuildingId(req, res, next);
      break;

    case "getContractByBuildingId":
      rent.getContractByBuildingId(req, res, next);
      break;

    case "getBillByBuildingId":
      rent.getBillByBuildingId(req, res, next);
      break;

    case "getFloorByBuildingId":
      rent.getFloorByBuildingId(req, res, next);
      break;

    case "getRoomByFloorId":
      rent.getRoomByFloorId(req, res, next);
      break;

    case "renameFloor":
      rent.renameFloor(req, res, next);
      break;

    case "addFloor":
      rent.addFloor(req, res, next);
      break;

    case "renameRoom":
      rent.renameRoom(req, res, next);
      break;

    case "changeRoomArea":
      rent.changeRoomArea(req, res, next);
      break;

    case "addRoom":
      rent.addRoom(req, res, next);
      break;

    case "getContractData":
      rent.getContractData(req, res, next);
      break;

    case "addContract":
      rent.addContract(req, res, next);
      break;
    case "payBill":
      rent.payBill(req, res, next);
      break;
    case "renamePart_B":
      rent.renamePart_B(req, res, next);
      break;
    case "getBIByBuildingId":
      rent.getBIByBuildingId(req, res, next);
      break;
    case "stopContract":
      rent.stopContract(req, res, next);
      break;

    default:
      logg.error("no function found");
      break;
  }
};

rent.allBuilding = function (req, res, next) {
  try {
    var sql = " select  * from rent_building";
    console.info(sql);
    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
      //  var _data = { email: 'example@163.com', name: 'jaxu' };
      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.getRoombyBuildingId = function (req, res, next) {
  try {
    let buildingList = JSON.parse(req.body.data);
    let order = req.body.o;
    console.info(buildingList.length);
    let sql =
      "\
select r.id, \
 r.name,\
	 f.name as floor, \
    f.id as floorId, \
    b.name as building, \
	   r.area, \
		 i.part_B as part_B,  \
		 i.contractId as contractId, \
		 		  DATE_FORMAT(i.endDate,'%Y-%m-%d') as endDate, \
		   DATE_FORMAT(i.beginDate,'%Y-%m-%d') as beginDate, \
			  i.isFinished\
		  from rent_room as r \
left join rent_floor as f on f.id=r.floor \
left join \
(select * from rent_contract_room as cr left join rent_contract as c on cr.contract_Id=c.contractId where c.isFinished in (0,1,2) and  c.endDate>=Date(now())) \
as i on i.room_Id= r.id \
left join rent_building as b on b.id=f.rent_building_id \
";
    if (buildingList.length > 0) {
      let range = req.body.data.replace("[", "(").replace("]", ")");
      sql += "where ";
      sql += " f.rent_building_id in";
      sql += range;
    }
    if (order == 1) {
      sql += " order by r.name asc";
    } else if (order == 0) {
      sql += " order by endDate desc";
    }

    // console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
      //  var _data = { email: 'example@163.com', name: 'jaxu' };
      //console.info('结果'+json);
      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};
/*获取账单信息 */
rent.getContractByBuildingId = function (req, res, next) {
  try {
    let buildingList = JSON.parse(req.body.data);
    let isFinished = JSON.parse(req.body.isFinished);

    var sql =
      "select distinct\
    c.contractId as id ,\
c.`area`,   \
 c.part_B,    \
 DATE_FORMAT(c.beginDate,'%Y-%m-%d') as beginDate,    \
 Date_FORMAT(c.endDate,'%Y-%m-%d') as endDate,   \
      c.isFinished ,\
   group_concat(r.name) as room,\
   b.name as building,    \
   f.id as floorId \
 from rent_contract as `c`     \
 left join rent_contract_room  \
     as cr on c.contractId=cr.contract_Id          \
 left join rent_room as r on r.id=cr.room_Id     \
 left join rent_floor as f on r.floor=f.id     \
 left join rent_building as b on b.id=f.rent_building_id    \
 where 0=0 \
     ";

    if (buildingList.length > 0) {
      let range = req.body.data.replace("[", "(").replace("]", ")");
      sql += "and ";
      sql += " b.id in";
      sql += range;
    }
    sql += " and (1>2 ";
    if (isFinished.length > 0) {
      //console.info(isFinished[0]);

      // let range = req.body.isFinished.replace("[", "(").replace("]", ")");
      /*0履行的合同 1完结的合同 2 审批中 -1拒绝 */
      /*
    console.info(isFinished.indexOf(0));
    console.info(isFinished.indexOf(1));
    console.info(isFinished.indexOf(2));
    console.info(isFinished.indexOf(-1));
    */
      if (isFinished.indexOf(0) + 1) {
        sql += " or (c.endDate>=Date(NOW()) and c.isFinished in(0,1)) ";
      }
      if (isFinished.indexOf(1) + 1) {
        sql += " or (c.endDate<=Date(NOW()) and c.isFinished in(0,1)) ";
      }
      if (isFinished.indexOf(2) + 1) {
        sql += " or c.isFinished =2 ";
      }
      if (isFinished.indexOf(-1) + 1) {
        sql += " or c.isFinished=-1";
      }
    }
    sql += ") group by id";
    //console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
      //  var _data = { email: 'example@163.com', name: 'jaxu' };
      //console.info('结果'+json);
      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error;
  }
};

rent.getBillByBuildingId = function (req, res, next) {
  try {
    // console.info("getBillByBuildingId load");
    //建筑列表
    let buildingList = JSON.parse(req.body.data);

    //本期账单是否已支付
    let isPaid = JSON.parse(req.body.isPaidBill);

    //本合同是否还在履行
    let contractIsFinished = JSON.parse(req.body.contractIsFinished);

    let sDate = req.body.sDate;
    let eDate = req.body.eDate;
    if (sDate == "") {
      console.info("^^^^^^^^^^^", sDate, eDate);
    }
    /**
     * id,
     * area,
     * floor,
     * building,
     * part_B,
     * DATE_FORMAT(cc.endDate,'%Y-%m-%d')  endDate
     *
     */
    var sql =
      "select \
      bill.id as billId,\
      \
      bill.info,\
      c.part_B,\
      c.area,\
      c.contractId,\
      c.isFinished,\
      bill.type,\
      bill.money,\
      bill.paid,\
      bill.isPaid,\
      DATE_FORMAT(bill.beginDate ,'%Y-%m-%d') as billBeginDate,\
      DATE_FORMAT(bill.endDate,'%Y-%m-%d') as billEndDate,\
      group_concat(r.name) as room,\
      b.name as building\
       from rent_bill as bill\
      left join rent_contract as c on c.contractId=bill.contract_id \
      left join rent_contract_room as cr on cr.contract_Id=bill.contract_id\
      left join rent_room as r on r.id=cr.room_Id\
      left join rent_floor as f on r.floor=f.id\
      left join rent_building as b on b.id=f.rent_building_id\
      where 0=0 \
 \
      \
       ";

    if (buildingList.length > 0) {
      let range = req.body.data.replace("[", "(").replace("]", ")");
      sql += "and ";
      sql += " b.id in";
      sql += range;
    }
    if (contractIsFinished.length > 0) {
      sql += " and (1>2 ";

      //console.info(isFinished[0]);

      // let range = req.body.isFinished.replace("[", "(").replace("]", ")");
      /*0履行的合同 1完结的合同 2 审批中 -1拒绝 */
      /*
      console.info(contractIsFinished.indexOf(0));
      console.info(contractIsFinished.indexOf(1));
      console.info(contractIsFinished.indexOf(2));
      console.info(contractIsFinished.indexOf(-1));
      */
      if (contractIsFinished.indexOf(0) + 1) {
        sql += " or (c.endDate>=Date(NOW()) and c.isFinished in(0,1)) ";
      }
      if (contractIsFinished.indexOf(1) + 1) {
        sql += " or (c.endDate<=Date(NOW()) and c.isFinished in(0,1)) ";
      }
      if (contractIsFinished.indexOf(2) + 1) {
        sql += " or c.isFinished =2 ";
      }
      if (contractIsFinished.indexOf(-1) + 1) {
        sql += " or c.isFinished=-1";
      }

      sql += " ) ";
    }
    if (isPaid.length > 0) {
      let range = req.body.isPaidBill.replace("[", "(").replace("]", ")");
      sql += "and ";
      sql += " bill.isPaid in";
      sql += range;
    }
    if ((sDate != "") & (eDate != "")) {
      sql += " and ";
      sql += "bill.beginDate>=";
      sql += sDate;

      sql += " and ";
      sql += "bill.beginDate<=";
      sql += eDate;
    }
    sql += " group by billId order by bill.beginDate asc";
    //console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
      //  var _data = { email: 'example@163.com', name: 'jaxu' };
      //console.info('结果'+json);
      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.getFloorByBuildingId = function (req, res, next) {
  try {
    let buildingId = JSON.parse(req.body.buildingId);
    console.info(buildingId);
    var sql =
      "select f.id,f.name,sum(r.area) as area from rent_floor as f \
  left join  rent_room as r on r.floor= f.id  \
  where f.rent_building_id=";
    sql += buildingId;
    sql += " group by f.id order by f.id asc";

    console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.getRoomByFloorId = function (req, res, next) {
  try {
    let floorId = JSON.parse(req.body.floorId);
    console.info(floorId);
    var sql =
      "select * from rent_room as r where r.isDelete = '0' and r.`floor`=";
    sql += floorId;

    console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

//将floorid rename成新text
rent.renameFloor = function (req, res, next) {
  try {
    let floorId = JSON.parse(req.body.floorId);
    let floorText = JSON.parse(req.body.floorText);
    let buildingId = JSON.parse(req.body.buildingId);
    var sql = "update rent_floor as f set f.name='";
    sql += floorText;
    sql += "' where f.id=";
    sql += floorId;
    sql += ";select * from rent_floor as f where f.rent_building_id=";
    sql += buildingId;
    sql += " order by f.id asc";
    console.info(sql);

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "楼层更名");
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

//
rent.addFloor = function (req, res, next) {
  try {
    let buildingId = JSON.parse(req.body.buildingId);
    let floorText = JSON.parse(req.body.floorText);

    var sql = "insert into rent_floor(rent_building_id,name) values('";
    sql += buildingId;
    sql += "','";
    sql += floorText;
    sql += "');select * from rent_floor as f where f.rent_building_id=";
    sql += buildingId;
    sql += " order by f.id asc";
    console.info(sql);

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "插入楼层");
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

//Room rename成新text
rent.renameRoom = function (req, res, next) {
  try {
    let roomId = JSON.parse(req.body.roomId);
    let roomText = JSON.parse(req.body.roomText);
    let floorId = JSON.parse(req.body.floorId);
    var sql = "update rent_room as r set r.name='";
    sql += roomText;
    sql += "' where r.id=";
    sql += roomId;
    sql += ";select * from rent_room as r where r.floor=";
    sql += floorId;
    // console.info(sql);

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "房源更名");
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.changeRoomArea = function (req, res, next) {
  try {
    let roomId = JSON.parse(req.body.roomId);
    let roomArea = JSON.parse(req.body.roomArea);
    let floorId = JSON.parse(req.body.floorId);
    var sql = "update rent_room as r set r.area='";
    sql += roomArea;
    sql += "' where r.id=";
    sql += roomId;
    sql += ";select * from rent_room as r where r.floor=";
    sql += floorId;
    console.info(sql);

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "更新房源面积");
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.addRoom = function (req, res, next) {
  try {
    let floorId = JSON.parse(req.body.floorId);
    let roomText = JSON.parse(req.body.roomText);
    let roomArea = JSON.parse(req.body.roomArea);
    var sql = "insert into rent_room(`floor`,name,`area`) values('";
    sql += floorId;
    sql += "','";
    sql += roomText;
    sql += "','";
    sql += roomArea;
    sql += "');select * from rent_room as r where r.floor=";
    sql += floorId;

    console.info(sql);

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "增加房源");
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};
//
rent.getContractData = function (req, res, next) {
  try {
    let contractId = JSON.parse(req.body.contractId);

    let sql =
      "\
select c.contractId as id,\
c.contractName,\
c.`area`,\
c.part_B,\
c.contractCODE,\
DATE_FORMAT(c.beginDate,'%Y-%m-%d') as beginDate,\
DATE_FORMAT(c.endDate,'%Y-%m-%d') as endDate,\
c.isFinished, \
c.dingding, \
c.dingType \
from rent_contract as c where contractId=" +
      contractId +
      ";\
\
select  cr.contract_Id as contractId,\
b.name as building,           \
b.`location` as `location`,\
b.code as code,\
group_concat(r.id) as roomId,         \
group_concat(r.name) as room,\
sum(r.area) as roomSumArea \
from rent_contract_room as cr \
left join rent_room as r on r.id=cr.room_Id        \
left join rent_floor as f on f.id=r.floor          \
left join rent_building as b on \
b.id=f.rent_building_id               \
where cr.contract_id=" +
      contractId +
      " \
group by cr.contract_Id;\
\
select \
rb.id,\
rb.info,\
rb.type,\
rb.rate,\
rb.basicPrices,\
rb.dingId,\
DATE_FORMAT(rb.beginDate,'%Y-%m-%d') as billBeginDate,\
DATE_FORMAT(rb.endDate,'%Y-%m-%d') as billEndDate,\
DATE_FORMAT(rb.paidDate,'%Y-%m-%d') as billPaidDate,\
rb.money,\
rb.paid,\
rb.isPaid \
from  rent_bill as rb \
where rb.contract_id=" +
      contractId +
      " order by rb.beginDate asc ,rb.id asc";

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};
/*添加合同*/
rent.addContract = function (req, res, next) {
  try {
    console.info(req.body);
    let contractInfo = JSON.parse(req.body.contractInfo);
    /*1.添加到rent_contract */
    let contractEndDate =
      contractInfo.billList[contractInfo.billList.length - 1].endDate;
    let sql =
      "insert into rent_contract(contractName,part_B,area,beginDate,endDate,isFinished)\
  values('" +
      contractInfo.contractName +
      "','" +
      contractInfo.part_B +
      "'," +
      contractInfo.contractRoomArea +
      ",'" +
      contractInfo.contractStartDate +
      "','" +
      contractEndDate +
      "',2) ";

    db.insert(sql, async function (err, insertId) {
      db.saveSql(sql, req.body.person, "增加合同");
      if (err) {
      } else {
        /*添加房源关联*/
        let insertRoomSql = "";
        for (let i = 0; i < contractInfo.roomList.length; i++) {
          insertRoomSql +=
            "insert into rent_contract_room(contract_Id,room_Id)\
      values(" +
            insertId +
            "," +
            contractInfo.roomList[i].id +
            ");";
        }
        console.info(insertRoomSql);
        db.insert2(insertRoomSql);
        db.saveSql(insertRoomSql, req.body.person, "增加合同关联房源");
        /* 添加租金 */
        let insertBill = "";
        for (let i = 0; i < contractInfo.depositList.length; i++) {
          insertBill +=
            "insert into rent_bill(\
            contract_id,\
            info,\
            type,\
            beginDate,\
            endDate,\
            money,\
            isPaid) values(" +
            insertId +
            ",'" +
            contractInfo.depositList[i].info +
            "'," +
            contractInfo.depositList[i].type +
            ",'" +
            contractInfo.depositList[i].date +
            "','" +
            contractInfo.depositList[i].date +
            "'," +
            contractInfo.depositList[i].money +
            ",0);";
        }

        for (let i = 0; i < contractInfo.billList.length; i++) {
          insertBill +=
            "insert into rent_bill(\
          contract_id,\
          info,\
          type,\
          beginDate,\
          endDate,\
          rate,\
          basicPrices,\
          money,\
          isPaid\
          ) values(" +
            insertId +
            ",'" +
            contractInfo.billList[i].info +
            "'," +
            contractInfo.billList[i].type +
            ",'" +
            contractInfo.billList[i].startDate +
            "','" +
            contractInfo.billList[i].endDate +
            "'," +
            contractInfo.billList[i].addRate +
            "," +
            contractInfo.billList[i].basicPrice +
            "," +
            contractInfo.billList[i].prices +
            ",0);";
        }
        console.info("添加bill", insertBill);
        db.insert2(insertBill);
        db.saveSql(insertBill, req.body.person, "增加合同关联账单");
        //发送钉钉合同审批
        let result = await dingApi.createProcessinstance(
          contractInfo,
          req.body.person,
          req.body.dingId,
          req.body.depId
        );

        //console.info("getresult1111", result);
        let json;

        if (result.errcode) {
          json = JSON.stringify({ result });
        } else {
          let process_instance_id = result.process_instance_id;
          let sql =
            "update rent_contract set rent_contract.dingding='" +
            process_instance_id +
            "', rent_contract.dingType =1" +
            " where rent_contract.contractId=" +
            insertId;
          db.query(sql, (err, rows, fields) => {
            db.saveSql(sql, req.body.person, "更新钉钉实例id");
            console.info(err);
          });
        }

        res.type("application/json");

        res.jsonp(json);
      }
    });
  } catch (exception) {
    logg.error(exception);
  }
};

rent.payBill = async function (req, res, next) {
  let json = JSON.parse(req.body.data);
  let contractData = json.contractData;
  let billData = json.billData;
  let totalPaid = json.totalPaid;
  let isPaid = json.isFinished;
  let uid = req.body.dingId;
  let depId = req.body.depId;
  let user = req.body.person;
  let result = await dingApi.createBillInstace(
    user,
    uid,
    depId,
    contractData,
    billData,
    totalPaid,
    isPaid
  );

  //console.info("getresult1111", result);

  let json2 = "{type:0,data:'success'}";
  let process_instance_id = result.process_instance_id;
  let sql =
    "update rent_bill set rent_bill.dingId='" +
    process_instance_id +
    "' where rent_bill.id=" +
    billData.id;
  db.query(sql, (err, rows, fields) => {
    db.saveSql(sql, req.body.user, "更新钉钉实例id");
    console.info(err);
  });

  res.type("application/json");

  res.jsonp(json2);

  /*
  try {
    //console.info(req.body.data);
    let json = JSON.parse(req.body.data);
    let contractData = json.contractData;
    let billData = json.billData;
    let totalPaid = json.totalPaid;
    let isPaid = json.isFinished;
    let sql =
      "update rent_bill set paid = " +
      totalPaid +
      ",isPaid=" +
      isPaid +
      ",paidDate='" +
      moment().format() +
      "' where id= " +
      billData.id;

    db.query(sql, function (err, result) {
      db.saveSql(sql, req.body.person, "更新账单");
      //logg.error(result);
      let json;
      //  logg.error(result[i]);
      if (err) {
        json = JSON.stringify({
          type: 1,
          data: err,
        });
      } else {
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
          "元,本次支付后合计" +
          totalPaid +
          "元";
        if (billData.money != 0) {
          dingApi.sendPayMessage(text);
        }
        json = JSON.stringify({
          type: 0,
          data: "更新成功",
        });
      }

      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
  */
};

//更名
rent.renamePart_B = async function (req, res, next) {
  try {
    let newPartB = req.body.newPartB;
    let contractData = JSON.parse(req.body.contractData);

    let result = await dingApi.renamePart_B(
      contractData,
      newPartB,
      req.body.person,
      req.body.dingId,
      req.body.depId
    );
    let json;

    if (result.errcode) {
      json = JSON.stringify({ result });
    } else {
      let process_instance_id = result.process_instance_id;
      let sql =
        "update rent_contract set rent_contract.dingding='" +
        process_instance_id +
        "', dingType=2 where rent_contract.contractId=" +
        contractData.contractId;
      db.query(sql, (err, rows, fields) => {
        db.saveSql(sql, req.body.person, "发起更名审批");
      });
      json = result;
    }
    res.type("application/json");

    res.jsonp(json);
  } catch (exception) {
    logg.error(exception);
  }
};
/*关闭中止任务请求 */

rent.stopContract = async function (req, res, next) {
  try {
    let contractData = JSON.parse(req.body.contractData);
    let contractStopDate = req.body.contractStopDate;
    let payDeposit = req.body.payDeposit;
    let stopInfo = req.body.stopInfo;
    console.info(
      contractData,
      contractStopDate,
      payDeposit,
      stopInfo,
      req.body.person,
      req.body.dingId,
      req.body.depId
    );

    let result = await dingApi.stopContract(
      contractData,
      contractStopDate,
      payDeposit,
      stopInfo,
      req.body.person,
      req.body.dingId,
      req.body.depId
    );
    let json;

    if (result.errcode) {
      json = JSON.stringify({ result });
    } else {
      let process_instance_id = result.process_instance_id;
      let sql =
        "update rent_contract set rent_contract.dingding='" +
        process_instance_id +
        "', dingType=3 where rent_contract.contractId=" +
        contractData.contractId;
      db.query(sql, (err, rows, fields) => {
        db.saveSql(sql, req.body.person, "发起退租审批");
      });
      json = result;
    }
    res.type("application/json");

    res.jsonp(json);
  } catch (exception) {
    logg.error(expception);
  }
};

/*获取BI数据v */
rent.getBIByBuildingId = function (req, res, next) {
  try {
    console.info(req.body);
    //建筑列表
    let buildingList = req.body.data;

    let sDate = req.body.sDate;
    let eDate = req.body.eDate;
    let range;
    /*已付*/
    let sql =
      "select concat (year(temp.beginDate),'年',month(temp.beginDate),'月') as `month`,sum(money) as money from( \
      select distinct rb.beginDate as beginDate, money ,rb.id \
    from rent_bill as rb      \
     left join rent_contract as rc on rc.contractId=rb.contract_id     \
     left join rent_contract_room as rcr on rcr.contract_Id=rc.contractId    \
      left join rent_room as rr on rr.id=rcr.room_Id    \
        left join rent_floor as rf on rf.id=rr.floor    \
         left join rent_building as b on b.id=rf.rent_building_id     \
     where rb.beginDate>=" +
      sDate +
      " and rb.beginDate<=" +
      eDate;
    if (JSON.parse(buildingList).length > 0) {
      console.info("buildingList", buildingList, buildingList.length);
      range = buildingList.replace("[", "(").replace("]", ")");
      sql += " and b.id in";
      sql += range;
    }
    sql +=
      "and rc.isFinished in(0,1) and rb.isPaid in (0,1) and rb.type in(1,2))  \
     as temp group by month asc  order by temp.beginDate asc; \
    ";
    /*应付 */
    sql +=
      "select  concat (year(temp2.beginDate),'年',month(temp2.beginDate),'月') as `month`,sum(money) as money from ( \
       select distinct rb.beginDate as beginDate,money as money \
       from rent_bill as rb    \
         left join rent_contract as rc on rc.contractId=rb.contract_id   \
       left join rent_contract_room as rcr on rcr.contract_Id=rc.contractId    \
        left join rent_room as rr on rr.id=rcr.room_Id   \
           left join rent_floor as rf on rf.id=rr.floor  \
        left join rent_building as b on b.id=rf.rent_building_id    \
          where rb.beginDate>=" +
      sDate +
      "   and rb.beginDate<=" +
      eDate;
    if (JSON.parse(buildingList).length > 0) {
      console.info("buildingList", buildingList, buildingList.length);
      range = buildingList.replace("[", "(").replace("]", ")");
      sql += " and b.id in";
      sql += range;
    }
    sql +=
      " and rc.isFinished in(1,0) and rb.isPaid in (1) and rb.type in(1,2)) \
  as temp2 group by month  order by temp2.beginDate asc;\
      ";
    console.info(sql);

    db.query(sql, function (err, result) {
      //logg.error(result);
      var json;
      //  logg.error(result[i]);
      if (result != null) {
        json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      } else {
        json = JSON.stringify({
          type: 0,
          code: "err",
        });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
      //  var _data = { email: 'example@163.com', name: 'jaxu' };
      //console.info('结果'+json);
      res.type("application/json");

      res.jsonp(json);
    });
  } catch (exception) {
    logg.error(exception);
  }
};

module.exports = rent;
