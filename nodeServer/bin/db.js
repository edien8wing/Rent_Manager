var logg = require("./log4js.js");
var db = {};
var mysql = require("mysql");
var moment = require("moment");
var pool = mysql.createPool({
  connectionLimit: 60,
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "guarantee",
  multipleStatements: true,
});

db.query = function (sql, callback) {
  if (!sql) {
    callback();
    return;
  }
  pool.query(sql, function (err, rows, fields) {
    logg.info(sql);
    if (err) {
      logg.error(err);
      callback(err, null);
      return;
    }

    callback(err, rows, fields);
  });
};
/*调用方法
var ans=db.query2(sql)
ans.then(
  (a)=>{console.info('success',a)},
  (a)=>{console.info('error',a)
})
*/
db.query2 = function (sql) {
  var promise = new Promise(function (resolve, reject) {
    logg.info(sql);
    pool.query(sql, function (err, rows, fields) {
      if (!err) {
        logg.error(err);
        resolve(rows);
      } else {
        reject(error);
      }
    });
  });
  return promise;
};

//插入并返回id
db.insert = function (sql, callback) {
  if (!sql) {
    callback();
    return;
  }
  //获取连接
  pool.getConnection(function (err, conn) {
    //用conn连接进行查询返回或
    conn.query(sql, function (err, result) {
      if (err) {
        throw err;
        conn.release();
        callback(err, 0);
        return;
      }
      //  console.log('resultid:'+result.insertId);
      logg.info(sql);
      callback(err, result.insertId);
      conn.release();
      return;
    });
  });
};
//then操作
db.insert2 = function (sql) {
  return new Promise(function (resolve, reject) {
    db.insert(sql, resolve);
  });
};
//获取connect链接
db.getConnect = function () {
  pool.getConnet();
};

db.saveSql = function (sql, name, info) {
  let s =
    "insert into sql_history(name,`sql`,`time`,`info`) values('" +
    name +
    "',\"" +
    sql +
    "\",'" +
    moment().format() +
    "','" +
    info +
    "')";
  db.insert2(s);
  console.info(s);
};
module.exports = db;

/*定义方法
var db = require('../../bin/db.js');



var sql = 'SELECT count(*) as count  from fix.fix';
res.writeHead(200, {"Content-Type": "application/json"});
var otherArray = ["item1", "item2"];
var otherObject = { item1: "item1val", item2: "item2val" };
var json = JSON.stringify({
  anObject: otherObject,
  anArray: otherArray,
});
res.end("success_jsonpCallback(" + json + ")");

*/
