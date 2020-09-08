import React from "react";
import { Link } from "react-router";
import {
  Tag,
  Collapse,
  Checkbox,
  Badge,
  Tabs,
  Table,
  Divider,
  Button,
} from "antd";

import AJAX from "../../bin/AJAX.js";

import "../../bin/DateSet.js";
import STR from "../../bin/STR.js";
import config from "../../bin/config.js";
import ContractBillDrawer from "./component/ContractBillDrawer.js";
import AddContractModal from "./component/AddContractModal.js";

const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

/*表结构*/

const TableColumns = [
  {
    title: "合同ID",
    dataIndex: "id",
    render: (text, recoder) => (
      <div>
        {recoder.isFinished == 0 ? <Tag color="green">执行中{text}</Tag> : ""}
        {recoder.isFinished == 1 ? <Tag color="red">已签退{text}</Tag> : ""}
        {recoder.isFinished == 2 ? <Tag color="#7c7407">审批中{text}</Tag> : ""}
        {recoder.isFinished == -1 ? <Tag color="gray">拒绝{text}</Tag> : ""}
      </div>
    ),
  },
  {
    title: "承租方",
    dataIndex: "part_B",
  },
  { title: "房号", dataIndex: "room" },
  {
    title: "建筑",
    dataIndex: "building",
  },
  {
    title: "面积",
    dataIndex: "area",
  },
  {
    title: "合同开始时间",
    dataIndex: "beginDate",
    render: (text, recoder) => (
      <div>
        {text}
        <Badge count={STR.minersTime(text).days} overflowCount={999}></Badge>
      </div>
    ),
  },
  {
    title: "合同到期时间",
    dataIndex: "endDate",
    render: (text, recoder) => (
      <div>
        {text}
        <Badge count={STR.minersTime(text).days} overflowCount={999}></Badge>
      </div>
    ),
    defaultSortOrder: "ascend",
    sorter: (a, b) =>
      STR.minersTime(a.endDate).days - STR.minersTime(b.endDate).days,
    sortDirections: ["descend", "ascend"],
  },
];

const checkBox_displayFinishedContract = [
  { label: "履行的合同", value: 0 },
  { label: "结束的合同", value: 1 },
  { label: "正在审批的合同", value: 2 },
  { label: "审批遭拒", value: -1 },
];

/**合同结构 */
export default class rentContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //建筑信息
      building: [],
      //建筑checkbox
      checkbox: [],
      //建筑确定结果
      checkedBuilding: [],
      //合同数据这是表的主体
      contractData: [],
      //是否显示已经结束的合同
      //displayDeletedRoom:false,
      displayFinishedContract: [0],
      //是否显示抽屉
      drawerVisible: false,
      //选择到的contract id
      contractId: null,
      //
      AddContractModalVisible: false,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillMount() {
    this.getBuilding();
    this.getContractByBuildingId();
  }

  /** 获取building 信息 */
  getBuilding = () => {
    let _this = this;
    console.info("getbuilding");
    let link = "type=rent&fun=allBuilding";
    var result = AJAX.send(link);
    result
      .then((response) => {
        //console.info("getbuilding", response);
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

  getContractByBuildingId = () => {
    let _this = this;
    console.info("getContractByBuildingId");
    let link =
      "type=rent&fun=getContractByBuildingId&data=" +
      JSON.stringify(this.state.checkedBuilding) +
      "&isFinished=" +
      JSON.stringify(this.state.displayFinishedContract);
    console.info("link", link);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;

        console.info(arr);
        this.setState({ contractData: arr });
      });
  };

  /*建筑多选框变动触发函数*/
  BuildingCheckBoxOnChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    this.setState(
      {
        checkedBuilding: checkedValues,
      },
      () => {
        this.getContractByBuildingId();
      }
    );
  };

  /*显示完结合同多选框变动触发函数*/
  checkBox_displayFinishedContract_OnChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    this.setState(
      {
        displayFinishedContract: checkedValues,
      },
      () => {
        this.getContractByBuildingId();
      }
    );
  };
  addContractButtonOnClick = () => {
    this.setState({
      AddContractModalVisible: true,
    });
  };
  TableOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  closeAddContractModal = () => {
    this.setState({ AddContractModalVisible: false });
  };
  TableClicked = (event, record) => {
    console.info(event, record);
    this.setState({
      contractId: record.id,
      drawerVisible: true,
    });
  };
  drawerClose = () => {
    this.setState({ drawerVisible: false });
  };
  ModalCancel = () => {
    this.setState({ AddContractModalVisible: false });
  };
  /*主渲染函数 */
  render() {
    return (
      <div>
        <AddContractModal
          building={this.state.building}
          visible={this.state.AddContractModalVisible}
          onCancel={this.closeAddContractModal}
          onModalCancel={this.ModalCancel}
        ></AddContractModal>
        <Divider>building[全不选等于全选]</Divider>
        <Checkbox.Group
          options={this.state.checkbox}
          onChange={this.BuildingCheckBoxOnChange}
        />
        <Divider>是否显示完结的合同</Divider>
        <Checkbox.Group
          options={checkBox_displayFinishedContract}
          onChange={this.checkBox_displayFinishedContract_OnChange}
          value={this.state.displayFinishedContract}
        />
        {config.hasRule(606) ? (
          <Button onClick={this.addContractButtonOnClick}>添加新合同</Button>
        ) : (
          ""
        )}

        <ContractBillDrawer
          onClose={this.drawerClose}
          visible={this.state.drawerVisible}
          contractId={this.state.contractId}
          onResetTable={this.getContractByBuildingId}
        />
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
          dataSource={this.state.contractData}
          onChange={this.TableOnChange}
          pagination={{ showSizeChanger: true }}
          size="small"
          footer={() => "共" + this.state.contractData.length + "条数据"}
        />
      </div>
    );
  }

  //渲染添加addmodal
}
