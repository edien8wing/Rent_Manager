import React from "react";
import { Link } from "react-router";
import {
  Tag,
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
import AJAX from "../../bin/AJAX.js";
import Component_BorderFrame from "../EDI/borderFrame.js";
import COOKIE from "../../bin/COOKIE.js";
import "../../bin/DateSet.js";
import STR from "../../bin/STR.js";
import config from "../../bin/config.js";
import ContractBillDrawer from "./component/ContractBillDrawer.js";
import { Legend, Label, Chart, Geom, Axis, Tooltip } from "bizcharts";
import Component_addMissionModal from "../hetong/Component_addMissionModal.js";
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

/*表结构*/

const TableColumns = [
  {
    title: "账单ID",
    dataIndex: "billId",
    render: (text, recoder) => (
      <div>
        {recoder.isFinished == 0 ? <Tag color="green">执行中{text}</Tag> : ""}
        {recoder.isFinished == 1 ? <Tag color="gray">已完结{text}</Tag> : ""}
        {recoder.isFinished == 2 ? <Tag color="#7c7407">审批中{text}</Tag> : ""}
      </div>
    ),
  },
  {
    title: "类型",
    dataIndex: "info",
    render: (text, recoder) => (
      <div>
        {recoder.type == 0 ? <Tag color="green">{text}</Tag> : ""}
        {recoder.type == 1 ? <Tag color="gray">{text}</Tag> : ""}
        {recoder.type == 2 ? <Tag color="#7c7407">{text}</Tag> : ""}
      </div>
    ),
  },
  {
    title: "承租方",
    dataIndex: "part_B",
  },
  {
    title: "建筑",
    dataIndex: "building",
  },
  {
    title: "房号",
    dataIndex: "room",
  },
  {
    title: "面积",
    dataIndex: "area",
  },
  {
    title: "账期起始日",
    dataIndex: "billBeginDate",
  },
  {
    title: "账期截止日",
    dataIndex: "billEndDate",
  },
  {
    title: "账期金额",
    dataIndex: "money",
    render: (text, recoder) => (
      <div>
        {recoder.isPaid == 0 ? (
          <span style={{ color: "red" }}>{text}元</span>
        ) : (
          <span>{text}元</span>
        )}
      </div>
    ),
  },
];

/**合同结构 */
export default class rentBI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //建筑信息
      building: [],
      //建筑checkbox
      checkbox: [],
      //建筑确定结果
      checkedBuilding: [],
      //合同数据
      BI1data: [[], []],
      //是否显示已经结束的合同
      //displayDeletedRoom:false,
      displayFinishedContract: [],
      displayPaidBill: [],
      drawerVisible: false,
      contractId: 0,
      startDate: null,
      endDate: null,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillMount() {
    this.getBuilding();
  }
  /** 获取building 信息 */
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

  getBIByBuildingId = () => {
    let _this = this;
    console.info("getBIByBuildingId");
    let link =
      "type=rent&fun=getBIByBuildingId&data=" +
      JSON.stringify(this.state.checkedBuilding) +
      "&sDate=" +
      JSON.stringify(this.state.startDate) +
      "&eDate=" +
      JSON.stringify(this.state.endDate);
    console.info("link", link);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json);
        console.info(arr);
        this.setState({ BI1data: arr.data }, () => {
          console.info(this.state.BI1data);
        });
        //this.setState({ contractData: arr });
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
        this.getBIByBuildingId();
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
        this.getBIByBuildingId();
      }
    );
  };

  /*显示完结合同多选框变动触发函数*/
  checkBox_displayPaidBill_OnChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
    this.setState(
      {
        displayPaidBill: checkedValues,
      },
      () => {
        this.getBIByBuildingId();
      }
    );
  };

  DateOnChange = (dates, dateStrings) => {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    this.setState(
      { startDate: dateStrings[0], endDate: dateStrings[1] },
      () => {
        this.getBIByBuildingId();
      }
    );
  };

  /*主渲染函数 */
  render() {
    let sumPrices = 0; //合计金额
    let sumPaid = 0; //合计已支付
    let billNum = 0; //账单数量
    let billPaidNum = 0; //已支付数量

    let l1 = this.state.BI1data[0];
    let l2 = this.state.BI1data[1];
    console.info(l1, l2);
    l1.forEach((value) => {
      value.name = "应收";
    });
    l2.forEach((value) => {
      value.name = "实收";
    });
    let l3 = l1.concat(l2);
    console.info(l3);
    return (
      <div>
        <Divider>building[全不选等于全选]</Divider>
        <Checkbox.Group
          options={this.state.checkbox}
          onChange={this.BuildingCheckBoxOnChange}
        />
        <Divider>是否显示完结的账单</Divider>
        <Row>
          <Col span={24}>
            以账单起始日进行查询
            <RangePicker
              size="small"
              ranges={{
                历史至今: [moment("1990-01-01"), moment()],
                去年: [
                  moment().add(-1, "year").startOf("year"),
                  moment().add(-1, "year").endOf("year"),
                ],
                今年: [moment().startOf("year"), moment().endOf("year")],
                明年: [
                  moment().add(1, "year").startOf("year"),
                  moment().add(1, "year").endOf("year"),
                ],
                前十月至后五月: [
                  moment().add(-10, "month").startOf("month"),
                  moment().add(6, "month").endOf("month"),
                ],

                清除: [null, null],
              }}
              onChange={this.DateOnChange}
            />
          </Col>
        </Row>
        <Divider style={{ margin: "2px" }}></Divider>
        <Chart height={400} data={l3} forceFit>
          <Axis name="month" />
          <Axis name="money" />
          <Tooltip />
          <Geom
            type="interval"
            position="month*money"
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 10,
              },
            ]}
            color="name"
          >
            <Label
              content={[
                "money",
                (money) => {
                  return (money / 10000.0).toFixed(2) + "万";
                },
              ]}
              offset={10}
            />
          </Geom>
        </Chart>
      </div>
    );
  }

  //渲染添加addmodal
}
