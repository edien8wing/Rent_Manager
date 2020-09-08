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

const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;

export default class LeaveModal extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth * 0.6 < 800 ? 800 : window.innerWidth * 0.6;
    console.info(props);
    this.state = {
      modalWidth: width,
      leaveDate: props.contractData.contractEndDate,
      contractData: props.contractData,
      billData: props.billData,
      payDeposit: 0,
      stopInfo: "",
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    console.info("willreceive", props);
    let depositSum = 0;
    this.state.billData.forEach((item) => {
      if (item.type == 2) {
        depositSum += item.money;
      }
    });
    this.setState({
      contractData: props.contractData,
      billData: props.billData,
      leaveDate: props.contractData.contractEndDate,
      depositSum: depositSum,
      payDeposit: depositSum,
    });
  }
  leaveDateOnChange = (e) => {
    console.info(e);
    this.setState({ leaveDate: e.format("YYYY-MM-DD") });
  };
  payDeposit = (e) => {
    console.info(e);
    this.setState({ payDeposit: e });
  };
  onOK = () => {
    console.info("onOk");
    if (COOKIE.get("dingId") != "") {
      let link =
        "type=rent&fun=stopContract&contractData=" +
        JSON.stringify(this.state.contractData) +
        "&contractStopDate=" +
        this.state.leaveDate +
        "&payDeposit=" +
        this.state.payDeposit +
        "&stopInfo=" +
        this.state.stopInfo;
      var result = AJAX.send(link);
      result
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          if (json.errcode) {
            message.error(json.errmsg);
          } else {
            message.success("提交成功");
            this.props.onOk();
          }
        });
    } else {
      message.error("没有获取你没有dingId，不能发起审批");
    }
  };
  changeStopInfo = (e) => {
    console.info(e.target.value);

    this.setState({ stopInfo: STR.replace(e.target.value) });
  };
  /*主渲染函数 */
  render() {
    return (
      <Modal
        title="编辑楼层及房源"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={this.state.modalWidth}
        keyboard={true}
        onOk={this.onOK}
        onCancel={this.props.onCancel}
      >
        <div>
          <div>
            租赁信息：
            {this.state.contractData.contractId}
            {this.state.contractData.location}
            {this.state.contractData.building}
            {this.state.contractData.room}
            {this.state.contractData.contractArea}
            {this.state.contractData.part_B}
            {this.state.contractData.contractBeginDate}
            {this.state.contractData.contractEndDate}
          </div>
          <Divider />
          <Row>你的dingId：{COOKIE.get("dingId")}</Row>
          <Row>
            <Col span={8}>
              <Row>退租时间：</Row>
              <Row>
                <DatePicker
                  defaultValue={moment(this.state.contractData.contractEndDate)}
                  onChange={this.leaveDateOnChange}
                />
              </Row>
              <Row>已经付押金：{this.state.depositSum}元</Row>
              <Row></Row>
              <Row> 计划退金额：</Row>
              <Row>
                <InputNumber
                  size="large"
                  //value={this.state.payDeposit}
                  defaultValue={this.state.depositSum}
                  onChange={this.payDeposit}
                />
              </Row>
              <Row>情况说明</Row>
              <Row>
                <TextArea
                  rows={4}
                  onChange={this.changeStopInfo}
                  value={this.state.stopInfo}
                />
              </Row>
            </Col>
            <Col span={16}>
              租赁信息演示
              <Timeline>
                {
                  /*
contractData:
building: "南方国际中心大厦"
code: "奉字（2016）第011123"
contractArea: 522.4
contractBeginDate: "2020-07-09"
contractCODE: null
contractEndDate: "2021-09-08"
contractId: 74
contractIsFinished: 0
contractName: "2"
location: "奉贤区南奉公路7777号"
part_B: "1"
room: "	202-自用	,	201-自用	"
roomSumArea: 522.4
*/
                  /*basicPrices: 0
billBeginDate: "2020-07-09"
billEndDate: "2020-07-09"
billPaidDate: "2020-07-09"
id: 282
info: "押金"
isPaid: 1
money: 9999
paid: 9999
rate: 0
type: 2*/
                  this.state.billData.map((item, key) => {
                    return (
                      <Timeline.Item color={item.isPaid ? "green" : "red"}>
                        <Tag>ID:{item.id}</Tag>
                        {item.type == 2 ? (
                          <Tag color="#FFD700">{item.info}</Tag>
                        ) : (
                          ""
                        )}
                        {item.type == 1 ? (
                          <Tag color="blue">{item.info}</Tag>
                        ) : (
                          ""
                        )}
                        {item.type == 0 ? (
                          <Tag color="gray">{item.info}</Tag>
                        ) : (
                          ""
                        )}
                        [{item.billBeginDate}]-
                        {STR.minersTime(item.billBeginDate).days < 0 &&
                        STR.minersTime(item.billEndDate).days > 0 ? (
                          <Icon style={{ color: "red" }} type="pushpin" />
                        ) : (
                          ""
                        )}
                        -[
                        {item.billEndDate}]
                        <Tag color={item.isPaid ? "green" : "red"}>
                          {item.money}元
                        </Tag>
                        {STR.minersTime(
                          item.billBeginDate,
                          this.state.leaveDate
                        ).days > 0 ? (
                          <Icon style={{ color: "red" }} type="delete" />
                        ) : (
                          ""
                        )}
                      </Timeline.Item>
                    );
                  })
                }
              </Timeline>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}
