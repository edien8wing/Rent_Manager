import React from 'react'
import {Breadcrumb,Menu,Dropdown,Pagination ,Modal,Switch,Input ,TimePicker ,DatePicker,Row ,Col, message,Table, Icon, Divider,Button,Timeline } from 'antd'
import moment from 'moment';
import AJAX from '../../bin/AJAX.js'
import Component_BorderFrame from '../EDI/borderFrame.js';
import '../../assets/css/currentFix.css';
import '../../bin/DateSet.js';
import STR from '../../bin/STR.js';
import TOOLS from '../../bin/TOOLS.js';
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'yyyy/MM';
const Timeformat = 'hh:mm';
const FixerMenu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">1st 维修员1</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">2nd 维修员2</a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="#">3rd 维修员3</a>
    </Menu.Item>
  </Menu>
);
export default class Component_wuye_currentFix extends React.Component{


  constructor(props) {
    super(props);
    this.state={
      /*表格的定义*/
      columns :
      [
        {
          title: '问题',
          key: 'problem',
          render: (text, record) => (
            <span>
              {record.problem.length>15?record.problem.substring(0,15)+'...':record.problem}
            </span>
          ),
          filters: [{
              text: '电',
              value: '电',
            }, {
              text: '水',
              value: '水',
            }],
            filterMultiple: false,
            onFilter: (value, record) => record.problem.indexOf(value) >= 0,
            sorter: (a, b) => a.problem.length - b.problem.length,

        }, {
          title: '地址',
          dataIndex: 'location',
          key: 'location',
          filters: [{
              text: '中心大厦',
              value: '中心大厦',
            }, {
              text: '地下室',
              value: '地下室',
            },{
              text: 'c栋',
              value: 'c栋',
            }
          ],
            filterMultiple: false,
            onFilter: (value, record) => record.location.indexOf(value) >= 0,
            sorter: (a, b) => a.location - b.location,
        }, {
          title: '报修人',
          dataIndex: 'person',
          key: 'person',
        },
        {
          title: '电话',
          dataIndex: 'tel',
          key: 'tel',
        },
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
          sorter: (a, b) => new Date(a.time).getTime()-new Date(b.time).getTime(),
        }, {
          title: '操作',
          key: 'action',
          render: (text, record) => (
            <span>
              <Divider type="vertical" />
              <a className="ant-dropdown-link" onClick={this.rightSider.bind(this,record)}>
              展开 <Icon type="menu-fold" />
              </a>
              <Divider type="vertical"/>
              <Dropdown overlay={FixerMenu}>
                <a className="ant-dropdown-link">
                指派 <Icon type="down" />
                </a>
              </Dropdown>
            </span>
          ),
      }
    ],
      //表格数据
      data:"",
      //右侧栏数据
      id:'XXX',
      location:'XXX',
      person:'XXX',
      problem:'XXX',
      tel:'XXX',
      time:'XXX',
      history:[],
      modal_add_visible: false,
      //右侧栏添加栏数据
      rightDate: (new Date()).Format('yyyy/MM/dd'),
      rightTime: (new Date()).Format(Timeformat),
      rightTxt:'',
      rightFinished:false,
      //modal数据
      addModalLocation:'',
      addModalPerson:'',
      addModalTel:'',
      addModalDate:(new Date()).Format('yyyy/MM/dd'),
      addModalTime:(new Date()).Format(Timeformat),
      addModalProblem:'',
    }
  }


  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentDidMount(){
    this.getFixTable();
  }

//
getFixTable=()=>{
  var _this=this;
  var result=AJAX.send("type=wuye&fun=currentFix");
  result.then(function (response) {
  //  console.log(response)
    return response.json()
  }).then(function (json) {
      //console.log('now', json);
      var data=JSON.parse(json);
      if(data.type==0){
        message.error('错误：'+data.code);
    }else{
      message.success('获取到报修记录'+data.data.length+'条数据');
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
    this.setState({
      id:record.id,
      location:record.location,
      person:record.person,
      problem:record.problem,
      tel:record.tel,
      time:record.time,
    },function(){
      //触发borderFrame bf 的打开方法
    //  console.info(this.state.id);
      this.refs.bf.open();
      this.getHistoryById();
    });

  }
  //获取数据刷新history
  getHistoryById(){
    var _this=this;
    var id=this.state.id;
  //  console.info('gethistory:'+id);
    var result=AJAX.send("type=wuye&fun=getHistoryFromId&id="+id);
    result.then(function (response) {
    //  console.log(response)
      return response.json()
    }).then(function (json) {
        //console.log('now', json);
        var data=JSON.parse(json);
        if(data.type==0){
          message.error('错误：'+data.code);
        }else{
          message.success('获取到历史记录'+data.data.length+'条数据');
          //console.info(data.data);
          _this.setState({
            history:data.data,
            rightTxt:'',
            rightFinished:false,
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
changeRightTxt=(event)=>{
 this.setState({
   rightTxt:event.target.value,
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
 if(STR.standard(this.state.rightTxt)==''){
   message.error('维修内容不可为空');
   return;
 }
 var data={
   id:this.state.id,
   date:this.state.rightDate,
   time:this.state.rightTime,
   txt:this.state.rightTxt,
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
         rightTxt:'',
         rightFinished:false,
       });
       _this.getHistoryById();
       _this.getFixTable();

     }
 }).catch(function (ex) {
   console.log('parsing failed', ex)
 });
}
//此函数用来生成timeline
  renderTimeline(){
    var _this=this;
    return(
    <Timeline>
       {/*map生成日志*/
         this.state.history.map(function(i){
             return(
             <Timeline.Item color={_this.setColorFromType(i.type)}>
              <p className='Timeline_left'>{i.time}</p>
              <p className='Timeline_right'><span style={{color:'#ccc'}}>[{i.id}]</span> {i.info}</p>
             </Timeline.Item>
           )
         })
       }

       <Timeline.Item >
       <p className='Timeline_left'>
         <DatePicker
            defaultValue={moment(this.state.rightDate, dateFormat)}
            value={moment(this.state.rightDate, dateFormat)}
            size='small'
            format={dateFormat}
            onChange={this.changeRightDate.bind(this)}
            />
         <br/>
         <TimePicker
            defaultValue={moment(this.state.rightTime, Timeformat)}
            value={moment(this.state.rightTime, Timeformat)}
            format={Timeformat}
            onChange={this.changeRightTime.bind(this)}
            size="small" />
       </p>
       <p className='Timeline_right_2line' >
        <TextArea placeholder="维修内容" autosize={{ minRows: 2, maxRows: 6 }}
              onChange={this.changeRightTxt.bind(this)} value={this.state.rightTxt}/>

         <br/>
            <Switch checkedChildren="已解决" unCheckedChildren="未解决"  checked={this.state.rightFinished}  onClick={this.changeRightFinished.bind(this)}/>
         <br/>
         <Button type='default' onClick={this.addRightInfom}>添加</Button>
       </p>
       </Timeline.Item>
     </Timeline>
   );
  }


  //函数用来选择相应的颜色
  setColorFromType(type){
    if(type==1){
      return ('red');
    }
    if(type==2){
      return ('blue');
    }
    if(type==3){
      return ('green');
    }
  }


  //主渲染函数
  render(){

    return(
<div>

<Breadcrumb style={{ margin: '16px 0' }}>
  <Breadcrumb.Item>物业</Breadcrumb.Item>
  <Breadcrumb.Item>当前报修信息</Breadcrumb.Item>
</Breadcrumb>
<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>



      <div>
      {this.renderModal_add()}
        <Row>
          <Button type='default' onClick={this.show_modal_add} style={{marginBottom:'20px'}}><Icon type="plus"/>添加报修任务</Button>
          <Button type='default' onClick={this.tableToCsv} style={{marginBottom:'20px'}}><Icon type="download"/>导出表格成scv</Button>

        </Row>
        <Table title={() => 'Header' } size={'small'} pagination={{showSizeChanger:true}} columns={this.state.columns} dataSource={this.state.data} />
        <Component_BorderFrame ref='bf' title='维修日志 '>
          <div style={{fontSize:'16px'}}>

            <Row>
              <Col span ={20} style={{fontSize:'24px'}}>地点：{this.state.location}</Col>
              <Col span ={4}>
                <Button type='danger'>删除 </Button>
              </Col>
            </Row>
            <Divider style={{margin:'5px 0'}} dashed='true'/>
            <Row>
              <Col span ={3} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>ID</span>
                </Row>
                <Row>
                  <span className='rightTxt'>{this.state.id}</span>
                </Row>
              </Col>
              <Col span ={4} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>报修人</span>
                </Row>
                <Row>
                  <span className='rightTxt'>{this.state.person}</span>
                </Row>
              </Col>

              <Col span ={6} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>电话</span>
                </Row>
                <Row>
                  <span className='rightTxt'>{this.state.tel}</span>
                </Row>
              </Col>
              <Col span ={7} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>时间</span>
                </Row>
                <Row>
                  <span className='rightTxt' style={{fontSize:'18px'}}>{this.state.time}</span>
                </Row>
              </Col>
              <Col span ={4} className='rightBlock'>
                <Row>
                  <span className='rightTitle'>XXX</span>
                </Row>
                <Row>
                  <span className='rightTxt'>XXX</span>
                </Row>
              </Col>
            </Row>
              <Divider style={{margin:'5px 0'}} dashed='true'/>
            <Row>
              <Col span ={4}>报修情况：</Col>
              <Col span ={20}>{this.state.problem}</Col>
            </Row>
          </div>
          <div style={{paddingLeft:'250px',paddingTop:'5px'}}>
            {this.renderTimeline()}
          </div>
        </Component_BorderFrame>
      </div>
      </div>
      </div>
    );
  }
  //渲染添加addmodal
  renderModal_add(){
/*
addModalLocation:'',
addModalPerson:'',
addModalTel:'',
addModalDate:'',
addModalTime:'',
addModalProblem:'',*/
    return(
      <div>


        <Modal
          title="添加维修任务"
          visible={this.state.modal_add_visible}
          onOk={this.Ok_modal_add}
          onCancel={this.Cancel_modal_add}
        >
          <Row className='row_height'>
            <Col className='child_right' span={7} ><span><span className='red'>*</span>地点</span></Col>
            <Col span={13}><Input size='small' placeholder="需要维修的地点" value={this.state.addModalLocation} onChange={this.changeAddModalLocation.bind(this)}/></Col>
          </Row>
          <Row className='row_height'>
            <Col className='child_right' span={7} ><span className='red'>*</span>报修人</Col>
            <Col span={13}><Input size='small' placeholder="联系人" value={this.state.addModalPerson} onChange={this.changeAddModalPerson.bind(this)}/></Col>
          </Row>
          <Row className='row_height'>
            <Col className='child_right' span={7} ><span className='red'>*</span>电话</Col>
            <Col span={13}><Input size='small' placeholder="联系电话" value={this.state.addModalTel} onChange={this.changeAddModalTel.bind(this)}/></Col>
          </Row>
          <Row className='row_height'>
            <Col className='child_right' span={7}><span className='red'>*</span>日期 时间</Col>
            <Col span={13}>
              <DatePicker style={{marginBottom:'10px'}}
              defaultValue={moment(this.state.addModalDate, dateFormat)}
              value={moment(this.state.addModalDate, dateFormat)}
              format={dateFormat}
              onChange={this.changeAddModalDate.bind(this)}
              />
              <TimePicker format={Timeformat}
              defaultValue={moment(this.state.addModalTime, Timeformat)}
              value={moment(this.state.addModalTime, Timeformat)}
              format={Timeformat}
              onChange={this.changeAddModalTime.bind(this)}
              />
            </Col>
          </Row>
          <Row className='row_height'>
            <Col className='child_right' span={7}><span className='red'>*</span>问题</Col>
            <Col span={13}><TextArea placeholder="描述问题的发生及详细经过" value={this.state.addModalProblem} onChange={this.changeAddModalProblem.bind(this)}/></Col>
          </Row>
        </Modal>
      </div>
    );
  }
  show_modal_add = () => {
    this.setState({
      modal_add_visible: true,
      addModalDate:(new Date()).Format('yyyy/MM/dd'),
      addModalTime:(new Date()).Format('hh:mm'),
    });
  }
  Ok_modal_add = () => {
    this.setState({
      modal_add_visible: false,
    });
    var _this=this;
   if(STR.standard(this.state.addModalLocation)==''||
      STR.standard(this.state.addModalPerson)==''||
      STR.standard(this.state.addModalProblem)==''||
      STR.standard(this.state.addModalTel)==''
      ){
     message.error('表单数据必须完整');
     return;
   }
   var data={
     location:this.state.addModalLocation,
     person:this.state.addModalPerson,
     problem:this.state.addModalProblem,
     tel:this.state.addModalTel,
     date:this.state.addModalDate,
     time:this.state.addModalTime,
   };
   var postmethod="type=wuye&fun=addFix&data="+JSON.stringify(data);
   console.info(postmethod);
   var result=AJAX.send(postmethod);
   result.then(function (response) {
     console.log(response);
     return response.json();
   }).then(function (json) {
       console.log('插入返回json:'+json);
       var data=JSON.parse(json);
       if(data.type==0){
         message.error('错误：'+data.code);
       }else{
         message.success('添加数据成功');
         _this.getFixTable();
         _this.setState({
           addModalPerson:'',
           addModalProblem:'',
           addModalTel:'',
           addModalLocation:'',
         });
       }
   }).catch(function (ex) {
     console.log('parsing failed', ex)
   });
  }
  Cancel_modal_add = () => {
    this.setState({
      modal_add_visible: false,
    });
  }
  tableToCsv = () => {
    console.info('table to csv1');
    TOOLS.downloadFile(new Date().Format('yyyy/MM/dd/hh:mm')+'当前报修.csv',TOOLS.json2Csv(this.state.data));
  }

  changeAddModalLocation=(event)=>{
    this.setState({
      addModalLocation:event.target.value,
    });
  }
  changeAddModalPerson=(event)=>{
    this.setState({
      addModalPerson:event.target.value,
    });
  }
  changeAddModalProblem=(event)=>{
    this.setState({
      addModalProblem:event.target.value,
    });
  }
  changeAddModalTel=(event)=>{
    this.setState({
      addModalTel:event.target.value,
    });
  }
  changeAddModalDate=(event)=>{
    var value=event.format(dateFormat);
    console.info(value);
     this.setState({
       addModalDate:value,
     });
  }
  changeAddModalTime=(event)=>{
    var value=event.format(Timeformat);
    console.info(value);
     this.setState({
       addModalTime:value,
     });
  }




}
