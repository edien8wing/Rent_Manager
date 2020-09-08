import React from 'react';
import {Select,InputNumber ,Tabs,Breadcrumb,Modal,Switch,Input ,TimePicker ,DatePicker,Row ,Col, message,Table, Icon, Divider,Button,Timeline } from 'antd'
import moment from 'moment';
import AJAX from '../../../bin/AJAX.js'
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const Timeformat = 'HH/mm';
const TabPane = Tabs.TabPane;
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
import STR from '../../../bin/STR.js';
import '../../../assets/css/currentFix.css';

export default class ChangeEvalModal extends React.Component{


  constructor(props){
    super(props);
    console.info("change_eval_modal,",props);
    this.state={
      //modal数据
      visible:this.props.visible,
      missionID:this.props.missionID,
      missionObject:this.props.missionObject,
      eval:this.props.eval,
    }
  }

 


  onCancel=(ev)=>{
     //this.setState({visible:false});
     this.isClosed();
  }

  onOK=(ev)=>{
    this.sendChangeEvalInfo();
    
  }


  sendChangeEvalInfo=()=>{
      var _this=this;
      var data= {
        missionID:this.state.missionID,
        eval:STR.standard(this.state.eval),
      }
      console.info("type=hetong&fun=changeEval&data="+JSON.stringify(data));
      var result=AJAX.send("type=hetong&fun=changeEval&data="+JSON.stringify(data));
      
      
      result.then(function (response) {
        return response.json()
      }).then(function (json) {
        var data=JSON.parse(json);
        console.info(data);
        if(data.ans.stat==0){
          message.info('修改成功 刷新查看新数据');
          _this.isClosed();
        }else {
          message.error(json);
        }
      })
  }


  onChange=(ev)=>{
    //console.info(ev.target.value);
    this.setState({eval:ev.target.value});
  }


  componentWillReceiveProps (nextProps) {
      console.info("componentWillReceiveProps",nextProps);
      this.setState({
          visible:nextProps.visible,
          missionID:nextProps.missionID,
          missionObject:nextProps.missionObject,
          eval:nextProps.eval,
      });
  }

  isClosed=()=>{
    this.props.isClosed(true);
  }

  render(){
    var _this=this;
    return(
      <div>
      <Modal
          width={800}
          title={"请评价 MissionID"+this.state.missionID+" "+this.state.missionObject}
          visible={this.state.visible}
          onOk={this.onOK}
          onCancel={this.onCancel}
        >
           <TextArea rows={4} onChange={this.onChange} value={this.state.eval}/>
             
           
        </Modal>
      </div>
    );
  }







}
