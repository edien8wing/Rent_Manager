import React from 'react';
import {Select,InputNumber ,Tabs,Breadcrumb,Modal,Switch,Input ,TimePicker ,DatePicker,Row ,Col, message,Table, Icon, Divider,Button,Timeline } from 'antd'
import moment from 'moment';
import AJAX from '../../bin/AJAX.js'
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const Timeformat = 'HH/mm';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
import STR from '../../bin/STR.js';
import '../../assets/css/currentFix.css';

export default class Component_addMissionModal extends React.Component{
  constructor(props){
    super(props);
    this.state={
      //modal数据
      visible:this.props.visible,
      ModaldaxiePrice:'',
      addModalContractId :'',
      addModalObject :'',
      addModalEmplo :'',
      addModalType :'',
      addModalPrices :'',
      addModalComp :'',
      addModalFactory :'',
      addModalPerson :'',
      addModalTel :'',
      addModalDate:(new Date()).Format("yyyy/MM/dd"),
      addModalTask: [{'date':(new Date()).Format("yyyy/MM/dd"),'whatToDo':'','percent':'','prices':''}],
      activeKey:'1',
      sum_percent:'0',
      sum_prices:'0',
      missionType:[],
      Emplo:[],
    }
   this.loadType();
   this.loadName();
  }
  loadType=()=>{
    var _this=this;
    var result=AJAX.send("type=hetong&fun=missionType");
    result.then(function (response) {
    //  console.log(response)
      return response.json()
    }).then(function (json) {
        //console.log('now', json);
        var data=JSON.parse(json);
        if(data.type==0){
          message.error('没有获取到mission类型树：'+data.code);
      }else{
      //  message.success('获取到报修记录'+data.data.length+'条数据');
      //  console.info(data.data);
        _this.setState({
          missionType:data.data,
        });
      }
    }).catch(function (ex) {
      console.log('parsing failed', ex)
    });
  }
  loadName=()=>{
    let _this=this;
    var result=AJAX.send2('hetong','users');
    result.then(function(json){
      console.info('testloadname:',JSON.parse(json))
      _this.setState({Emplo:JSON.parse(json).data})
    })
  }
  componentWillUpdate(){
    //console.info('willupdate');

  }
  render(){
    var _this=this;
    return(
      <div>
      <Modal
          width={800}
          title="添加Mission记录"
          visible={this.props.visible}
          onOk={this.Ok_modal_add}
          onCancel={this.Cancel_modal_add}
          footer={null}
        >
      <Tabs type="card" onChange={this.changeTab.bind(this)} activeKey={this.state.activeKey}>
        <TabPane tab="1.Mission信息" key="1">
        <Row className='row_height'>
          <Col className='child_right' span={4} ><span><span className='red'>*</span>合同编号</span></Col>
          <Col span={7}><Input size='small' placeholder="合同编号" value={this.state.addModalContractId} onChange={this.changeAddModalContractId.bind(this)}/></Col>

          <Col className='child_right' span={4} ><span><span className='red'>*</span>目标</span></Col>
          <Col span={7}><Input size='small' placeholder="目标" value={this.state.addModalObject} onChange={this.changeAddModalObject.bind(this)}/></Col>
        </Row>
        <Row className='row_height'>
          <Col className='child_right' span={4} ><span className='red'>*</span>责任人</Col>
          <Col span={7}>
            <Select style={{ width: 120 }} size='small' onChange={this.changeAddModalEmplo}>
            {this.state.Emplo.map(function(line){
              //console.info(line);
              return(<Option value={line.id}>{line.name}</Option>)
            })}
            </Select>
          </Col>

          <Col className='child_right' span={4} ><span className='red'>*</span>类型</Col>
          <Col span={7}>
            <Select style={{ width: 120 }} size='small' onChange={this.changeAddModalType}>
            {this.state.missionType.map(function(line){
              //console.info(line);
              return(<Option value={line.id}>{line.type}</Option>)
            })}
            </Select>
          </Col>
        </Row>
        <Row className='row_height'>
          <Col className='child_right' span={4} ><span className='red'>*</span>总价</Col>
          <Col span={7}>
          <InputNumber  defaultValue={1000} style={{width:'200'}}
          value={this.state.addModalPrices} onChange={this.changeAddModalPrices.bind(this)}
          size='small'
          />
          <br/>
          <div>
          {this.state.ModaldaxiePrice}
          </div>
          </Col>

          <Col className='child_right' span={4} ><span className='red'>*</span>我方抬头</Col>
          <Col span={7}><Input size='small' placeholder="我方抬头" value={this.state.addModalComp} onChange={this.changeAddModalComp.bind(this)}/></Col>
        </Row>
        <Row className='row_height'>
          <Col className='child_right' span={4} ><span className='red'>*</span>乙方抬头</Col>
          <Col span={7}><Input size='small' placeholder="乙方抬头" value={this.state.addModalFactory} onChange={this.changeAddModalFactory.bind(this)}/></Col>

          <Col className='child_right' span={4} ><span className='red'>*</span>乙方人员</Col>
          <Col span={7}><Input size='small' placeholder="乙方人员" value={this.state.addModalPerson} onChange={this.changeAddModalPerson.bind(this)}/></Col>
        </Row>
        <Row className='row_height'>
          <Col className='child_right' span={4} ><span className='red'>*</span>乙方电话</Col>
          <Col span={7}><Input size='small' placeholder="乙方电话" value={this.state.addModalTel} onChange={this.changeAddModalTel.bind(this)}/></Col>

          <Col className='child_right' span={4}><span className='red'>*</span>合同时间</Col>
          <Col span={7}>
            <DatePicker style={{marginBottom:'10px'}}
            defaultValue={moment(this.state.addModalDate, dateFormat)}
            value={moment(this.state.addModalDate, dateFormat)}
            format={dateFormat}
            onChange={this.changeAddModalDate.bind(this)}
            />
          </Col>
        </Row>
        <Divider/>
        <div style={{textAlign:'right'}}>
          <Button onClick={this.Cancel_modal_add }>取消</Button>
          <Button type="primary" onClick={this.changeTab.bind(this,'2')}>下一步</Button>

        </div>
        </TabPane>
        <TabPane tab="2.task节点信息" key="2">
          <Row className='row_height10'>
            <Col className='child_right' span={1} ><span>Num</span></Col>
            <Col className='child_right' span={4} ><span>节点时间</span></Col>
            <Col className='child_right' span={11} ><span>要做什么</span></Col>
            <Col className='child_right' span={2} ><span>百分比%</span></Col>
            <Col className='child_right' span={5} ><span>金额</span></Col>
            <Col className='child_right' span={1} ><span>opt</span></Col>
          </Row>
          <Divider style={{marginBottom:'5px',marginTop:'5px'}}/>
          {
          _this.state.addModalTask.map(function(i,index){
            return(
              <Row className='row_height5'>
                <Col className='child_right' span={1} ><span>{index}</span></Col>
                <Col className='child_right' span={4}>
                  <DatePicker size='small' defaultValue={moment(i.date, dateFormat)} format={dateFormat} onChange={_this.changeDate.bind(this,index)}/>
                </Col>
                <Col className='child_right' span={11}><Input size='small' value={i.whatToDo}  onChange={_this.changeValue.bind(this,index,'whatToDo')}></Input></Col>
                <Col className='child_right' span={2}><Input size='small' value={i.percent} onChange={_this.changeValue.bind(this,index,'percent')}></Input></Col>
                <Col className='child_right' span={5}><Input size='small' value={i.prices}  onChange={_this.changeValue.bind(this,index,'prices')}></Input></Col>
                <Col className='child_right' span={1}> <Button size='small' type="dashed" onClick={_this.deleteLine.bind(this,index)} shape="circle" icon="cross" /></Col>
              </Row>
            );
          })
        }
          <Divider style={{marginBottom:'5px',marginTop:'5px'}}/>
          <Row className='row_height5'>
            <Col className='child_right' span={14} ><span style={{color:'#aaa'}}>只需合计金额差额为0即可通过</span></Col>
            <Col className='child_right' span={2} ><span>合计</span></Col>
            <Col className='child_right' span={2} ><span>{this.state.sum_percent}</span></Col>
            <Col className='child_right' span={5} ><span>{this.state.sum_prices}</span></Col>
            <Col className='child_right' span={1} ><span></span></Col>
          </Row>
          <Row className='row_height5'>
            <Col className='child_right' span={1} ><span></span></Col>
            <Col className='child_right' span={4} ><span></span></Col>
            <Col className='child_right' span={11} ><span>- 目标</span></Col>
            <Col className='child_right' span={2} ><span>100%</span></Col>
            <Col className='child_right' span={5} ><span>{this.state.addModalPrices}元</span></Col>
            <Col className='child_right' span={1} ><span></span></Col>
          </Row>

          <Row className='row_height5'>
            <Col className='child_right' span={14} ><span></span></Col>
            <Col className='child_right' span={2} ><span>差额</span></Col>
            <Col className='child_right' span={2} style={{'border-top':'solid 1px',}}><span>{(100-this.state.sum_percent).toFixed(2)}%</span></Col>
            <Col className='child_right' span={5} style={{'border-top':'solid 1px',}}><span style={{color:((this.state.addModalPrices-this.state.sum_prices).toFixed(2)==0.00?'#0f0':'#f00')}}>{(this.state.addModalPrices-this.state.sum_prices).toFixed(2)}元</span></Col>
            <Col className='child_right' span={1} style={{'border-top':'solid 1px',}}><span></span></Col>
          </Row>
        <Divider/>
        <Row className='row_height5'>
          <Col className='child_right' span={5} >
            <Button onClick={this.addTaskLine}>增加一行</Button>
          </Col>
          <Col className='child_right' span={11} ></Col>
          <Col className='child_right' span={8} >
            <Button onClick={this.Cancel_modal_add}>关闭</Button>
            <Button type='primary' onClick={this.sendModal}>确认添加</Button>
          </Col>

        </Row>

        </TabPane>
     </Tabs>
        </Modal>
      </div>
    );
  }

  sendModal=()=>{

    if(this.tab2isfinished()){
      var json={
        addModalContractId :this.state.addModalContractId,
        addModalObject :this.state.addModalObject,
        addModalEmplo :this.state.addModalEmplo,
        addModalType :this.state.addModalType,
        addModalPrices :this.state.addModalPrices,
        addModalComp :this.state.addModalComp,
        addModalFactory :this.state.addModalFactory,
        addModalPerson :this.state.addModalPerson,
        addModalTel :this.state.addModalTel,
        addModalDate:this.state.addModalDate,
        addModalTask: this.state.addModalTask,
      };
        this.props.getValue(json);

        //清空state
        this.setState({
            ModaldaxiePrice:'',
            addModalContractId :'',
            addModalObject :'',
            addModalEmplo :'',
            addModalType :'',
            addModalPrices :'',
            addModalComp :'',
            addModalFactory :'',
            addModalPerson :'',
            addModalTel :'',
            addModalDate:(new Date()).Format("yyyy/MM/dd"),
            addModalTask: [{'date':(new Date()).Format("yyyy/MM/dd"),'whatToDo':'','percent':'','prices':''}],
            activeKey:'1',
            sum_percent:'0',
            sum_prices:'0',
        });
        this.Cancel_modal_add();

    }

  }
  changeTab=(index)=>{
    //console.info(index);
    if(this.tab1isfinished()){
      this.setState({
        activeKey:index,
      });
    }else{
      message.error('1.Mission 还有没有完成的空格');
    }
  }

  tab1isfinished=()=>{
    //console.info()
    console.info(
          STR.standard(this.state.addModalEmplo)

        )
    if(
      STR.standard(this.state.addModalContractId+'')==''||
      STR.standard(this.state.addModalObject+'')==''||
      STR.standard(this.state.addModalEmplo+'')==''||
      STR.standard(this.state.addModalType+'')==''||
      STR.standard(this.state.addModalPrices+'')==''||
      STR.standard(this.state.addModalComp+'')==''||
      STR.standard(this.state.addModalFactory+'')==''||
      STR.standard(this.state.addModalPerson+'')==''||
      STR.standard(this.state.addModalTel+'')==''
    ){
      return false
    } else{
      return true
    }
  }
  tab2isfinished=()=>{
    var back=true;
    for(let i=0;i<this.state.addModalTask.length;i++){
      if(this.state.addModalTask[i].whatToDo==''||
        this.state.addModalTask[i].prices==''){
          back=false;
          message.error('task页面还有空缺');
          break;
        }
    }
    if((this.state.addModalPrices-this.state.sum_prices).toFixed(2)!=0.00){
      message.error('task页面合计金额和总金额不符');
      back=false;
    }
    return back;
  }
  changeDate=(index,moment,str)=>{
    this.setState();
    var recent=this.state.addModalTask;

    var line=recent[index];

    line.date=str;
    recent.splice(index,1,line);
      // console.info(recent);
    this.setState({
     addModalTask:recent,
    });
  }
  changeValue=(index,item,e)=>{

    var recent=this.state.addModalTask;
    var line=recent[index];
    line[item]=e.target.value;
    if(item=='percent'){
      line.prices=(parseFloat(e.target.value)*
                  parseFloat(this.state.addModalPrices)
                  /100).toFixed(2);
    }if(item=='prices'){
      line.percent=(parseFloat(e.target.value)/
                  parseFloat(this.state.addModalPrices)*
                  100).toFixed(2);
    }
    recent.splice(index,1,line);
  //  console.info(recent);
    this.setState({
     addModalTask:recent,
   },function(){
     this.calSum();
   });

  }
  deleteLine=(index)=>{
  //  console.info(index);
    var json=this.state.addModalTask;
    json.splice(index,1);
    this.setState({
      addModalTask:json,
    },function(){
      this.calSum();
    });
  }
  show_modal_add = () => {
    this.setState({
      modal_add_visible: true,
      addModalDate:(new Date()).Format("yyyy/MM/dd"),
    });
  }

  changeAddModalContractId=(ev)=>{

    this.setState({
      addModalContractId:ev.target.value,
    });
  }
  changeAddModalObject=(ev)=>{
    this.setState({
      addModalObject :ev.target.value
    });
  }
  changeAddModalEmplo=(value)=>{

    this.setState({
      'addModalEmplo':value,
    });
  }
  changeAddModalType=(value)=>{
    //console.info(value)
    this.setState({
      addModalType:value,
    });
  }
  changeAddModalPrices=(value)=>{
    this.setState({
      addModalPrices:value,
      ModaldaxiePrice:STR.DX(value),
    });
  }
  changeAddModalComp=(ev)=>{
    this.setState({
      addModalComp :ev.target.value
    });
  }
  changeAddModalFactory=(ev)=>{
    this.setState({
      addModalFactory :ev.target.value
    });
  }
  changeAddModalPerson=(ev)=>{
    this.setState({
      addModalPerson :ev.target.value
    });
  }
  changeAddModalTel=(ev)=>{
    this.setState({
      addModalTel :ev.target.value
    });
  }
  changeAddModalDate=(moment,date)=>{
    //console.info(moment,date);
    this.setState({
      addModalDate :date
    });
  }
Cancel_modal_add=(ev)=>{
  this.props.onClose();
}
calSum=()=>{
  var sum_prices=0;
  var sum_percent=0;
  for(let i = 0;i<this.state.addModalTask.length;i++){
    sum_prices+=parseFloat(this.state.addModalTask[i].prices);
    sum_percent+=parseFloat(this.state.addModalTask[i].percent);
  }
  this.setState({
    sum_prices:sum_prices.toFixed(2),
    sum_percent:sum_percent.toFixed(2),
  });
}
addTaskLine=()=>{
//  console.info('addTaskLine');
  var json=this.state.addModalTask;
  json.push({'date':(new Date()).Format("yyyy/MM/dd"),'whatToDo':'','percent':'','prices':''});
  var averageP=(100.00/json.length).toFixed(2);
  var average = (averageP*parseInt(this.state.addModalPrices)/100).toFixed(2);

  for(let i =0;i<json.length;i++){
    json[i].percent=averageP;
    json[i].prices=average;
  }
//  console.info(averageP ,average);
//  console.info(json);
  this.setState({
    addModalTask:json
  },function(){
    this.calSum();
  });
}
}
