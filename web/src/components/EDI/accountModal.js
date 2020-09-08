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

const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const Timeformat = 'HH/mm';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

//const WrappedNormalLoginForm = Form.create()(Component_Login);
/*
  <Component_BorderFrame ref='bf' title={this.state.test} >

*/

export default class accountModal extends React.Component{
  constructor(props) {
    super(props);
    this.moment = 0;
  //  this.animation = { right: '-800px',opacity:'0', duration: 1000 };
  this.animation = { right: '-800px',opacity:'0', duration: 500 };
    this.props={
      id:0,

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
    };
    this.state = {
      id:0,
      
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

    };

  }
  componentWillMount(){

  }
/*

  close = () => {

    this.setState({
      paused: false,
      reverse: false,
      moment: null,
    });
  }
  open=()=>{
    this.setState({
      paused: false,
      reverse: true,
      moment: null,
    });
  }
*/





  render() {

    return(
      <Modal  title="结算页面"
        visible={this.props.accountModalVisible}
        onCancel={()=>{this.setState({accountModalVisible:false}) }}
        onOk={this.accountModalOk}
        >



        <Row className='row_bottom10' gutter={16}>
          <Col className='rightTitle' span={8}>
            TaskID:
          </Col>
          <Col span={14}>
            <Badge count={"ID:"+this.props.accountModalTaskId} style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }} />

          </Col>
        </Row>
        <Row className='row_bottom10' gutter={16}>
          <Col className='rightTitle' span={8}>
            节点时间:
          </Col>
          <Col span={8}>
            <Input disabled={true} size='small' value={this.props.accountModalTaskDate}/>
          </Col>

        </Row>


        <Collapse bordered={false} >
            <Panel style={{marginLeft:'50px',fontSize:'12px',color:'#f00',border:'0px'}} header="时间调整框" key="1" >
                <Row className='row_bottom0' gutter={16}>
                 <Col className='rightTitle' span={6}>
                   延迟天数:
                 </Col>
                 <Col span={5}>
                    <InputNumber min={-5} value={this.props.accountModalTaskDelayDays}
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
            <Input disabled={true} size='small' value={this.props.accountModalTaskPrices}/>
          </Col>
        </Row>
        <Row className='row_bottom10' gutter={16}>
          <Col className='rightTitle' span={8}>
            本期已付:
          </Col>
          <Col span={14}>

              <Input disabled={true} size='small' value={this.props.accountModalTaskPay}/>
          </Col>
        </Row>
        <Row className='row_bottom10' gutter={16}>
          <Col className='rightTitle' span={8}>
            此次支付:
          </Col>
          <Col span={7}>
            <InputNumber min={0} max={this.props.accountModalTaskPrices-this.props.accountModalTaskPay}
             value={this.props.accountModalCurrentPay} defaultValue={0}
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
              <Input disabled={true} size='small' value={this.props.accountModalTaskWtd}/>
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
            <TextArea rows={4} onChange={(ev)=>this.setState({accountModalTaskDw:ev.target.value})} value={this.props.accountModalTaskDw}></TextArea>
          </Col>
        </Row>
      </Modal>
      )
  }


/** 按下确定按钮*/
  accountModalOk=()=>{
    var data={
      missionId:this.props.id,
      MissiontoQUA:this.state.account_MissiontoQUA
    };
    
    console.info(data);
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
}
Component_BorderFrame.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  paused: PropTypes.bool,
};
