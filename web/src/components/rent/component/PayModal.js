import React from "react";
import { Link } from "react-router";
import "./css.css";
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

const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;

/**房间结构 */
export default class PayModal extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth * 0.6 < 800 ? 800 : window.innerWidth * 0.6;
    // console.info(props);
    this.state = {
      modalWidth: width,
      totalPaid: 0,
      isFinished: 1,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    //console.info("paymodal reciive props", props);
    /**
     * 
            
应付=总金额-已经支付
     */
    let shouldPay = (props.billData.money - props.billData.paid).toFixed(2);
    // 总付金额=
    let totalPaid = props.billData.money;
    let isPaid;
    //console.info("props.billData.type", props.billData.type);
    if (
      props.billData.type == 1 ||
      props.billData.type == 2 ||
      props.billData.type == 0
    ) {
      isPaid = 1;
      console.info("设置isPaid=1");
    }
    if (props.billData.type == -1) {
      isPaid = -2;
      console.info("设置isPaid=-2");
    }
    this.setState({
      shouldPay: shouldPay, //应付
      payValue: shouldPay, //实付
      totalPaid: totalPaid, //合计金额
      isFinished: isPaid,
    });
  }
  payValueonChange = (e) => {
    // console.info(e);
    let isFinished;
    let currentPaid = (
      parseFloat(e) + parseFloat(this.props.billData.paid)
    ).toFixed(2);
    console.info("应付金额:", this.state.totalPaid, "目前总支付:", currentPaid);
    if (this.state.totalPaid == currentPaid) {
      console.info((this.state.shouldPay - currentPaid).toFixed(2), true);
      if (this.props.billData.type == 1) {
        isFinished = 1;
      }
      if (this.props.billData.type == -1) {
        isFinished = -2;
      }
    } else {
      console.info(false);
      isFinished = 0;
    }
    this.setState({
      payValue: e,
      totalPaid: currentPaid,
      isFinished: isFinished,
    });
  };
  /*主渲染函数 */
  render() {
    return (
      <Modal
        title="结算本期"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.props.onOk.bind(
          this,
          this.props.contractData,
          this.props.billData,
          this.state.totalPaid,
          this.state.isFinished
        )}
        width={this.state.modalWidth}
        keyboard={true}
      >
        合同编号:
        {this.props.contractData.contractId}
        房源:
        {this.props.contractData.building}
        合同面积:
        {this.props.contractData.contractArea}
        合同起始日：
        {this.props.contractData.contractBeginDate}
        合同终止日:
        {this.props.contractData.contractEndDate}
        合同名称：
        {this.props.contractData.contractName}
        乙方名称：
        {this.props.contractData.part_B}
        房源名称：
        {this.props.contractData.room}
        <Divider />
        <Row>
          <Col span={6}>
            账单ID:<div className="payModaldiv">{this.props.billData.id}</div>
          </Col>

          <Col span={6}>
            账单区间:
            <div className="payModaldiv">
              {this.props.billData.billBeginDate}
              <br />
              {this.props.billData.billEndDate}
            </div>
          </Col>
          <Col span={6}>
            账单信息:
            {this.props.billData.type == -1 ? (
              <div className="payModaldiv" style={{ color: "red" }}>
                {this.props.billData.info}本期是退押金！
              </div>
            ) : (
              <div className="payModaldiv">{this.props.billData.info}</div>
            )}
          </Col>

          <Col span={6}>
            基础单价:
            <div className="payModaldiv">
              {this.props.billData.basicPrices}元/平方/元
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            本期递增率:
            <div className="payModaldiv ">{this.props.billData.rate}</div>
          </Col>
          <Col span={6}>
            账单金额:
            <div className="payModaldiv">{this.props.billData.money}</div>
          </Col>
          <Col span={6}>
            已付金额:
            <div className="payModaldiv">{this.props.billData.paid}</div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={3} offset={6}>
            本期支付金额:
          </Col>
          <Col span={8}>
            <InputNumber
              min={0}
              step={0.01}
              value={this.state.payValue}
              max={this.state.payValue}
              onChange={this.payValueonChange}
              style={{ width: "150px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={3} offset={6}>
            合计支付金额:
          </Col>
          <Col span={8}>{this.state.totalPaid}</Col>
        </Row>
      </Modal>
    );
  }
}
