import React from "react";
import { Link } from "react-router";
import {
  Tag,
  Collapse,
  Checkbox,
  Badge,
  Button,
  InputNumber,
  Tabs,
  Input,
  DatePicker,
  Row,
  Col,
  message,
  Table,
  Divider,
} from "antd";
import moment from "moment";
import AJAX from "../../bin/AJAX.js";
import Component_BorderFrame from "../EDI/borderFrame.js";
import COOKIE from "../../bin/COOKIE.js";
import "../../bin/DateSet.js";
import STR from "../../bin/STR.js";
import config from "../../bin/config.js";
import ContractBillDrawer from "./component/ContractBillDrawer.js";

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
        {recoder.isFinished == 1 ? <Tag color="gray">已签退{text}</Tag> : ""}
        {recoder.isFinished == 2 ? <Tag color="#7c7407">审批中{text}</Tag> : ""}
        {recoder.isFinished == -1 ? <Tag color="#DC143C">拒绝{text}</Tag> : ""}
      </div>
    ),
  },
  {
    title: "类型",
    dataIndex: "info",
    render: (text, recoder) => (
      <div>
        {recoder.type == 0 ? <Tag color="gray">{text}</Tag> : ""}
        {recoder.type == 1 ? <Tag color="blue">{text}</Tag> : ""}
        {recoder.type == 2 ? <Tag color="gold">{text}</Tag> : ""}
        {recoder.type == -1 ? <Tag color="red">{text}</Tag> : ""}
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
    render: (text, recoder) => (
      <div>
        {text}
        <Badge count={STR.minersTime(text).days} overflowCount={999}></Badge>
      </div>
    ),
  },
  {
    title: "账期截止日",
    dataIndex: "billEndDate",
    render: (text, recoder) => (
      <div>
        {text}
        <Badge count={STR.minersTime(text).days} overflowCount={999}></Badge>
      </div>
    ),
  },
  {
    title: "账期金额",
    dataIndex: "money",
    render: (text, recoder) => (
      <div>
        {recoder.isPaid == 0 ? (
          <span style={{ color: "red" }}>{text}元</span>
        ) : (
          ""
        )}
        {recoder.isPaid == 1 ? (
          <span style={{ color: "green" }}>{text}元</span>
        ) : (
          ""
        )}
        {recoder.isPaid == 2 ? (
          <span style={{ color: "gray" }}>作废{text}元</span>
        ) : (
          ""
        )}
      </div>
    ),
  },
];
//是否显示合同完结与否的
const checkBox_displayFinishedContract = [
  { label: "履行的合同", value: 0 },
  { label: "结束的合同", value: 1 },
  { label: "审批中的合同", value: 2 },
  { label: "拒绝的合同", value: -1 },
];
//是否已付款的账单
const checkBox_displayPaidBill = [
  { label: "显示已付款", value: 1 },
  { label: "未付款", value: 0 },
];

/**合同结构 */
export default class rentBill extends React.Component {
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
      contractData: [],
      //是否显示已经结束的合同
      //displayDeletedRoom:false,
      displayFinishedContract: [0],
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
    this.getBillByBuildingId();
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

  getBillByBuildingId = () => {
    let _this = this;
    console.info("getBillByBuildingId");
    let link =
      "type=rent&fun=getBillByBuildingId&data=" +
      JSON.stringify(this.state.checkedBuilding) +
      "&contractIsFinished=" +
      JSON.stringify(this.state.displayFinishedContract) +
      "&isPaidBill=" +
      JSON.stringify(this.state.displayPaidBill) +
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
        this.getBillByBuildingId();
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
        this.getBillByBuildingId();
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
        this.getBillByBuildingId();
      }
    );
  };

  TableOnChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
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
    this.setState({ drawerVisible: false, contractId: 0 });
  };
  DateOnChange = (dates, dateStrings) => {
    console.log("From: ", dates[0], ", to: ", dates[1]);
    console.log("From: ", dateStrings[0], ", to: ", dateStrings[1]);
    this.setState(
      { startDate: dateStrings[0], endDate: dateStrings[1] },
      () => {
        this.getBillByBuildingId();
      }
    );
  };
  getBillList = () => {
    let link =
      "type=FileCreater&fun=getBillListDoc&data=" +
      JSON.stringify(this.state.contractData);

    let result = AJAX.send(link);
    AJAX.getFile(link, "催款函组合.docx");
  };
  /*主渲染函数 */
  render() {
    let sumPrices = 0; //合计金额
    let sumPaid = 0; //合计已支付
    let billNum = 0; //账单数量
    let billPaidNum = 0; //已支付数量
    this.state.contractData.forEach((item, key) => {
      if (item.isPaid == 1) {
        billPaidNum++;
        sumPaid += item.money;
      }
      billNum++;
      sumPrices += item.money;
    });

    return (
      <div>
        <ContractBillDrawer
          onClose={this.drawerClose}
          visible={this.state.drawerVisible}
          contractId={this.state.contractId}
          onResetTable={this.getBillByBuildingId}
        />
        <Divider>building[全不选等于全选]</Divider>
        <Checkbox.Group
          options={this.state.checkbox}
          onChange={this.BuildingCheckBoxOnChange}
        />
        <Divider>是否显示完结的账单</Divider>
        <Row>
          <Col span={10}>
            <Checkbox.Group
              options={checkBox_displayFinishedContract}
              onChange={this.checkBox_displayFinishedContract_OnChange}
              value={this.state.displayFinishedContract}
            />
            <Divider type="vertical" style={{ backgroundColor: "#941515" }} />
            <Checkbox.Group
              options={checkBox_displayPaidBill}
              onChange={this.checkBox_displayPaidBill_OnChange}
            />
            <Divider type="vertical" style={{ backgroundColor: "#941515" }} />
          </Col>
          <Col span={10}>
            <Row>以账单起始日进行查询 </Row>
            <Row>
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
                  上月: [
                    moment().add(-1, "month").startOf("month"),
                    moment().add(-1, "month").endOf("month"),
                  ],
                  本月: [moment().startOf("month"), moment().endOf("month")],
                  下月: [
                    moment().add(1, "month").startOf("month"),
                    moment().add(1, "month").endOf("month"),
                  ],
                  今年至本月末: [
                    moment().startOf("year"),
                    moment().endOf("month"),
                  ],
                  今年至下月末: [
                    moment().startOf("year"),
                    moment().add(1, "month").endOf("month"),
                  ],

                  清除: [null, null],
                }}
                onChange={this.DateOnChange}
              />
            </Row>
          </Col>
          <Col span={4}>
            <Row>
              <Button onClick={this.getBillList} type="primary">
                使用本表数据生成催款函
              </Button>
            </Row>
          </Col>
        </Row>
        <Divider style={{ margin: "2px" }}></Divider>
        <Row
          style={{
            backgroundColor: "#6699CC",
            fontFamily: "aril",
            fontSize: "20px",
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            margin: "5px",
          }}
        >
          <Col span={4}>
            <sub>合计金额</sub>
            <br /> {sumPrices.toFixed(2)}
            <sub>元</sub>
          </Col>
          <Col span={4}>
            <sub>已支付</sub> <br />
            {sumPaid.toFixed(2)}
            <sub>元</sub>
          </Col>
          <Col span={4}>
            <sub>支付比率</sub>
            <br /> {((sumPaid / sumPrices) * 100).toFixed(2)}
            <sub>%</sub>
          </Col>
          <Col span={4}>
            <sub>账单数量</sub> <br />
            {billNum}
            <sub>笔</sub>
          </Col>
          <Col span={4}>
            <sub>支付数量</sub>
            <br /> {billPaidNum}
            <sub>笔</sub>
          </Col>
          <Col span={4}>
            <sub> 支付比率</sub>
            <br /> {((billPaidNum / billNum) * 100).toFixed(2)}
            <sub>%</sub>
          </Col>
        </Row>

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
          footer={() =>
            "合计总共：" + this.state.contractData.length + "条信息"
          }
        />
      </div>
    );
  }

  //渲染添加addmodal
}
