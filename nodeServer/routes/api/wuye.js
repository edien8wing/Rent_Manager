var db = require('../../bin/db.js');
var logg =require('../../bin/log4js.js');


  var wuye    = {};

  wuye.fun = function(req, res, next){

    switch(req.body.fun){
      case 'currentFix':wuye.currentFix(req,res,next);break;
      case 'getHistoryFromId':wuye.getHistoryFromId(req,res,next);break;
      case 'addInform':wuye.addInform(req,res,next);break;
      case 'addFix':wuye.addFix(req,res,next);break;
      case 'historyFix':wuye.historyFix(req,res,next);break;
      case 'historySumNumber':wuye.historySumNumber(req,res,next);break;
      case 'historySumNumberbyDay':wuye.historySumNumberbyDay(req,res,next);break;
      default:break;
    }

  }
  wuye.currentFix=function(req,res,next){
    var sql = "SELECT * FROM guarantee.t1 where isfinished ='0' and t1.isdeleted='0' order by id desc";
    //res.writeHead(200, {"Content-Type": "application/json"});

    db.query(sql,function(err,result){
      //logg.error(result);
      var json
      //  logg.error(result[i]);
      if(result!=null){
         json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      }else{
        json = JSON.stringify({
         type: 0,
         code: "err",
       });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
    //  var _data = { email: 'example@163.com', name: 'jaxu' };
       res.type('application/json');

       res.jsonp(json);
    });
  }
  wuye.getHistoryFromId=function(req,res,next){
    var id=req.body.id;
    var sql = "select * from guarantee.t2 where t2.t1id='"+id+"' and t2.isdeleted='0' order by t2.time asc"
      //res.writeHead(200, {"Content-Type": "application/json"});

    db.query(sql,function(err,result){
      //logg.error(result);
      var json
      //  logg.error(result[i]);
      if(result!=null){
         json = JSON.stringify({
          type: 1,
          code: "",
          data: result,
        });
      }else{
        json = JSON.stringify({
         type: 0,
         code: "err",
       });
      }
      //  res.end( json );//！！一定要加配置的回调方法名
    //  var _data = { email: 'example@163.com', name: 'jaxu' };
       res.type('application/json');

       res.jsonp(json);
    });
  }
wuye.addInform=function(req,res,next){
   var json;
   var data=JSON.parse(req.body.data);
   var t1id=data.id;
   var dateTime=data.date+" "+data.time;
   var txt=data.txt;

   var type;
   if(data.isFinished){
    // console.info(data.isFinished+'true');
     type=3;
   }else{
    //  console.info(data.isFinished+'false');
     type=2;
   }
//   console.info(type);
  // console.info('组合 sql');
   var sql = "insert into t2 (t1id,`time`,info,`type`) values('"+t1id+"','"+dateTime+"','"+txt+"','"+type+"')";
  // console.info(sql);
   db.insert(sql,function(err,result){
     if(err){
      // console.info('sql错误触发错误流程');
         logg.error(err.message);
         json = JSON.stringify({
            type: 0,
            code: err.message,
         });
       } else{
           json = JSON.stringify({
              type: 1,
              code:'success',
              id:result,
           });
           if(type==3){
             var sql = "update t1 set t1.isfinished=1,t1.finishtime='"+dateTime+"' where t1.id='"+t1id+"'";
             db.insert(sql,function(err,result){

             });
           }
       }
       res.type('application/json');
       res.jsonp(json);
       return;
   });

}

wuye.addFix=function(req,res,next){
  console.info('addFix occered');
   var json;
   var data=JSON.parse(req.body.data);
   console.info(data);
   var location=data.location;
   var person=data.person;
   var problem=data.problem;
   var tel=data.tel;
   var dateTime=data.date+' '+data.time;

   var sql = "insert into t1 (isfinished,problem,person,tel,`location`,`time`) values('0','"+problem+"','"+person+"','"+tel+"','"+location+"','"+dateTime+"')";
   console.info(sql);
   db.insert(sql,function(err,result){
     if(err){
      // console.info('sql错误触发错误流程');
         logg.error(err.message);
         json = JSON.stringify({
            type: 0,
            code: err.message,
         });
         res.type('application/json');
         res.jsonp(json);
       } else{
            var sql = "insert into t2 (t1id,`time`,info,`type`) values ('"+result+"','"+
                                             dateTime+"','"+"初始报修："+problem+"','1')";
            console.info(sql);
             db.insert(sql,function(err,result){
               if(err){
                // console.info('sql错误触发错误流程');
                   logg.error(err.message);
                   json = JSON.stringify({
                      type: 0,
                      code: err.message,
                   });
                   res.type('application/json');
                   res.jsonp(json);
                 } else{
                  json = JSON.stringify({
                      type: 1,
                      code:'success',
                 });
                 res.type('application/json');
                 res.jsonp(json);
               }
             });
           }
       });
}
wuye.historyFix=function(req,res,next){
  var json = JSON.parse(req.body.data);
  //var sql = "SELECT * FROM guarantee.t1 where isfinished ='1' and t1.isdeleted='0' order by id desc";
  var sql2 = "SELECT * FROM guarantee.t1 where isfinished ='1' and t1.isdeleted='0' ";
  var sql=sql2;
  //if(json.length>0){sql+="and ";}
  for(var i=0;i<json.length;i++){
    var current=json[i];
    var selectYear=current.x.substr(0,4);
    var selectMonth=current.x.substring(5,current.x.length-1);
    console.info(selectYear,selectMonth);
    if(i==0){sql+=" and ("}
    if(i>0){sql+=" or "}
    sql+=("( YEAR(guarantee.t1.`time`)="+selectYear);
    sql+=(" and MONTH(guarantee.t1.`time`)="+selectMonth+")");
    if(i==json.length-1){sql+=(")");}
  }
  console.info(sql);
  //res.writeHead(200, {"Content-Type": "application/json"});

  db.query(sql,function(err,result){
    //logg.error(result);
    var json
    //  logg.error(result[i]);
    if(result!=null){
       json = JSON.stringify({
        type: 1,
        code: "",
        data: result,
      });
    }else{
      json = JSON.stringify({
       type: 0,
       code: "err",
     });
    }
    //  res.end( json );//！！一定要加配置的回调方法名
  //  var _data = { email: 'example@163.com', name: 'jaxu' };
     res.type('application/json');

     res.jsonp(json);
  });
}
wuye.historySumNumber=function(req,res,next){
  var range=parseInt(req.body.rangeMonth);
  var sql = "(SELECT concat(YEAR(time) ,'年', MONTH(time),'月') AS 'x',count(id) as y FROM `t1`  where (`time`>date_add(now(), interval -"+(range+1)+" month) and t1.isfinished=1 and t1.isdeleted=0) GROUP BY YEAR (time) desc, MONTH(time) desc  limit "+range+" )";

  db.query(sql,function(err,result){
    //logg.error(result);
    var json
    //  logg.error(result[i]);
    if(result!=null){
       json = JSON.stringify({
        type: 1,
        code: "",
        data: result,
      });
    }else{
      json = JSON.stringify({
       type: 0,
       code: "err",
     });
    }
    //  res.end( json );//！！一定要加配置的回调方法名
  //  var _data = { email: 'example@163.com', name: 'jaxu' };
     res.type('application/json');

     res.jsonp(json);
  });
}
wuye.historySumNumberbyDay=function(req,res,next){
//  var range=parseInt(req.body.rangeDay);
console.info('historySumNumberbyDay');
  var sql = "\
  SELECT concat(MONTH(time) ,'月', DAY(time),'日') AS 'x',count(id) as y FROM `t1` \
 where (`time`>date_add(now(), interval -12 day) \
 and t1.isdeleted=0) GROUP BY MONTH (time) desc, DAY(time) desc  limit 12\
";

  db.query(sql,function(err,result){
    //logg.error(result);
    var json
    //  logg.error(result[i]);
    if(result!=null){
       json = JSON.stringify({
        type: 1,
        code: "",
        data: result,
      });
    }else{
      json = JSON.stringify({
       type: 0,
       code: "err",
     });
    }
    //  res.end( json );//！！一定要加配置的回调方法名
  //  var _data = { email: 'example@163.com', name: 'jaxu' };
     res.type('application/json');

     res.jsonp(json);
  });
}
  module.exports = wuye;
