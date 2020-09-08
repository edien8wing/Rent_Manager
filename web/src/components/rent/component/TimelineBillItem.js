import React from "react";
import { Link } from "react-router";
import {
  Drawer,
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
import PayModal from "./PayModal.js";

const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;

export default class TimelineBillItem extends React.Component {
  constructor(props) {
    super(props);

    //console.info(props);
    this.state = {
      payModalVisible: false,
      payModalData: [],
      contractData: [],
      billData: [],
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    //console.info('willreceive',props);
    //let contractId = props.contractId;
  }
  downloadButton = () => {
    // console.info(this.props);

    let link =
      "type=FileCreater&fun=getBillDoc&data=" + JSON.stringify(this.props);
    let result = AJAX.send(link);
    AJAX.getFile(link, "催款函.docx");

    //console.info(link);
  };
  payThisBill = () => {
    this.setState({
      payModalVisible: true,

      contractData: this.props.contractData,
      billData: this.props.item,
    });
    //this.props.payOnClick(this.props.contractData, this.props.item);
  };
  //modal 中的按钮被触发
  payModalonOk = (contractData, billData, totalPaid, isFinished) => {
    let link =
      "type=rent&fun=payBill&data=" +
      JSON.stringify({
        contractData: contractData,
        billData: billData,
        totalPaid: totalPaid,
        isFinished: isFinished,
      });
    var result = AJAX.send(link);

    result
      .then((response) => {
        //console.info("response", response);
        return response.json();
      })
      .then((json) => {
        message.success("发起成功");
        this.payModalonCancel();
        this.props.paySuccess();
        console.info("success");
      });
  };
  payModalonCancel = () => {
    this.setState({
      payModalVisible: false,
    });
  };

  stateButton = (isFinished, isPaid, dingId) => {
    // console.info(isFinished, isPaid);
    // 0:未完结 1:已经完结 2:审批中
    /*如果不是在审核状态 */

    if (isFinished == 0 || isFinished == 1) {
      /*如果是已经支付状态 */
      if (isPaid == 1) {
        return <Tag color="#87d068">已支付</Tag>;
      } else if (isPaid == 0) {
        /*如果是未支付状态 */
        return (
          <div>
            <Tag color="#f50">未支付</Tag>
            {config.hasRule(608) ? (
              <Button
                type="primary"
                shape="round"
                icon="download"
                size="small"
                onClick={() => this.downloadButton()}
              >
                催款函生成
              </Button>
            ) : (
              ""
            )}
            {config.hasRule(608) && (dingId == "" || dingId == null) ? (
              <Button
                type="danger"
                shape="round"
                icon="money-collect"
                size="small"
                onClick={() => this.payThisBill()}
              >
                结算本期
              </Button>
            ) : (
              "dingId" + dingId
            )}
          </div>
        );
      } else if (isPaid == 2) {
        return (
          <div>
            <Tag color="gray">已作废</Tag>
          </div>
        );
      }
    } else if (isFinished == 2) {
      /*如果在审核状态下*/
      return <Tag color="gray">审核中的合同不提供操作功能</Tag>;
    } else if (isFinished == -1) {
      return <Tag color="gray">审批遭拒的合同不提供操作功能</Tag>;
    }
  };
  render() {
    return (
      <Timeline.Item
        style={{
          paddingBottom: "5px",
          marginTop: "-10px",
        }}
        color={this.props.item.isPaid ? "green" : "red"}
      >
        <PayModal
          visible={this.state.payModalVisible}
          onCancel={this.payModalonCancel}
          billData={this.state.billData}
          contractData={this.state.contractData}
          onOk={this.payModalonOk.bind(this)}
        ></PayModal>
        <div style={{ marginLeft: "-250px", width: "250px" }}>
          <Row>
            <Col span={10}>
              <div
                style={
                  STR.minersNow(this.props.item.billBeginDate) > 0
                    ? {
                        fontSize: "20px",
                        fontFamily: "fantasy",
                        color: "#990033",
                      }
                    : {
                        fontSize: "20px",
                        fontFamily: "fantasy",
                        color: "#aaa",
                      }
                }
              >
                {this.props.item.billBeginDate + " "}
              </div>
            </Col>
            <Col span={2}>
              <Icon type="right-circle" />
            </Col>
            <Col span={10}>
              <div
                style={
                  STR.minersNow(this.props.item.billEndDate) > 0
                    ? {
                        fontSize: "20px",
                        fontFamily: "fantasy",
                        color: "#990033",
                      }
                    : {
                        fontSize: "20px",
                        fontFamily: "fantasy",
                        color: "#aaa",
                      }
                }
              >
                {" " + this.props.item.billEndDate}
              </div>
            </Col>
          </Row>
          <Row>
            账单信息:
            {this.props.item.type == 2 ? (
              <Tag color="#FFD700">{this.props.item.info}</Tag>
            ) : (
              ""
            )}
            {this.props.item.type == 1 ? (
              <Tag color="blue">{this.props.item.info}</Tag>
            ) : (
              ""
            )}
            {this.props.item.type == 0 ? (
              <Tag color="gray">{this.props.item.info}</Tag>
            ) : (
              ""
            )}
            {this.props.item.type == -1 ? (
              <Tag color="red">{this.props.item.info}</Tag>
            ) : (
              ""
            )}
          </Row>
        </div>

        <div style={{ marginTop: "-50px" }}>
          <Row>
            <Tag>第{this.props.index + 1}期</Tag>
            <Tag>账单ID:{this.props.item.id}</Tag>

            {this.stateButton(
              this.props.contractData.contractIsFinished,
              this.props.item.isPaid,
              this.props.item.dingId
            )}
          </Row>
          <Row>
            <Col span={6} style={{ fontFamily: "cursive", fontSize: "15px" }}>
              账单金额：
            </Col>
            <Col
              span={10}
              style={{
                fontFamily: "fantasy",
                textAlign: "right",
                fontSize: "18px",
              }}
            >
              {this.props.item.money}
            </Col>
          </Row>
          <Row>
            <Col span={6} style={{ fontFamily: "cursive", fontSize: "15px" }}>
              已付：
            </Col>
            <Col
              span={10}
              style={{
                fontFamily: "fantasy",
                textAlign: "right",
                fontSize: "18px",
              }}
            >
              {this.props.item.paid}
            </Col>
          </Row>
          <Row>
            <Col span={20} style={{ fontFamily: "cursive", fontSize: "15px" }}>
              {this.props.item.isPaid
                ? "付款时间:" + this.props.item.billPaidDate
                : ""}
            </Col>
          </Row>
        </div>
        <Divider
          style={{
            marginLeft: "-200px",
            borderBottom: "#ccc solid 1px",
            width: "500px",
            marginTop: "20px",
          }}
        />
      </Timeline.Item>
    );
  }
}
