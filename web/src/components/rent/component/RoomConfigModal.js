import React from 'react'
import {Link} from 'react-router'
import {Tag,Radio,Collapse,Checkbox,Badge,InputNumber ,Tabs,Breadcrumb,Modal,Switch,Input ,TimePicker ,DatePicker,Row ,Col, message,Table, Icon, Divider,Button,Timeline } from 'antd'
import moment from 'moment';
import AJAX from '../../../bin/AJAX.js'
import Component_BorderFrame from '../../EDI/borderFrame.js';
import COOKIE from  '../../../bin/COOKIE.js';
import '../../../bin/DateSet.js';
import STR from '../../../bin/STR.js';
import config from '../../../bin/config.js';



const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const Timeformat = 'HH/mm';
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;





/**房间结构 */
export default class RoomConfigModal extends React.Component{


  constructor(props) {
    super(props);
    let width=window.innerWidth*0.6<800?800:window.innerWidth*0.6
    console.info(props);
    this.state={
        building:[],
        floor:[],
        room:[],
        visible:false,
        buildingSelectedId:0,
        buildingSelectedName:'',
        floorSelectedId:0,
        floorSelectedId:'',
        roomSelectedId:0,
        roomSelectedName:'',
        roomSelectedArea:'',
        floorText:'',
        roomText:'',
        roomArea:0,
        modalWidth:width,
    }
  }




  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps (props){
    //console.info('willreceive',props);
    this.setState(
      {
       
        'building':this.props.building,
      }
    );
  }


//选择建筑触发
  buildingRadioChange= e=>{
    console.info(e);
    this.setState({
      'buildingSelectedId':e.target.value,
    });
    this.getFloorByBuildingId(e.target.value);
  }
//选择楼层 触发
  floorRadioChange= e=>{
    console.info(e.target.value);
    this.setState({
      'floorSelectedId':e.target.value,
    });
    this.getRoomByFloorId(e.target.value);
  }
  roomRadioChange=e=>{
    console.info(e.target.value);
    this.setState({
      'roomSelectedId':e.target.value,
    })
  }

  //由buildingId 获取Floor数据
  getFloorByBuildingId=(buildingId)=>{
      let _this=this;
      console.info('getFloorByBuildingId');
      let link="type=rent&fun=getFloorByBuildingId&buildingId="+JSON.stringify(buildingId);
      var result=AJAX.send(link);
      console.info(link);
      result.then( (response)=>{
        return response.json()
    }).then((json)=>{
        let arr=JSON.parse(json).data;
        //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
        console.info(arr);
        this.setState({'floor':arr});
    })
  }

  getRoomByFloorId=(floorId)=>{
    let _this=this;
    console.info('getFloorByBuildingId');
    let link="type=rent&fun=getRoomByFloorId&floorId="+JSON.stringify(floorId);
    var result=AJAX.send(link);
    console.info(link);
    result.then( (response)=>{
      return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({'room':arr});
  })
}

floorTextChange=(e)=>{
  //console.info(e.target.value);
  this.setState({'floorText':e.target.value});
  
}

renameFloor=()=>{
  console.info(this.state.floorSelectedId,this.state.floorText);
  let _this=this;
  let link="type=rent&fun=renameFloor&floorId="
    +JSON.stringify(this.state.floorSelectedId)
    +"&floorText="
    +JSON.stringify(this.state.floorText)
    +"&buildingId="
    +JSON.stringify(this.state.buildingSelectedId);
  var result=AJAX.send(link);
  console.info(link);
  result.then( (response)=>{
    return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({
        'floor':arr[1],
        'floorText':'',
    },()=>{message.info('success')});
  })
}

addFloor=()=>{
  console.info(this.state.buildingSelectedId,this.state.floorText)
  let _this=this;
  let link="type=rent&fun=addFloor&buildingId="
    +JSON.stringify(this.state.buildingSelectedId)
    +"&floorText="
    +JSON.stringify(this.state.floorText);
    
  var result=AJAX.send(link);
  console.info(link);
  result.then( (response)=>{
    return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({
        'floor':arr[1],
        'floorText':'',
    },()=>{message.info('success')});
  })
}
roomTextChange=(e)=>{
  //console.info(e.target.value);
  this.setState({'roomText':e.target.value});
}
renameRoomClick=()=>{
  console.info(this.state.roomSelectedId,this.state.roomText,)
  let _this=this;
  let link="type=rent&fun=renameRoom&roomId="
    +JSON.stringify(this.state.roomSelectedId)
    +"&roomText="
    +JSON.stringify(this.state.roomText)
    +"&floorId="
    +JSON.stringify(this.state.floorSelectedId);
    
  var result=AJAX.send(link);
  console.info(link);
  result.then( (response)=>{
    return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({
        'room':arr[1],
        'roomText':'',
    },()=>{message.info('success')});
  })
}



changeRoomAreaClick=()=>{
  console.info(this.state.roomSelectedId,this.state.roomArea)
  let _this=this;
  let link="type=rent&fun=changeRoomArea&roomId="
    +JSON.stringify(this.state.roomSelectedId)
    +"&roomArea="
    +JSON.stringify(this.state.roomArea)
    +"&floorId="
    +JSON.stringify(this.state.floorSelectedId);
    
  var result=AJAX.send(link);
  console.info(link);
  result.then( (response)=>{
    return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({
        'room':arr[1],
        'roomArea':0,
    },()=>{message.info('success')});
  })
}
addRoom=()=>{
  console.info(this.state.roomSelectedId,this.state.roomArea)
  let _this=this;
  let link="type=rent&fun=addRoom&roomText="
    +JSON.stringify(this.state.roomText)
    +"&roomArea="
    +JSON.stringify(this.state.roomArea)
    +"&floorId="
    +JSON.stringify(this.state.floorSelectedId);
    
  var result=AJAX.send(link);
  console.info(link);
  result.then( (response)=>{
    return response.json()
  }).then((json)=>{
      let arr=JSON.parse(json).data;
      //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
      console.info(arr);
      this.setState({
        'room':arr[1],
        'roomArea':0,
        'roomText':''
    },()=>{message.info('success')});
  })
}
roomAreaTextChange=(value)=> {
  console.log('changed', value);
  this.setState({'roomArea':value});
}
delFloor=()=>{
  message.error('只有尤小伟可以删除，快去联系他');
}
/*主渲染函数 */
  render(){

    return(
        <Modal
        title="编辑楼层及房源"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={this.state.modalWidth}
        keyboard={true}
        footer={[]}
    >      
<Row>
  <Col span={7}>
      <Radio.Group buttonStyle="solid" onChange={this.buildingRadioChange}>
        {this.state.building.map((item,key)=>{
          return <Radio.Button value={item.id}>{item.name}</Radio.Button>
        })}

      </Radio.Group>
      
  </Col>
  <Col span={1}>
  <Divider type="vertical" />
  </Col>
  <Col span={7}>
      <Radio.Group buttonStyle="solid" onChange={this.floorRadioChange}>
      {this.state.floor.map((item,key)=>{
          return <Radio value={item.id}>{item.name}</Radio>
        })}
      </Radio.Group>
      
      <Divider />
      <Input placeholder="楼层名称" value={this.state.floorText}  onChange={this.floorTextChange}/>
        <Button type="primary" onClick={this.renameFloor}>重命名楼层</Button>
        <Button onClick={this.addFloor}>增加楼层</Button>
        <Button type="danger" onClick={this.delFloor}>删除楼层</Button>
  </Col>
  <Col span={1}>
<Divider type="vertical" />
  </Col>
  <Col span={8}>
  <Radio.Group buttonStyle="solid"  onChange={this.roomRadioChange}>
      {this.state.room.map((item,key)=>{
          return <Radio value={item.id}>{item.name}[{item.area}m<sup>2</sup>]</Radio>
        })}
      </Radio.Group>
      <Divider  />
      <Row>
        <Col span={20}>
        <InputGroup compact>
          <Input placeholder="房号" value={this.state.roomText} style={{ width: '100px' }} onChange={this.roomTextChange}/>
      <Button onClick={this.renameRoomClick}>重命名房间</Button>
      </InputGroup>
      <InputGroup compact>
          <InputNumber min={0} step={0.1} value={this.state.roomArea} style={{ width: '100px' }} onChange={this.roomAreaTextChange}/>
      <Button onClick={this.changeRoomAreaClick}>重定义面积</Button>
      </InputGroup>
        </Col>
        <Col span={4}>
        <Button style={{width:'55px',height:'55px',}} type='primary' onClick={this.addRoom}>新增<br/>房间</Button>
        </Col>
      </Row>




  </Col>
  </Row>
  </Modal>
    );
  }







}
