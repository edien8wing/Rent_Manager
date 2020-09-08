import React from "react";
import { Link } from "react-router";
import {
  Checkbox,
  Badge,
  Row,
  Col,
  message,
  Table,
  Divider,
  Button,
} from "antd";

import AJAX from "../../bin/AJAX.js";

import "../../bin/DateSet.js";
import STR from "../../bin/STR.js";
import RoomConfigModal from "./component/RoomConfigModal.js";
import ContractBillDrawer from "./component/ContractBillDrawer.js";

/*表结构*/

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
    render: (text, recoder) => (
      <div>
        {text}
        {text ? (
          <Badge count={STR.minersTime(text).days} overflowCount={999}></Badge>
        ) : (
          ""
        )}
      </div>
    ),
  },
];

/**房间结构 */
export default class rentBuilding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      building: [],
      checkbox: [],
      checkedBuilding: [],
      roomData: [],
      displayDeletedRoom: false,
      roomConfigModal: false,
      //是否显示抽屉
      drawerVisible: false,
      //选择到的contract id
      contractId: null,
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
        let cbox = JSON.parse(
          JSON.stringify(arr).replace(/name/g, "label").replace(/id/g, "value")
        );
        console.info(cbox);
        _this.setState({ building: arr, checkbox: cbox });
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
  getRoombyBuildingId = (value) => {
    let _this = this;
    console.info("getRoombyBuildingId");
    let link =
      "type=rent&fun=getRoombyBuildingId&data=" +
      JSON.stringify(this.state.checkedBuilding) +
      "&o=0";
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
  //关闭modal触发刷新表格
  onModalCancel = () => {
    console.info("modalcancel");
    this.setState({ roomConfigModal: false }, () => {
      this.getRoombyBuildingId();
    });
  };

  /*多选框变动触发函数*/
  checkBoxOnChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    this.setState(
      {
        checkedBuilding: checkedValues,
      },
      () => {
        this.getRoombyBuildingId();
      }
    );
  };
  //checkbox触发
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
  TableClicked = (event, record) => {
    console.info(event, record);
    if (record.contractId) {
      this.setState({
        contractId: record.contractId,
        drawerVisible: true,
      });
    } else {
      message.error("没有履行中的合同");
    }
  };
  drawerClose = () => {
    this.setState({ drawerVisible: false });
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
          onResetTable={this.getRoombyBuildingId}
        />
        <Divider>building</Divider>
        <Checkbox.Group
          options={this.state.checkbox}
          onChange={this.checkBoxOnChange}
        />
        <Button type="primary" onClick={this.roomConfigModalonClicked}>
          编辑楼层及房源
        </Button>

        <Divider>统计信息</Divider>
        {this.state.checkedBuilding.length > 0 ? (
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
        {/*展示已经删除的房源*/}
        {/*
            <Checkbox defaultChecked={false} className='displayDeletedRoom' onChange={this.checkBox_displayDeletedRoom_OnChange}>显示已删除房源</Checkbox>
            
            */}
        <Table
          onRow={(record) => {
            return {
              onClick: (event) => {}, // 点击行
              onDoubleClick: (event) => {
                this.TableClicked(event, record);
              },
              onContextMenu: (event) => {},
              onMouseEnter: (event) => {}, // 鼠标移入行
              onMouseLeave: (event) => {},
            };
          }}
          columns={TableColumns}
          dataSource={this.state.roomData}
          onChange={this.TableOnChange}
          pagination={{ showSizeChanger: true }}
          size="small"
          footer={() => "共" + this.state.roomData.length + "条数据"}
        />
      </div>
    );
  }

  //渲染添加addmodal
}
