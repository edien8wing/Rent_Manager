import React from "react";
import { Link } from "react-router";
import { Radio, Row, Col, message, Divider, Button } from "antd";

import AJAX from "../../bin/AJAX.js";

import "../../bin/DateSet.js";

import RoomConfigModal from "./component/RoomConfigModal.js";
import ContractBillDrawer from "./component/ContractBillDrawer.js";

import "./css.css";

const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";

/*表结构*/
/*
const TableColumns = [
  {
    title: "房号ID",
    dataIndex: "id",
  },
  {
    title: "房间号",
    dataIndex: "name",
  },
  {
    title: "面积",
    dataIndex: "area",
  },
  {
    title: "楼层",
    dataIndex: "floor",
  },
  {
    title: "建筑",
    dataIndex: "building",
  },
  {
    title: "租户",
    dataIndex: "part_B",
  },
  {
    title: "合同到期时间",
    dataIndex: "endDate",
  },
];
*/
/**房间结构 */
export default class rentBuildingProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      building: [],
      radioBuilding: [],
      checkedBuilding_Value: null,
      roomData: [],
      displayDeletedRoom: false,
      roomConfigModal: false,
      //是否显示抽屉
      drawerVisible: false,
      //选择到的contract id
      contractId: null,
      floor: [],
      allArea: 0,
      allContractArea: 0,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillMount() {
    this.getBuilding();
  }

  getBuilding = () => {
    let _this = this;
    console.info("getbuilding");
    let link = "type=rent&fun=allBuilding";
    var result = AJAX.send(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;
        let radioData = JSON.parse(
          JSON.stringify(arr).replace(/name/g, "label").replace(/id/g, "value")
        );
        console.info(radioData);
        _this.setState({ building: arr, radioBuilding: radioData });
      });
  };

  getRoombyBuildingId = (value) => {
    let _this = this;
    //console.info("getRoombyBuildingId");
    let buildingData = new Array();
    buildingData.push(this.state.checkedBuilding_Value);
    let link =
      "type=rent&fun=getRoombyBuildingId&data=" +
      JSON.stringify(buildingData) +
      "&o=1";
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
        this.state.roomData = arr;
        this.calBuildingArea();
        this.setState({ roomData: arr });
      });
  };
  calBuildingArea = () => {
    let buildingArea = 0;
    let conArea = 0;
    this.state.roomData.forEach((item, key) => {
      buildingArea += item.area;
      if (item.part_B) {
        conArea += item.area;
      }
    });
    this.setState({ allArea: buildingArea, allContractArea: conArea });
  };
  /**/
  getFloorbyBuildingId = () => {
    let link =
      "type=rent&fun=getFloorByBuildingId&buildingId=" +
      JSON.stringify(this.state.checkedBuilding_Value);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;
        //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
        this.state.floor = arr;
        this.setState({ floor: arr });
      });
  };
  //关闭modal触发刷新表格
  onModalCancel = () => {
    console.info("modalcancel");
    this.setState({ roomConfigModal: false }, () => {
      this.getRoombyBuildingId();
      this.getFloorbyBuildingId();
    });
  };

  /*多选框变动触发函数*/
  radioBuildingOnChange = (checkedValues) => {
    this.state.checkedBuilding_Value = checkedValues.target.value;

    this.getFloorbyBuildingId();
    this.getRoombyBuildingId();
  };
  //radio触发
  checkBox_displayDeletedRoom_OnChange = (checkedValues) => {
    console.log(
      "checkBox_displayDeletedRoom_OnChange",
      checkedValues.target.checked
    );
    this.setState({
      displayDeletedRoom: checkedValues.target.checked,
    });
  };
  //不知道什么函数
  TableOOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  //打开modal触发
  roomConfigModalonClicked = () => {
    console.info("roomConfigModalonClicked");
    this.setState({ roomConfigModal: true });
  };

  drawerClose = () => {
    this.setState({ drawerVisible: false });
  };
  roomDoubleClicked = (conId) => {
    console.info("doubleClicked", conId);
    if (conId) {
      this.setState({
        contractId: conId,
        drawerVisible: true,
      });
    } else {
      message.error("没有履行中的合同");
    }
  };
  selectCss = (value) => {
    switch (value) {
      case 0:
        return "hasPart_B";
        break; //未完结
      case 1:
        return "willLeave";
        break; //已签退租
      case 2:
        return "approvaling";
        break; //审批中
      default:
        return "hasNoPart_B";
        break; //null 没有乙方
    }
  };
  /*主渲染函数 */
  render() {
    return (
      <div>
        <RoomConfigModal
          building={this.state.building}
          visible={this.state.roomConfigModal}
          onCancel={this.onModalCancel}
        ></RoomConfigModal>
        <ContractBillDrawer
          onClose={this.drawerClose}
          visible={this.state.drawerVisible}
          contractId={this.state.contractId}
        />
        <Divider>building</Divider>
        <Radio.Group
          options={this.state.radioBuilding}
          onChange={this.radioBuildingOnChange}
        />
        <Button type="primary" onClick={this.roomConfigModalonClicked}>
          编辑楼层及房源
        </Button>
        <Divider>统计信息</Divider>
        {this.state.checkedBuilding_Value ? (
          <Row
            style={{
              backgroundColor: "#6699CC",
              fontFamily: "aril",
              fontSize: "20px",
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
              margin: "5px",
              padding: "10px",
            }}
          >
            <Col span={8}>
              总面积为： {this.state.allArea.toFixed(2)}m<sup>2</sup>
            </Col>
            <Col span={8}>
              出租面积为：{this.state.allContractArea.toFixed(2)}m<sup>2</sup>
            </Col>
            <Col span={8}>
              出租率为：
              {(
                (this.state.allContractArea / this.state.allArea) *
                100
              ).toFixed(2)}
              %
            </Col>
          </Row>
        ) : (
          ""
        )}

        <Divider />
        <Row>
          {this.state.floor.map((floor, key) => {
            return (
              <Row>
                <Col span={2}>
                  <div
                    style={{
                      borderRight: "1px solid #ddd",
                      width: "85%",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        color: "#99b",
                        fontWeight: "bold",
                      }}
                    >
                      {floor.name}
                    </div>
                    <div style={{ fontSize: "10px" }}>
                      {floor.area}m<sup>2</sup>
                    </div>
                  </div>
                </Col>
                <Col span={22}>
                  <Row className="RoomRow">
                    {this.state.roomData.map((room, roomKey) => {
                      if (room.floorId == floor.id) {
                        let percent = (room.area / floor.area) * 100 + "%";
                        return (
                          <Col
                            onDoubleClick={this.roomDoubleClicked.bind(
                              this,
                              room.contractId
                            )}
                            style={{
                              width: percent,
                              display: "inline-block",
                              padding: 1,
                            }}
                          >
                            <div className={this.selectCss(room.isFinished)}>
                              <div className="roomName">
                                {room.part_B ? room.part_B + "_" : ""}
                                {room.name}
                              </div>
                              {room.area}m<sup>2</sup>
                            </div>
                          </Col>
                        );
                      }
                    })}
                  </Row>
                </Col>
                <Divider style={{ margin: "1px" }} />
              </Row>
            );
          })}
        </Row>
      </div>
    );
  }

  //渲染添加addmodal
}
