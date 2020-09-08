import React from 'react'
import {Link} from 'react-router'
import {Collapse,Badge,InputNumber ,Tabs,Breadcrumb,Modal,Switch,Input ,TimePicker ,DatePicker,Row ,Col, message,Table, Icon, Divider,Button,Timeline } from 'antd'
import moment from 'moment';
import AJAX from '../../bin/AJAX.js'
import Component_BorderFrame from '../EDI/borderFrame.js';
import COOKIE from  '../../bin/COOKIE.js';
import '../../assets/css/currentFix.css';
import '../../assets/css/words.css';
import '../../bin/DateSet.js';
import STR from '../../bin/STR.js';
import config from '../../bin/config.js';
import Component_TabSwitch from './tabSwitch.js';
import Component_addMissionModal from './Component_addMissionModal.js';
import ChangeEvalModal from './component/ChangeEvalModal.js';
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const Timeformat = 'HH/mm';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
export default class Component_Hetong_Task extends React.Component{


  constructor(props) {
    super(props);
    this.state={
      /*表格的定义*/
      columns :
      [
        {
          title: '责任人',
          key: 'emplo',
          dataIndex:'emplo',
        },
        {
          title: '商家',
          key: 'factory',
          dataIndex:'factory',
          render: (text, record) => (
            <span>

              {record.factory.length>8?record.factory.substring(2,8)+'...':record.factory}
            </span>
          ),
        }
        , {
          title: '项目目标',
          render: (text, record) => (
            <span>

              {record.object.length>15?record.object.substring(0,15)+'...':record.object}
            </span>
          ),
          key: 'object',
        }, {
          title: '本期要做什么',
          dataIndex: 'wtd',
          render: (text, record) => (
            <span>

              {record.wtd.length>15?record.wtd.substring(0,15)+'...':record.wtd}
            </span>
          ),
        },
        {
          title: '类型',
          dataIndex: 'type',
          key: 'type',
          filters: [
            {
              text: '工程',
              value: '工程',
            },

            {
              text: '物业',
              value: '物业',
            },
            {
              text: '广场',
              value: '广场',
            },
          {
              text: '租赁',
              value: '租赁',
            },
            {
              text: '退租',
              value: '退租',
            },
            {
              text: '理财',
              value: '理财',
            },
            {
              text: '广告',
              value: '广告',
            },
          ],
          onFilter: (value, record) => record.type.indexOf(value) === 0,
   
        },
        {
          title: '本期时间',
          key: 'date',
          dataIndex:'date',
          render:(text,record)=>(
            <span>{record.date}
         {STR.minersNow(record.date)>0?<Badge count={STR.minersNow(record.date)} />:<Badge count={STR.minersNow(record.date)} style={{ backgroundColor: '#52c41a' }} />}

            </span>
          )
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <Divider type="vertical" />
              <a className="ant-dropdown-link" onClick={this.rightSider.bind(this,record)}>
              展开 <Icon type="menu-fold" />
              </a>
            </span>
          ),
      }
    ],
    currentTaskId:0,
      //表格数据
      data:"",
      //右侧栏数据
      c_time:"xxxx/xx/xx",
      comp:"xxxxxxxxx",
      contractid:"xxx",
      d_time:"xxxx/xx/xx",
      emplo:"xx",
      factory:"xxx",
      id:'xxx',
      info:"xxxxxxxxxxxx",
      isfinished:'xxxxx',
      mission_type:"xxxxx",
      object:"xxxxxxxxx",
      person:"xxxxxx",
      prices:'xxxxxxx',
      tel:"xxxxxx",
      mission_eval:"",

      tasks:[],

      eval_modal_visible:false,

      //右侧栏添加栏数据
      rightDate: (new Date()).Format("yyyy/MM/dd"),
      rightTime: (new Date()).Format("hh/mm"),
      rightTxt18:'',
      rightFinished:false,

      addMissionModalVisible:false,

      accountModalVisible:false,
      accountModalTaskId:'',
      accountModalTaskDate:'',
      accountModalTaskPay:'',
      accountModalTaskPrices:'',
      accountModalTaskWtd:'',
      accountModalTaskDw:'',

      accountModalTaskDelayDays:0,
      accountModalTaskDelayAllTask:false,
      accountModalIsfinished:false,
      account_MissiontoQUA:false,
      accountModalCurrentPay:0,
    }
  }




  //函数用来选择相应的颜色
  setColorFromType(type){
    if(type==1){
      return ('green');
    }
    if(type==0){
      return ('red');
    }
    if(type==3){
      return ('green');
    }
  }


//此函数用来生成timeline
  renderTimeline(){
    var _this=this;
    var pay_sum=parseFloat(0);
    for(var j=0;j<this.state.tasks.length;j++){
      pay_sum+=parseFloat(this.state.tasks[j].pay);
    //  console.info(j+':',pay_sum);
    }
    var remeanPrices=(parseFloat(this.state.prices)-parseFloat(pay_sum)).toFixed(2);
    return(
    <Timeline>
       {/*map生成日志*/
         this.state.tasks.map(function(i,index){
             return(
             <Timeline.Item color={_this.setColorFromType(i.isfinished)}>
              <p className='Timeline_left' style={{fontSize:'20px',marginLeft:'-150px'}}>
                <span style={STR.minersTime(i.date).isLarge?{color:'#cf1322'}:{color:'#aaa'}}>
                  {i.date}
                </span>
              </p>
              <p className='Timeline_right_2'>
                <Row>
                  <Col span ={20}>
                    <Badge count={"ID:"+i.id} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />
                      {_this.state.currentTaskId==i.id?<Badge count='本期' style={{ backgroundColor: '#52c41a' }} />:''}
                      {i.isfinished==1?<Badge count='已完结' style={{ backgroundColor: '#8c8c8c' }} />:<Badge count='未完结' style={{ backgroundColor: '#cf1322' }} />}
                  </Col>
                  <Col span ={4}>

                      {i.isfinished==1?'':<Button size='small' disabled={config.hasRule(304)?false:true}
                        onClick={_this.account.bind(this,i.id,i.date,i.pay,i.prices,i.wtd,i.dw)}>结算这期</Button>}

                  </Col>
                {((index+1)==_this.state.tasks.length)?<Badge count='最后一期!' style={{ backgroundColor: '#cf1322' }}/>:''}
                </Row>
                <Row gutter={24}>
                  <Col span={8} style={{paddingRight:'5px',borderRight:'1px #ddd solid',}}>
                    <Row>
                      <Col span ={10} className='infoWord'>此期金额:</Col>
                      <Col span ={14} className='pricesNum'>{parseFloat(i.prices).toFixed(2)}</Col>
                    </Row>
                    <Row>
                      <Col span ={10} className='infoWord'>已付:</Col>
                      <Col span ={14} className='pricesNum'>{parseFloat(i.pay).toFixed(2)}</Col>
                    </Row>

                    <Row><Divider style={{marginTop:'5px',marginBottom:'5px'}}/></Row>
                    <Row>
                      <Col span ={10} className='infoWord'>此期剩余:</Col>
                      <Col span ={14} className={i.prices-i.pay>0?'pricesNum red':'pricesNum gray'}>{parseFloat(i.prices-i.pay).toFixed(2)}</Col>
                    </Row>
                  </Col>
                  <Col span={16}>
                    <Row><span className='infoWord .gray'>本期需做：</span>{i.wtd}</Row>
                    <Row><span className='infoWord .gray'>本期做了：</span>{i.dw}</Row>
                  </Col>
                  </Row>
                  <Row>
                    <Col span={24}><div className='DividerBlack'/></Col>
                  </Row>
              </p>
             </Timeline.Item>
            )
         })
       }

       <Timeline.Item >
       <p className='Timeline_left' style={{fontSize:'20px',marginLeft:'-150px',fontWeight:'700'}}>
        总合计
       </p>
       <p className='Timeline_right_2'>
         <Row gutter={24}>
           <Col span={12} style={{paddingRight:'5px',borderRight:'1px #ddd solid',}}>
             <Row>
               <Col span ={10} className='infoWord'>任务总金额：</Col>
               <Col span ={14} className='pricesNum'>{parseFloat(this.state.prices).toFixed(2)}</Col>
             </Row>
             <Row>
               <Col span ={10} className='infoWord'>合计已付：</Col>
               <Col span ={14} className='pricesNum'>{parseFloat(pay_sum).toFixed(2)}</Col>
             </Row>
             <Row><Divider style={{marginTop:'5px',marginBottom:'5px'}}/></Row>
             <Row>
               <Col span ={10} className='infoWord'>合计剩余：</Col>
               <Col span ={14} className='pricesNum'>{remeanPrices}</Col>
             </Row>
           </Col>

           <Col span ={10} style={{fontSize:'50px'}}>
              {parseInt(parseFloat(pay_sum)/parseFloat(this.state.prices)*100)}%
           </Col>
         </Row>
         <Row>
            <Col span={24}><div className='DividerBlack'/></Col>
         </Row>
       </p>
       </Timeline.Item>


       <Timeline.Item >
       <p className='Timeline_left' style={{fontSize:'20px',marginLeft:'-150px',fontWeight:'700'}}>
        项目评价
        <br/>
         <Button type="primary" size="normal" onClick={this.eval_modal_open.bind(this)}>
             更改评价 
        </Button>
       </p>
       <p className='Timeline_right_2'>
         <Row gutter={24}>
           <Col span={20} style={{paddingRight:'5px',borderRight:'1px #ddd solid',fontSize:'20px',marginBottom:'100px'}}>
             
              {this.state.mission_eval}
            
           </Col>


         </Row>
       </p>
       </Timeline.Item>

     </Timeline>
   );
  }





  //主accountModal渲染函数
  setAccountModal(){
    return(
        <Modal  title="结算页面"
          visible={this.state.accountModalVisible}
          onCancel={()=>{this.setState({accountModalVisible:false}) }}
          onOk={this.accountModalOk}
          >



          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              TaskID:
            </Col>
            <Col span={14}>
              <Badge count={"ID:"+this.state.accountModalTaskId} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />

            </Col>
          </Row>
          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              节点时间:
            </Col>
            <Col span={8}>
              <Input disabled={true} size='small' value={this.state.accountModalTaskDate}/>
            </Col>

          </Row>


          <Collapse bordered={false} >
              <Panel style={{marginLeft:'50px',fontSize:'12px',color:'#f00',border:'0px'}} header="时间调整框" key="1" >
                  <Row className='row_bottom0' gutter={16}>
                   <Col className='rightTitle' span={6}>
                     延迟天数:
                   </Col>
                   <Col span={5}>
                      <InputNumber min={-5} value={this.state.accountModalTaskDelayDays}
                          onChange={(e)=>{var d=e;if(e==''){d=0}this.setState({accountModalTaskDelayDays:d})}}/>
                   </Col>
                   <Col style={{marginLeft:'20px'}} span={10}>
                      <Switch onChange={(e)=>{this.setState({accountModalTaskDelayAllTask:e})}} defaultChecked={false} checkedChildren='延后之后的Task' unCheckedChildren='只延后本期' />
                   </Col>
                  </Row>
              </Panel>
          </Collapse>


          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              本期合同价格:
            </Col>
            <Col span={14}>
              <Input disabled={true} size='small' value={this.state.accountModalTaskPrices}/>
            </Col>
          </Row>
          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              本期已付:
            </Col>
            <Col span={14}>

                <Input disabled={true} size='small' value={this.state.accountModalTaskPay}/>
            </Col>
          </Row>
          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              此次支付:
            </Col>
            <Col span={7}>
              <InputNumber min={0} max={this.state.accountModalTaskPrices-this.state.accountModalTaskPay}
               value={this.state.accountModalCurrentPay} defaultValue={0}
               onChange={(ev)=>{var d=ev;if(ev==''){d=0}this.setState({accountModalCurrentPay:d})}}
               />
            </Col>
            <Col span={7}>
              <Switch onClick={(e)=>{this.setState({accountModalIsfinished:e})}} defaultChecked={false} checkedChildren='完结本期' unCheckedChildren='未完结' />
            </Col>
          </Row>
          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              本期规定要做的事情:
            </Col>
            <Col span={14}>
                <Input disabled={true} size='small' value={this.state.accountModalTaskWtd}/>
            </Col>
          </Row>
          <Row>
          <Col className='rightTitle' span={8}>
              将项目转到质保目录:
            </Col>
            <Col span={14}>
               <Switch onClick={(e)=>{this.setState({account_MissiontoQUA:e})}} defaultChecked={false} checkedChildren='转入质保' unCheckedChildren='不变' />
            </Col>
          </Row>
          <Row className='row_bottom10' gutter={16}>
            <Col className='rightTitle' span={8}>
              本期实际做到的事情:
            </Col>
            <Col span={14}>
              <TextArea rows={4} onChange={(ev)=>this.setState({accountModalTaskDw:ev.target.value})} value={this.state.accountModalTaskDw}></TextArea>
            </Col>
           
          </Row>
        </Modal>
        )
  }
  //
  render(){

    return(
    <div>
      {config.hasRule(302)?'本账户可以查看所有其他人':'本账户只能查看自己的内容'}
      {this.setAccountModal()}
      

      <Component_addMissionModal
          visible={this.state.addMissionModalVisible}
            getValue={this.getAddMissionModalValue}
            onClose={this.closeAddMissionModal}/>
      <ChangeEvalModal
                visible={this.state.eval_modal_visible}
                missionID={this.state.id}
                missionObject={this.state.object}
                eval={this.state.mission_eval}
                isClosed={this.EvalModalClosed}
      />




      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>日常</Breadcrumb.Item>
        <Breadcrumb.Item>合同节点</Breadcrumb.Item>
      </Breadcrumb>
      <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
      <Component_TabSwitch activeId={'1'}></Component_TabSwitch>

      <div>

        <Row>

          <Button type='default' disabled={config.hasRule(303)?false:true} onClick={this.showAddMissionModal} style={{marginBottom:'20px'}}><Icon type="plus"/>添加Mission任务</Button>


          <Button type='default' onClick={this.tableToCsv} style={{marginBottom:'20px'}}><Icon type="download"/>导出表格成scv</Button>

        </Row>

        <Table size={'small'} pagination={{showSizeChanger:true}} columns={this.state.columns} dataSource={this.state.data} />
        <Component_BorderFrame ref='bf' title='Mission信息 '>
          <div style={{fontSize:'16px'}}>

            <Row>
              <Col span ={24} style={{fontSize:'18px'}}>目标：{this.state.object}</Col>

            </Row>
            <Divider style={{margin:'5px 0'}} dashed='true'/>
            <Row>
              <Col span ={2} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>ID</span>
                </Row>
                <Row>
                  <span className='rightTxt18'>{this.state.id}</span>
                </Row>
              </Col>
              <Col span ={3} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>负责人</span>
                </Row>
                <Row>
                  <span className='rightTxt18'>{this.state.emplo}</span>
                </Row>
              </Col>

              <Col span ={8} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>我方抬头</span>
                </Row>
                <Row>
                  <span className='rightTxt18'style={{fontSize:'8px'}}>{this.state.comp}</span>
                </Row>
              </Col>
              <Col span ={4} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>发排时间</span>
                </Row>
                <Row>
                  <span className='rightTxt18' >{this.state.c_time}</span>
                </Row>
              </Col>

              <Col span ={6} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>合同编号</span>
                </Row>
                <Row>
                  <span className='rightTxt18'style={{fontSize:'8px'}}>{this.state.contractid}</span>
                </Row>
              </Col>
            </Row>
              <Divider style={{margin:'5px 0'}} dashed='true'/>







              <Row>
                <Col span ={7} className='rightBlock'>
                  <Row>
                    <span className='rightTitle'>厂家信息</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18'style={{fontSize:'8px'}}>{this.state.factory}</span>
                  </Row>
                </Col>
                <Col span ={3} className='rightBlock'>
                  <Row>
                    <span className='rightTitle'>对方负责人</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18'>{this.state.person}</span>
                  </Row>
                </Col>

                <Col span ={4} className='rightBlock'>
                  <Row>
                    <span className='rightTitle' >联系方式</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18' style={{fontSize:'8px'}}>{this.state.tel}</span>
                  </Row>
                </Col>

                <Col span ={3} className='rightBlock'>
                  <Row>
                    <span className='rightTitle'>总金额</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18' >{this.state.prices}</span>
                  </Row>
                </Col>

                <Col span ={3} className='rightBlock'>
                  <Row>
                    <span className='rightTitle'>是否完结</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18' >
                      {this.state.isfinished=='1'?'完结':''}
                      {this.state.isfinished=='0'?'未完结':''}
                      {this.state.isfinished=='2'?'质保中':''}
                    </span>
                  </Row>
                </Col>

                <Col span ={3} className='rightBlock'>
                  <Row>
                    <span className='rightTitle'>任务类型</span>
                  </Row>
                  <Row>
                    <span className='rightTxt18' >{this.state.mission_type}</span>
                  </Row>
                </Col>
              </Row>



          </div>
          <div style={{paddingLeft:'180px',paddingTop:'20px'}}>
            {this.renderTimeline()}
          </div>
        </Component_BorderFrame>
      </div>
            <Divider />

      </div>

      </div>
    );
  }










  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentDidMount(){
    this.getCurrentTasksTable();
  }

//获取
getCurrentTasksTable=()=>{
  var _this=this;
  let id =COOKIE.get('id');
  //console.info('cookies id:',id)
  let link="type=hetong&fun=currentTask";
  if(config.hasRule("302")){
    console.info('本账户号有302功能')
  }else{
    console.info('本账户没有302功能')
    link=link+"&userID="+id;
  }
  var result=AJAX.send(link);
  result.then(function (response) {
  //  console.log(response)
    return response.json()
  }).then(function (json) {
      //console.log('now', json);
      var data=JSON.parse(json);
      if(data.type==0){
        message.error('错误：'+data.code);
    }else{
      message.success('获取到Mission记录'+data.data.length+'条数据');
      console.info(data.data);
      _this.setState({
        data:data.data,
      });
    }
  }).catch(function (ex) {
    console.log('parsing failed', ex)
  });
}



  //右侧栏触发情况参数是行数据
  rightSider=(record,event)=>{

    console.info('test rightsider open'+record.id);
    //将行数据载入到state

      //触发borderFrame bf 的打开方法
    //  console.info(this.state.id);
    this.setState({
      currentTaskId:record.id+'',
    });
      this.refs.bf.open();
      console.info('getTasksbyid',record.id)
      this.getTasksById(record.id);
  }



  //获取数据刷新history
  getTasksById(id){
    var _this=this;
  //  console.info('gethistory:'+id);
    var result=AJAX.send("type=hetong&fun=MissionInfobyTaskId&taskId="+id);
    result.then(function (response) {
      console.log(response)
      return response.json()
    }).then(function (json) {
        var data=JSON.parse(json);
        console.info(data);
        if(data.type==0){
          message.error('错误：'+data.code);
        }else{
          message.success('获取到Task'+data.data[1].length+'条数据');
          _this.setState({
            c_time:data.data[0].c_time,
            comp:data.data[0].comp,
            contractid:data.data[0].contractid,
            d_time:data.data[0].d_time,
            emplo:data.data[0].emplo,
            factory:data.data[0].factory,
            id:data.data[0].id,
            info:data.data[0].info,
            isfinished:data.data[0].isfinished,
            mission_type:data.data[0].mission_type,
            object:data.data[0].object,
            person:data.data[0].person,
            prices:data.data[0].prices,
            tel:data.data[0].tel,
            tasks:data.data[1],
            mission_eval:data.data[0].eval
          });

      }
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
  }

  //获取数据刷新history
  getTasksByMissionId(id){
    var _this=this;
  //  console.info('gethistory:'+id);
    var result=AJAX.send("type=hetong&fun=MissionInfobyMissionId&MissionId="+id);
    result.then(function (response) {
      console.log(response)
      return response.json()
    }).then(function (json) {
        var data=JSON.parse(json);
        console.info(data);
        if(data.type==0){
          message.error('错误：'+data.code);
        }else{
          message.success('获取到Task'+data.data[1].length+'条数据');
          console.info('获取到的tasks数据'+data.data[0]);
          _this.setState({
            c_time:data.data[0].c_time,
            comp:data.data[0].comp,
            contractid:data.data[0].contractid,
            d_time:data.data[0].d_time,
            emplo:data.data[0].emplo,
            factory:data.data[0].factory,
            id:data.data[0].id,
            info:data.data[0].info,
            isfinished:data.data[0].isfinished,
            mission_type:data.data[0].mission_type,
            object:data.data[0].object,
            person:data.data[0].person,
            prices:data.data[0].prices,
            tel:data.data[0].tel,
            tasks:data.data[1],
            mission_eval:data.data[0].eval,
          });

      }
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
  }


//组件右侧组件更改
changeRightDate=(event)=>{
  var value=event.format(dateFormat);
  console.info(value);
   this.setState({
     rightDate:value,
   });
}



changeRightTime=(event)=>{
  var value=event.format(Timeformat);
  console.info(value);
   this.setState({
     rightTime:value,
   });
}


changerightTxt18=(event)=>{
 this.setState({
   rightTxt18:event.target.value,
 });
}


changeRightFinished=(check)=>{
  console.info('changeRightfinish 触发'+check);
  this.setState({
    rightFinished:check,
  });
}


//右侧点击添加按钮触发发送
addRightInfom=()=>{
      var _this=this;
      if(STR.standard(this.state.rightTxt18)==''){
        message.error('维修内容不可为空');
        return;
      }
      var data={
        id:this.state.id,
        date:this.state.rightDate,
        time:this.state.rightTime,
        txt:this.state.rightTxt18,
        isFinished:this.state.rightFinished,
      };
      var result=AJAX.send("type=wuye&fun=addInform&data="+JSON.stringify(data));
      result.then(function (response) {
      //  console.log(response)
        return response.json()
      }).then(function (json) {
          //console.log(json);
          var data=JSON.parse(json);
          if(data.type==0){
            message.error('错误：'+data.code);
          }else{
            message.success('添加数据成功');
            if(_this.state.rightFinished){
              _this.refs.bf.close();
            }
            _this.setState({
              rightTxt18:'',
              rightFinished:false,
            });
            _this.getTasksById();
            _this.getCurrentTasksTable();

          }
      }).catch(function (ex) {
        console.log('parsing failed', ex)
      });
}








/**右侧结算面板的 ok按下时 */
  accountModalOk=()=>{
    var data={
      missionId:this.state.id,
      MissiontoQUA:this.state.account_MissiontoQUA
    };
    
    console.info(data);
    /**如果state中的MissiontoQUA 为true 则将指定missionid isfinished值设置为 2*/
    if(this.state.account_MissiontoQUA){
      AJAX.send("type=hetong&fun=MissionChange&data="+JSON.stringify(data ));
      console.info("type=hetong&fun=MissionChange&data="+JSON.stringify(data ));
    }
    var data= {
      Id:this.state.accountModalTaskId,
      Dw:STR.standard(this.state.accountModalTaskDw),
      DelayDays:this.state.accountModalTaskDelayDays,
      DelayAllTask:this.state.accountModalTaskDelayAllTask,
      Isfinished:this.state.accountModalIsfinished,
      CurrentPay:this.state.accountModalCurrentPay,
    }
    var result=AJAX.send("type=hetong&fun=TaskChange&data="+JSON.stringify(data));
    var _this=this;
    result.then(function (response) {

      return response.json()
    }).then(function (json) {
        console.log('callback:',json);
        var data=JSON.parse(json);
        if(data.type==0){
          message.error('错误：'+data.code);
        }else{
          message.success(data.code);
          _this.getTasksById(_this.state.accountModalTaskId);

          _this.setState({
            accountModalVisible:false,
            accountModalTaskId:'',
            accountModalTaskDate:'',
            accountModalTaskPay:'',
            accountModalTaskPrices:'',
            accountModalTaskWtd:'',
            accountModalTaskDw:'',
            accountModalTaskDelayDays:0,
            accountModalTaskDelayAllTask:false,
            accountModalIsfinished:false,
            accountModalCurrentPay:0,
          })
        }
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
}
  //渲染添加addmodal

  showAddMissionModal=(e)=>{
    this.setState({
      addMissionModalVisible:true,
    });
  }

/**获取addmission 窗口的参数 并发送 */
  getAddMissionModalValue=(e)=>{
    var _this=this;
    let json=JSON.stringify(e);
    console.info(json);
    var result=AJAX.send("type=hetong&fun=addMission&data="+json);
    result.then(function (response) {
    //  console.log(response)
      return response.json()
    }).then(function (json) {
        //console.log('now', json);
        var data=JSON.parse(json);
        if(data.type==0){
          message.error('错误：'+data.code);
      }else{
        message.success('获取到Mission记录'+data.data.length+'条数据');
        console.info(data.data);
        _this.setState({
          data:data.data,
        });
        _this.getCurrentTasksTable();
      }
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
    console.info(e);
  }

/*关闭新增add mission窗口 不取消其中内容 */
  closeAddMissionModal=()=>{
    this.setState({
      addMissionModalVisible:false,
    });
  }


  account=(taskId,date,pay,prices,wtd,dw)=>{
    console.info('value:',taskId,date,pay,prices,wtd,dw);
    this.setState({
      accountModalVisible:true,
      accountModalTaskId:taskId,
      accountModalTaskDate:date,
      accountModalTaskPay:pay,
      accountModalTaskPrices:prices,
      accountModalTaskWtd:wtd,
      accountModalTaskDw:dw,
    },function(){console.info(this.state)});
  
  }

/*还没有定义 */
  tableToCsv = () => {
    console.info('table to csv');
  }


/*component.ChangeEvalModal.js 弹出界面 其中内容已经设置*/ 
  eval_modal_open=()=>{
    console.info('eval_modal_open');
    this.setState({
      eval_modal_visible:true,
    });
  }


/* component.ChangeEvalModal.js 返回正确结果后*/
  EvalModalClosed=()=>{
    console.info("父组件获取closed")
    this.setState({
      eval_modal_visible:false,
    });
    this.getTasksByMissionId(this.state.id);
    this.getCurrentTasksTable();
  }



}
