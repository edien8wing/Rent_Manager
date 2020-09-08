import React from "react";
import { Link } from "react-router";
import {
  Tag,
  Radio,
  Collapse,
  Checkbox,
  Badge,
  InputNumber,
  Tabs,
  Breadcrumb,
  Modal,
  Switch,
  Input,
  TimePicker,
  DatePicker,
  Row,
  Col,
  message,
  Table,
  Icon,
  Divider,
  Button,
  Timeline,
} from "antd";
import moment from "moment";
import AJAX from "../../../bin/AJAX.js";
import Component_BorderFrame from "../../EDI/borderFrame.js";
import COOKIE from "../../../bin/COOKIE.js";
import "../../../bin/DateSet.js";
import STR from "../../../bin/STR.js";
import config from "../../../bin/config.js";
import AddContractInfo from "./AddContractInfo.js";
import "./css.css";
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;
const radioBuildingStyle = {
  display: "block",
  lineHeight: "20px",
  width: "50px",
};
const radioFloorStyle = {
  height: "20px",
  lineHeight: "20px",
};
const radioRoomStyle = {
  display: "block",
  lineHeight: "20px",
  width: "50px",
};
/**房间结构 */
export default class AddContractModal extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth * 0.7 < 800 ? 800 : window.innerWidth * 0.7;
    console.info(props);
    this.state = {
      building: [],
      floor: [],
      room: [],
      buildingName: "",
      roomList: [] /*确定的房间号*/,
      visible: false,
      buildingSelectedId: 0,
      buildingSelectedName: "",
      floorSelectedId: 0,
      floorSelectedId: "",
      roomSelectedId: null,
      roomSelectedName: "",
      roomSelectedArea: "",
      roomListSelectedId: null,
      floorText: "",
      roomText: "",
      roomArea: 0,
      sumArea: 0,
      modalWidth: width,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    //console.info('willreceive',props);
    this.setState({
      building: this.props.building,
    });
  }

  //选择建筑触发
  buildingRadioChange = (e) => {
    console.info(e);
    this.setState({
      buildingSelectedId: e.target.value,
    });
    this.getFloorByBuildingId(e.target.value);
  };
  //选择楼层 触发
  floorRadioChange = (e) => {
    console.info(e.target.value, e.target.value2);
    this.setState({
      floorSelectedId: e.target.value,
      roomSelectedId: null,
    });
    this.getRoomByFloorId(e.target.value);
  };

  //由buildingId 获取Floor数据
  getFloorByBuildingId = (buildingId) => {
    let _this = this;
    console.info("getFloorByBuildingId");
    let link =
      "type=rent&fun=getFloorByBuildingId&buildingId=" +
      JSON.stringify(buildingId);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;
        //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
        console.info(arr);
        this.setState({ floor: arr });
      });
  };

  getRoomByFloorId = (floorId) => {
    let _this = this;
    console.info("getFloorByBuildingId");
    let link =
      "type=rent&fun=getRoomByFloorId&floorId=" + JSON.stringify(floorId);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;
        //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
        console.info(arr);
        this.setState({ room: arr });
      });
  };

  floorTextChange = (e) => {
    //console.info(e.target.value);
    this.setState({ floorText: e.target.value });
  };

  roomRadioChange = (e) => {
    console.info(this.state.room[e.target.value]);
    this.setState({
      roomSelectedId: e.target.value /**********notice
      
      */,
    });
  };
  roomListRadioChange = (e) => {
    console.info(this.state.roomList[e.target.value]);
    this.setState({ roomListSelectedId: e.target.value });
  };

  /*添加房源到备选列表*/
  addRoomToList = () => {
    console.info("addRoomToList");
    let hasValue = false;
    this.state.roomList.forEach((item) => {
      console.info("xunhuan", item);
      if (item.id == this.state.room[this.state.roomSelectedId].id) {
        message.error("列表中已经有了所选房源");
        hasValue = true;
      }
    });
    //如果没有重复id则添加房源并计算 sumArea
    if (!hasValue) {
      this.state.roomList.push(this.state.room[this.state.roomSelectedId]);
      console.info(this.state.room);
      let bName = "";
      for (let i = 0; i < this.state.building.length; i++) {
        if (this.state.building[i].id == this.state.buildingSelectedId) {
          bName = this.state.building[i].name;
          break;
        }
      }
      this.setState({
        roomList: this.state.roomList,
        buildingName: bName,
      });
    }
    this.setState({ roomSelectedId: null });
    this.calSumAreabyRoomList();
  };
  calSumAreabyRoomList = () => {
    let sumArea = 0;
    this.state.roomList.forEach((item) => {
      sumArea += item.area;
    });
    this.setState({ sumArea: sumArea.toFixed(2) });
  };
  //从备选列表删除
  delRoomFromList = () => {
    console.info("delRoomFromList");
    this.state.roomList.splice(this.state.roomListSelectedId, 1);
    this.setState({
      roomList: this.state.roomList,
    });
    this.calSumAreabyRoomList();
  };

  closeModal = () => {
    console.info("closeModal");
    this.props.onModalCancel();
  };
  /*主渲染函数 */
  render() {
    return (
      <Modal
        title="新建合同"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={this.state.modalWidth}
        keyboard={true}
        footer={[]}
      >
        <div className="rowTitle">1.添加租赁房源</div>
        <Row
          style={{ border: "1px solid #eee", margin: "10px", padding: "10px" }}
        >
          <Col span={16}>
            <Row>
              <Col span={6}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={this.buildingRadioChange}
                >
                  {this.state.building.map((item, key) => {
                    return (
                      <Radio value={item.id} style={radioBuildingStyle}>
                        {item.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Col>

              <Col span={7} offset={1}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={this.floorRadioChange}
                >
                  {this.state.floor.map((item, key) => {
                    return (
                      <Radio
                        value={item.id}
                        value2={key}
                        style={radioFloorStyle}
                      >
                        {item.name}
                      </Radio>
                    );
                  })}
                </Radio.Group>
              </Col>

              <Col span={8} offset={1}>
                <Radio.Group
                  buttonStyle="solid"
                  onChange={this.roomRadioChange}
                >
                  {this.state.room.map((item, key) => {
                    return (
                      <Radio
                        value={key /*room中的序号方便后续取出*/}
                        style={radioRoomStyle}
                      >
                        {item.name}[{item.area}m<sup>2</sup>]
                      </Radio>
                    );
                  })}
                </Radio.Group>

                <Divider />
                {this.state.roomSelectedId != null ? (
                  <Button onClick={this.addRoomToList}>添加</Button>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Col>

          <Col span={7} offset={1} style={{ backgroundColor: "#eef" }}>
            <Radio.Group
              buttonStyle="solid"
              onChange={this.roomListRadioChange}
            >
              {this.state.roomList.map((item, key) => {
                return (
                  <Radio
                    value={key /*room中的序号方便后续取出*/}
                    style={radioRoomStyle}
                  >
                    {item.name}[{item.area}m<sup>2</sup>]
                  </Radio>
                );
              })}
            </Radio.Group>
            <Divider />
            {this.state.roomListSelectedId != null ? (
              <div>
                <Button onClick={this.delRoomFromList}>删除</Button>
                <Divider />
              </div>
            ) : (
              ""
            )}

            <div
              style={{
                fontSize: "25px",
                fontFamily: "fantasy",
                color: "#108ee9",
              }}
            >
              合计面积：{this.state.sumArea}m<sup>2</sup>
            </div>
          </Col>
        </Row>
        <AddContractInfo
          contractRoomArea={this.state.sumArea}
          roomList={this.state.roomList}
          closeModal={this.closeModal}
          buildingName={this.state.buildingName}
        />
      </Modal>
    );
  }
}
