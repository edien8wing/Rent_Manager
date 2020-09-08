var db = require('../../bin/db.js');
var logg =require('../../bin/log4js.js');
var STR=require('../../bin/STR.js')

  var hetong    = {};

  hetong.fun = function(req, res, next){

    switch(req.body.fun){
      case 'currentTask':hetong.currentTask(req,res,next);break;
      case 'finishedMission':hetong.finishedMission(req,res,next);break;
      case 'currentMission':hetong.currentMission(req,res,next);break;
      case 'MissionInfobyTaskId':hetong.MissionInfobyTaskId(req,res,next);break;
      case 'MissionInfobyMissionId':hetong.MissionInfobyMissionId(req,res,next);break;
      case 'TaskChange':hetong.TaskChange(req,res,next);break;
      case 'addMission':hetong.addMission(req,res,next);break;
      case 'missionType':hetong.missionType(req,res,next);break;
      case 'users':hetong.users(req,res,next);break;
      case 'MissionChange':hetong.MissionChange(req,res,next);break;
      case 'QUAmission':hetong.QUAmission(req,res,next);break;
      case 'changeEval':hetong.changeEval(req,res,next);break;
      default:break;
    }

  }



  hetong.currentTask=function(req,res,next){
    //console.info(req.body);
    var userID=req.body.userID;
    //console.info(id);
    var sql = "\
    select mission_task.id,      user.name as emplo,    DATE_FORMAT(mission_task_time.`date`,'%Y-%m-%d')as `date` ,      mission.object,      mission.factory,      mission.tel,      mission_task.wtd,      mission_type.`type`,      mission_task.prices,      mission_task.pay    \
    from      mission_task_time     \
    left join mission_task      on mission_task_time.mission_task_id=mission_task.id     \
    left join mission      on mission.id=mission_task.mission_id     \
    left join mission_type      on mission_type.id=mission.`type`    \
    left join user on user.id = mission.emplo\
    where      mission_task.isfinished=0 and      mission_task.isdeleted=0 and      mission_task_time.ischanged=0  order by mission_task_time.date asc\
    "  //res.writeHead(200, {"Content-Type": "application/json"});
//and      mission_task_time.`date`<date_add(now(),interval 7 day)

    console.info(userID);
    if(userID){
      sql=sql+" and user.id="+userID;
    }
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


  hetong.currentMission=function(req,res,next){
    let userID=req.body.userID;
    var sql = "select m.id,u.name as 'emplo',m.object,m.factory,mission_type.`type`,DATE_FORMAT(m.c_time,'%Y-%m-%d') as c_time,DATE_FORMAT(max(mtt.date),'%Y-%m-%d')as e_time from mission as m\
    left join mission_task as mt on mt.mission_id=m.id \
    left join mission_task_time as mtt on mtt.mission_task_id=mt.id\
    left join `user` as u on u.id=m.emplo\
    left join mission_type on mission_type.id=m.`type`\
    where m.isdeleted=0 and\
    m.isfinished=0 and\
    mt.isfinished=0 and\
    mt.isdeleted=0\
    group by m.id"
          if(userID){
      sql=sql+"and user.id="+userID
    }
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


  hetong.finishedMission=function(req,res,next){
    let userID=req.body.userID;
    var sql = "select mission.id,mission.factory,object,user.name as emplo,DATE_FORMAT(c_time,'%Y-%m-%d')as c_time,\
    DATE_FORMAT(d_time,'%Y-%m-%d')as d_time,prices,mission_type.`type` from mission \
    left join mission_type on mission.type=mission_type.id\
    left join user on user.id=mission.emplo\
    where (isfinished=1 and mission.isdeleted=0)"
    if(userID){
      sql=sql+"and user.id="+userID
    }
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

  hetong.MissionInfobyTaskId=function(req,res,next){
    var taskId=req.body.taskId;
    //
    var sql = "select DATE_FORMAT(c_time,'%Y-%m-%d')as c_time,mission.id,object,factory,person,tel,comp,user.name as emplo,prices,contractid,mission.info,mission.isfinished,mission_type.type as mission_type ,mission.`eval`as `eval`\
    from mission \
    left join mission_type on mission.`type`=mission_type.id \
    left join user on user.id=mission.emplo \
    where mission.id=( select mission_task.mission_id from mission_task where mission_task.id="+taskId+")";
    var sql2="select mission_task.id,mission_task.wtd,mission_task.dw,\
    mission_task.prices,mission_task.pay,mission_task.isfinished,DATE_FORMAT(mission_task_time.`date`,'%Y-%m-%d')as `date` \
    from mission_task left join mission on mission.id=mission_task.mission_id \
    left join mission_task_time on mission_task_time.mission_task_id=mission_task.id \
    left join mission_type on mission.`type`=mission_type.id \
    where mission_task.isdeleted=0 and mission_task_time.ischanged=0 and \
    mission.id=( select mission_task.mission_id from mission_task where id="+taskId+")\
    order by mission_task_time.date asc, mission_task.id asc";
    var success=true;
    var json;
    var ans;
    db.query(sql,function(err,result){//查询1mission数据
      console.info('sql1');
      if(result!=null){
        json=result;
      }else{
        success=false;
      }
      db.query(sql2,function(err2,result2){
              console.info('sql2');
        if(result2!=null){
          json.push(result2)
        }else{
          success=false;
        }


          if(success){
             ans = JSON.stringify({
              type: 1,
              code: "",
              data: json,
            });
          }else{
            ans = JSON.stringify({
             type: 0,
             code: "err",
           });
        }
      //  console.info('ans',JSON.stringify(ans));
        res.type('application/json');
        res.jsonp(ans);



      })
    })
}

hetong.MissionInfobyMissionId=function(req,res,next){
  var MissionId=req.body.MissionId;
  //console.info('missionid:',req.body);
  var sql = "select DATE_FORMAT(c_time,'%Y-%m-%d')as c_time,mission.id,object,factory,person,tel,comp,user.name as emplo,prices,contractid,mission.info,mission.isfinished,mission_type.type as mission_type ,mission.eval as `eval`\
  from mission left join mission_type on   mission.`type`=mission_type.id \
  left join user on user.id=mission.emplo\
  where mission.id="+MissionId+"";
  var sql2="select mission_task.id,mission_task.wtd,mission_task.dw,mission_task.prices,mission_task.pay,mission_task.isfinished,DATE_FORMAT(mission_task_time.`date`,'%Y-%m-%d')as `date` \
  from mission_task left join mission on mission.id=mission_task.mission_id \
  left join mission_task_time on mission_task_time.mission_task_id=mission_task.id \
  left join mission_type on mission.`type`=mission_type.id \
  where mission_task.isdeleted=0 and mission_task_time.ischanged=0 and mission.id="+MissionId+" order by mission_task_time.date asc, mission_task.id asc";
  var success=true;
  var json;
  var ans;
  db.query(sql,function(err,result){//查询1mission数据
    console.info('sql1');
    if(result!=null){
      json=result;
    }else{
      success=false;
    }
    db.query(sql2,function(err2,result2){
            console.info('sql2');
      if(result2!=null){
        json.push(result2)
      }else{
        success=false;
      }


        console.info('back json');
        if(success){
           ans = JSON.stringify({
            type: 1,
            code: "",
            data: json,
          });
        }else{
          ans = JSON.stringify({
           type: 0,
           code: "err",
         });
      }
    //  console.info('ans',JSON.stringify(ans));
      res.type('application/json');
      res.jsonp(ans);

    })
  })
}




hetong.missionType=function(req,res,next){
  var sql = "select * from mission_type"//res.writeHead(200, {"Content-Type": "application/json"});

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



hetong.addMission=function(req,res,next){
  console.info('addmission 处理函数')
  var json = JSON.parse(req.body.data);
/*  console.info(json.addModalContractId,
    json.addModalObject,
    json.addModalEmplo,
    json.addModalType,
    json.addModalPrices,
    json.addModalComp,
    json.addModalFactory,
    json.addModalPerson,
    json.addModalTel,
    json.addModalDate,
    json.addModalTask);*/
    var query="insert into mission (object,factory,person,tel,comp,emplo,c_time,prices,contractid,`type`) values "
    query+="('"
      +json.addModalObject+"','"
      +json.addModalFactory+"','"
      +json.addModalPerson+"','"
      +json.addModalTel+"','"
      +json.addModalComp+"','"
      +json.addModalEmplo+"','"
      +json.addModalDate+"','"
      +json.addModalPrices+"','"
      +json.addModalContractId+"','"
      +json.addModalType+
      "')";
    console.info(query);
    db.insert(query,function(err,insertId){
      if(err){

      }else{
        console.info('insertId：'+insertId);
        for(let i=0;i<json.addModalTask.length;i++){
          let q="INSERT INTO mission_task (mission_id,wtd,dw,prices,pay,isfinished,isdeleted) VALUES ('"+insertId+"','"+
    			json.addModalTask[i].whatToDo+"','"+
    			"','"+
    			json.addModalTask[i].prices+"','0','0','0');";
          db.insert(q,function(err,taskId){
            let q2="INSERT INTO mission_task_time (mission_task_id,date) VALUES ('"+taskId+"','"+
			          json.addModalTask[i].date+"');";
                db.insert(q2,function(err){

                })
          })

        }
      }

    });
}

hetong.TaskChange=function(req,res,next){
  /*
  Id:this.state.accountModalTaskId,
  Dw:STR.standard(this.state.accountModalTaskDw),
  DelayDays:this.state.accountModalTaskDelayDays,
  DelayAllTask:this.state.accountModalTaskDelayAllTask,
  Isfinished:this.state.accountModalIsfinished,
  CurrentPay:this.state.accountModalCurrentPay,}
  */
  var success=true;
  var isfinished=0;
  var json = JSON.parse(req.body.data);

  if(json.Isfinished){
    isfinished='1';
  }else{
    isfinished='0';
  }
  console.info(req.body.data);
  var json=JSON.parse(req.body.data);
  //设置付款价格和是否完成task
  var query = "update mission_task set dw='"+json.Dw+"', isfinished='"+isfinished+"', pay=pay+"+json.CurrentPay+"   where id="+json.Id;
  db.query(query,function(err){
    //logg.error(result);
      if(err){
        success=true;
        STR.ERR(err);
      }else{
        if(json.Isfinished){//如果本期完成是true 则判断是否全部完成任务 若是没有则直接返回计算本期完成
          if(hetong.setMissionIsfinished(json.Id)){
              STR.SUCCESS(res,'','本期已完成')
          }else{
             STR.SUCCESS(res,'',"完成所有工作")
          }
        }else{
          STR.SUCCESS(res,'','结算本期成功')
        }
      }
  });
  //如果时间不为0设置延迟时间
  if(json.DelayDays!=0){
    //如果延迟所有选项 设置
    if(json.DelayAllTask){
      var q="update  mission_task left join mission_task_time  on mission_task.id=mission_task_time.mission_task_id set mission_task_time.date=date_add(  mission_task_time.date  , interval "+
          json.DelayDays+" day)    where mission_task.mission_id=(  select mission_task.mission_id from mission_task where mission_task.id="+json.Id+")  and mission_task.id>=1";
      db.query(q,function(err){
        //logg.error(result);
        if(err){
          STR.ERR(err)
        }
      });
    }else{
      //延迟当前这一期的时间
      var q="update mission_task_time left join mission_task on mission_task.id=mission_task_time.mission_task_id set mission_task_time.date= date_add(   mission_task_time.date   , interval "+json.DelayDays+" day)    where mission_task.id="+json.Id;
      db.query(q,function(err){
        //logg.error(result);
        if(err){
          STR.ERR(err)
        }
      });
    }


  }else{//当延迟时间等于0不做任何操作
  }
  //将json发送回去
}

//看task有没有全部完成，全完成后设置mission为finish
hetong.setMissionIsfinished=function(taskId){
  var q="select count(*) as sum from mission_task left join \
  mission on mission.id=mission_task.mission_id where \
  mission_task.isdeleted=0 and	mission_task.isfinished=0 and	\
  mission.id=( select mission_task.mission_id from mission_task where id='"
    +taskId+"')";
    db.query(q,function(err,result){
      //logg.error(result);

       if(err){
         return err
       }else{
         console.info('result0',result[0].sum)
          if(result[0].sum=='0'){
            console.info('全部完结')
            let q1="update mission set mission.isfinished='1' where mission.id=( select mission_task.mission_id from mission_task where id='"+taskId+"')";
            db.query(q1,function(err){
              if(err){
                return err;
              }else{
                //全部完结
                return true;
              }
            });
          }else {
            console.info('还有未完结的选项')
            //没有全部完结
            return false ;
          }
       }
    });
}

hetong.users=function(req,res,next){
  var sql = "select id,name from user"  //res.writeHead(200, {"Content-Type": "application/json"});
  console.info(sql)
  db.query(sql,function(err,result){
    var json
    if(result!=null){
      STR.SUCCESS(res,result,'ok');
    }else{
      STR.ERR(res,err);
    }

  });
}


hetong.QUAmission=function(req,res,next){
  let userID=req.body.userID;
  /* isfinished =2 为质保期的项目 */
  var sql = "select mission.id,object,user.name as emplo,DATE_FORMAT(c_time,'%Y-%m-%d')as c_time,\
  DATE_FORMAT(d_time,'%Y-%m-%d')as d_time,prices,mission_type.`type` from mission \
  left join mission_type on mission.type=mission_type.id\
  left join user on user.id=mission.emplo\
  where (isfinished=2 and mission.isdeleted=0)"
  if(userID){
    sql=sql+"and user.id="+userID
  }
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



hetong.MissionChange=function(req,res,next){

  
  var json = JSON.parse(req.body.data);
  /* missionId:id,MissiontoQUA:true*/
 var sql = "update  mission set isfinished=2 where mission.id="+json.missionId;
  db.query(sql,function(err){
    if (err){
      console.info(err)
    }

  })

}


hetong.changeEval=function(req,res,next){

  console.info("changeEval");
  let ans={stat:0};
  var json = JSON.parse(req.body.data);
  /* missionId:id,MissiontoQUA:true*/
  console.info(json);
  let eval = json.eval;
  let missionID=json.missionID;
 var sql = "update  mission set mission.eval='"+eval+"' where mission.id="+json.missionID;
 db.query(sql,function(err){
  if (err){
    ans={stat:1,err:err}
  }
  json = JSON.stringify({
    ans
  });
  res.type('application/json');

  res.jsonp(json);
})

}

  module.exports = hetong;
