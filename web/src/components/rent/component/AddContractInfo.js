import React from "react";
import { Link } from "react-router";
import {
  Tag,
  Radio,
  Popover,
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
import "./css.css";

const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;

/**房间结构 */
export default class AddContractModal extends React.Component {
  constructor(props) {
    super(props);

    console.info(props);
    this.state = {
      confirmVisible: false,
      contractRoomArea: 0,
      buildingName: "",
      roomList: [],
      contractName: "",
      part_B: "",
      contractStartDate: moment(),
      depositList: [], //info prices
      basicPrice: 0,
      addMonthNum: 3,
      billList: [],
      protectedBill: false,
    };
  }

  componentWillReceiveProps(props) {
    console.info("willreceive", props);

    this.setState(
      {
        contractRoomArea: props.contractRoomArea,
        roomList: props.roomList,
        buildingName: props.buildingName,
      },
      () => {
        console.info("state", this.state);
      }
    );
  }
  changeContractRoomArea = (value) => {
    this.state.contractRoomArea = value;
    this.calAllBill();
  };
  contractStartDateSelected = (date1, dateString) => {
    //console.info(date, dateString);

    this.state.depositList.forEach((item, key) => {
      this.state.depositList[key].date = date1;
    });
    this.setState({
      contractStartDate: date1,
      depositList: this.state.depositList,
    });
  };
  basicPriceChange = (value) => {
    console.info("baseic price", value);
    this.state.basicPrice = value;
    this.calAllBill();
  };
  addDeposit = () => {
    this.state.depositList.push({
      info: "押金",
      money: 0.0,
      type: 2,
      date: this.state.contractStartDate,
    });
    this.setState({
      depositList: this.state.depositList,
    });
  };
  /**押金合计 */
  sumDeposit = () => {
    let sum = 0;
    this.state.depositList.forEach((item, key) => {
      sum += item.money;
    });
    //console.info("合计0", sum.toFixed(2));
    return sum.toFixed(2);
  };
  depositMoneyOnChange = (key, value) => {
    this.state.depositList[key].money = value;
    this.setState({
      depositList: this.state.depositList,
    });
  };
  depositInfoOnChange = (key, e) => {
    console.info(key, e);
    this.state.depositList[key].info = e.target.value;
    this.setState({
      depositList: this.state.depositList,
    });
  };
  delDeposit = (key) => {
    this.state.depositList.splice(key, 1);
    this.setState({
      depositList: this.state.depositList,
    });
  };

  addMonthNumOnChange = (value) => {
    console.info(value, "addMonthNumOnChange");
    this.setState({
      addMonthNum: value,
    });
  };

  /*增加免租*/
  addFreeList = () => {
    console.info("addBillList", this.state.billList);
    let currentBill = {};
    currentBill.addRate = 0.0;
    //如果不是第一期
    if (this.state.billList.length) {
      let sDate = moment(
        this.state.billList[this.state.billList.length - 1].endDate
      ).add("days", 1);

      currentBill = {
        startDate: sDate,
        addRate: 0.0,
        basicPrice:
          this.state.billList[this.state.billList.length - 1].basicPrice *
          (1 + currentBill.addRate),
      };
    }
    //如果是第一期
    else {
      // console.info("moment", this.state.contractStartDate);
      let sDate = moment(this.state.contractStartDate);
      currentBill = {
        startDate: sDate,
        addRate: 0.0,
        basicPrice: this.state.basicPrice * (1 + currentBill.addRate),
      };
    }
    // console.info("s", currentBill.startDate.format(dateFormat));
    let eDate = moment(currentBill.startDate)
      .add("month", this.state.addMonthNum)
      .add("days", -1);
    // console.info("e", eDate.format(dateFormat));
    currentBill.endDate = eDate;
    currentBill.month = this.state.addMonthNum;
    currentBill.info = "免租期";
    currentBill.type = 0;
    currentBill.prices = (
      ((this.state.addMonthNum *
        currentBill.basicPrice *
        this.state.contractRoomArea *
        365) /
        12) *
      currentBill.type
    ).toFixed(2);

    this.state.billList.push(currentBill);
    this.setState({
      billList: this.state.billList,
    });
  };

  //增加账单
  addBillList = () => {
    console.info("addBillList", this.state.billList);
    let currentBill = {};
    currentBill.addRate = 0.0;
    //如果不是第一期
    if (this.state.billList.length) {
      let sDate = moment(
        this.state.billList[this.state.billList.length - 1].endDate
      ).add("days", 1);

      currentBill = {
        startDate: sDate,
        addRate: 0.0,
        basicPrice:
          this.state.billList[this.state.billList.length - 1].basicPrice *
          (1 + currentBill.addRate),
      };
    }
    //如果是第一期
    else {
      // console.info("moment", this.state.contractStartDate);
      let sDate = moment(this.state.contractStartDate);
      currentBill = {
        startDate: sDate,
        addRate: 0.0,
        basicPrice: this.state.basicPrice * (1 + currentBill.addRate),
      };
    }
    // console.info("s", currentBill.startDate.format(dateFormat));
    let eDate = moment(currentBill.startDate)
      .add("month", this.state.addMonthNum)
      .add("days", -1);
    // console.info("e", eDate.format(dateFormat));
    currentBill.endDate = eDate;
    currentBill.month = this.state.addMonthNum;
    currentBill.info = "租金";
    /*租金1 押金2 面租期0 */
    currentBill.type = 1;
    currentBill.prices = (
      ((this.state.addMonthNum *
        currentBill.basicPrice *
        this.state.contractRoomArea *
        365) /
        12) *
      currentBill.type
    ).toFixed(2);

    this.state.billList.push(currentBill);
    this.setState({
      billList: this.state.billList,
    });
  };

  priceFix = () => {
    for (let index in this.state.billList) {
      let p = this.state.billList[index].prices;
      console.info(this.state.billList[index]);
      this.state.billList[index].prices = parseFloat(p).toFixed(0);
    }
    this.setState({ billList: this.state.billList });
  };

  calPricesByMonth = (key) => {
    /**面积*365/12*单价*月份 */

    return (
      ((this.state.billList[key].basicPrice *
        this.state.contractRoomArea *
        365) /
        12) *
      this.state.billList[key].month *
      this.state.billList[key].type
    ).toFixed(2);
  };
  /*删除某一个帐单 */
  delBillList = (key) => {
    this.state.billList.splice(key, 1);
    this.setState({ billList: this.state.billList });
  };
  //////////////////////////////修改没反应
  startDateOnChange = (key, e) => {
    //console.info(key, e);
    this.state.billList[key].startDate = e;
    this.setState({ billList: this.state.billList });
  };
  endDateOnChange = (key, e) => {
    this.state.billList[key].endDate = e;
    this.setState({ billList: this.state.billList });
  };

  /*将所有帐单运算一遍*/
  calAllBill = () => {
    this.state.billList.forEach((item, key) => {
      //本期单价=上期单价*（1+递增率）
      if (key) {
        this.state.billList[key].basicPrice = parseFloat(
          (
            (1 + this.state.billList[key].addRate) *
            this.state.billList[key - 1].basicPrice
          ).toFixed(4)
        );
      } else {
        this.state.billList[key].basicPrice = parseFloat(
          (
            (1 + this.state.billList[key].addRate) *
            this.state.basicPrice
          ).toFixed(4)
        );
      }

      this.state.billList[key].prices = this.calPricesByMonth(key);
    });
    this.setState({ billList: this.state.billList });
  };
  /*基础单价修改 */
  /*
  basicPriceOnChange = (key, e) => {
    console.info(key, e);
    this.state.billList[key].basicPrice = e;

    if (key) {
      this.state.billList[key].addRate = (
        this.state.billList[key].basicPrice /
          this.state.billList[key - 1].basicPrice -
        1
      ).toFixed(3);
      console.info(
        "测试",
        key,
        this.state.billList[key].basicPrice,
        "/",
        this.state.billList[key - 1].basicPrice,
        "-",
        1,
        this.state.billList[key].addRate
      );
    } else {
      this.state.billList[key].addRate = (
        this.state.billList[key].basicPrice / this.state.basicPrice -
        1
      ).toFixed(3);
      console.info(
        "测试",
        key,
        this.state.billList[key].basicPrice,
        "/",
        this.state.basicPrice,
        "-",
        1,
        this.state.billList[key].addRate
      );
    }

    this.calAllBill();
  };
  */
  /*递增率被修改 */
  rateOnChange = (key, e) => {
    this.state.billList[key].addRate = e;

    this.calAllBill();
  };

  pricesOnChange = (key, e) => {
    this.state.billList[key].prices = e;
    this.setState({
      billList: this.state.billList,
    });
  };

  protectedBillChanged = (value) => {
    this.setState({ protectedBill: value });
  };
  //检查后提交最后表单数据
  sendContentClicked = () => {
    console.info(this.state.billList);

    if (this.checkValue()) {
      this.setState({ confirmVisible: true });
    }
    //message.info('clicked')
  };
  contractNameOnChange = (value) => {
    let v = STR.replace(value.target.value);
    this.setState({ contractName: v });
  };

  part_BOnChange = (value) => {
    //console.info(value.target.value);
    let v = STR.replace(value.target.value);
    this.setState({ part_B: v });
  };
  /**提交前检查数据 */
  checkValue = () => {
    let returnValue = true;
    if (this.state.roomList.length <= 0) {
      message.error("1.房间都没选！！！！");
      returnValue = false;
    }
    if (this.state.part_B == "" || this.state.contractName == "") {
      message.error("2.合同乙方没有填写");
      returnValue = false;
    }
    if (this.state.depositList.length <= 0) {
      message.error("3.押金没有填写");
      returnValue = false;
    }
    if (this.state.billList <= 0) {
      message.error("4.租金明细没有填写");
      returnValue = false;
    }
    let dingId = COOKIE.get("dingId");
    if (dingId == "" || dingId == undefined || dingId == null) {
      message.error("5.你没有dingdingid不能发审批");
      returnValue = false;
    }
    return returnValue;
  };
  /*发送合同 */
  confirmOnOk = () => {
    console.info(this.state);
    let link = "type=rent&fun=addContract";
    link += "&contractInfo=";
    link += JSON.stringify(this.state);
    var result = AJAX.send(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((r) => {
        console.info(r);
        let res = JSON.parse(r);
        if (res.type == 1) {
          message.success(res.data);
        } else {
          message.error(res.data);
        }
      });
    this.props.closeModal();
    this.setState({ confirmVisible: false });
  };

  confirmOnCancel = () => {
    this.setState({ confirmVisible: false });
  };
  testFunction = () => {
    let link = "type=dingding&fun=testLink";

    let result = AJAX.send(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.info(json);
        let backmsg = JSON.parse(json);
        if (backmsg.errcode) {
          message.error("连接钉钉不可用" + backmsg.errmsg);
        } else {
          message.success("连接钉钉可用" + backmsg.errmsg);
        }
      });
  };
  render() {
    return (
      <Row>
        {/*合同的信息*/}
        <Modal
          title="确认信息"
          visible={this.state.confirmVisible}
          onOk={this.confirmOnOk}
          onCancel={this.confirmOnCancel}
          okText="确认提交"
          cancelText="取消"
        >
          请确认以下你真的要提交本条信息
          {COOKIE.get("dingId") == ""
            ? "没有获取到你的dingId"
            : COOKIE.get("dingId")}
        </Modal>
        <div className="rowTitle">2.添加租赁信息</div>
        <Row
          style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}
        >
          <Row>
            <Col span={8} style={{ marginBottom: 5 }}>
              乙方名称:
              <Input
                size="small"
                onChange={this.part_BOnChange}
                value={this.state.part_B}
                style={{ width: "200" }}
              ></Input>
            </Col>
            <Col span={8}>
              已经选房屋:
              {this.state.roomList.map((item, key) => {
                return <Tag color="green">{item.name}</Tag>;
              })}
            </Col>
            <Col span={8}>
              重定义合同面积:
              <InputNumber
                size="small"
                min={0}
                max={10000}
                step={0.1}
                value={this.state.contractRoomArea}
                defaultValue={this.props.contractRoomArea}
                onChange={this.changeContractRoomArea}
              ></InputNumber>
              {this.state.contractRoomArea}m<sup>2</sup>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              合同名称:
              <Input
                size="small"
                onChange={this.contractNameOnChange}
                style={{ width: "100px" }}
              ></Input>
            </Col>
            <Col span={8}>
              合同开始时间:
              <DatePicker
                onChange={this.contractStartDateSelected}
                value={moment(this.state.contractStartDate, dateFormat)}
              />
            </Col>
            <Col span={8}>
              初始平方单价:
              <InputNumber
                size="small"
                min={0}
                max={10000}
                step={0.01}
                value={this.state.basicPrice}
                onChange={this.basicPriceChange}
              />
              元/平方/天
            </Col>
          </Row>
        </Row>
        <div className="rowTitle">3.添加押金信息</div>
        {/**押金明细 */}
        <Row
          style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}
        >
          <Col span={18}>
            {this.state.depositList.map((item, key) => {
              return (
                <Row>
                  <Col span={4} offset={2}>
                    {item.date.format(dateFormat)}
                  </Col>
                  <Col span={6}>
                    <Input
                      size="small"
                      value={item.info}
                      style={{ width: "200" }}
                      onChange={this.depositInfoOnChange.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                  <Col span={6}>
                    <InputNumber
                      size="small"
                      min={0}
                      step={1}
                      value={item.money}
                      onChange={this.depositMoneyOnChange.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                    元
                  </Col>
                  <Col span={4}>
                    <Button
                      type="link"
                      shape="circle"
                      icon="delete"
                      onClick={this.delDeposit.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                </Row>
              );
            })}
            <Row
              style={{
                borderTop: "1px solid #1E90FF",
                fontSize: "17",
                fontFamily: "fantasy",
                color: "#DC143C",
              }}
            >
              <Col span={4} offset={2}></Col>
              <Col span={6}>押金合计</Col>
              <Col span={6}>{this.sumDeposit()} 元</Col>
              <Col span={4}></Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row style={{ textAlign: "right" }}>
              <Button onClick={this.addDeposit}>添加押金</Button>
            </Row>
          </Col>
        </Row>
        <div className="rowTitle">4.添加账单明细</div>
        {/**账单明细 */}
        <Row
          style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}
        >
          <Col span={18}>
            <Row>
              <Col span={1} offset={1}>
                ID
              </Col>
              <Col span={2} offset={1}>
                类型
              </Col>
              <Col span={8}>账期时间</Col>
              <Col span={3}>单价</Col>
              <Col span={2}>递增率</Col>
              <Col span={4}>本期费用</Col>
              <Col span={1}>删除</Col>
            </Row>
            {this.state.billList.map((item, key) => {
              return (
                <Row className="billRowStyle">
                  <Col span={1} offset={1}>
                    <Tag color="blue">{key + 1}</Tag>
                  </Col>
                  <Col span={2} offset={1}>
                    {item.info}
                  </Col>
                  <Col span={8}>
                    <DatePicker
                      value={item.startDate}
                      size="small"
                      onChange={this.startDateOnChange.bind(this, key)}
                      style={{ width: 110 }}
                      disabled={this.state.protectedBill}
                    />
                    -
                    <DatePicker
                      value={item.endDate}
                      size="small"
                      onChange={this.endDateOnChange.bind(this, key)}
                      style={{ width: 110 }}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                  <Col span={3}>
                    <Tag style={{ width: 100 }}>{item.basicPrice + "元"}</Tag>
                  </Col>
                  <Col span={2}>
                    <InputNumber
                      size="small"
                      value={item.addRate}
                      step={0.01}
                      style={{ width: 70 }}
                      onChange={this.rateOnChange.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber
                      style={{
                        color: "rgb(220, 20, 60)",
                        fontFamily: "fantasy",
                      }}
                      size="small"
                      step={1}
                      value={item.prices}
                      onChange={this.pricesOnChange.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                  <Col span={1}>
                    <Button
                      type="link"
                      size="small"
                      shape="circle"
                      icon="delete"
                      onClick={this.delBillList.bind(this, key)}
                      disabled={this.state.protectedBill}
                    />
                  </Col>
                </Row>
              );
            })}
          </Col>
          <Col span={6}>
            <Row style={{ textAlign: "right" }}>
              以
              <InputNumber
                size="small"
                min={0}
                max={50}
                step={1}
                defaultValue={3}
                onChange={this.addMonthNumOnChange}
              />
              月{/*增加租期*/}
              <Popover content={<p>增加租期</p>}>
                <Button
                  onClick={this.addBillList}
                  type="link"
                  shape="circle"
                  icon="plus"
                ></Button>
              </Popover>
              {/*增加免租*/}
              <Popover content={<p>免租期</p>}>
                <Button
                  onClick={this.addFreeList}
                  style={{ color: "#a33" }}
                  type="link"
                  shape="circle"
                  icon="plus"
                ></Button>
              </Popover>
            </Row>
            <Divider />
            <Row style={{ textAlign: "right" }}>
              <Button onClick={this.priceFix}>费用自动四舍五入</Button>
            </Row>
            <Row style={{ textAlign: "right" }}>
              <Switch
                protectedBill={this.state.protectedBill}
                onChange={this.protectedBillChanged}
                checkedChildren="锁定不可编辑"
                unCheckedChildren="启用编辑"
              />
            </Row>
            <Row style={{ textAlign: "right" }}>
              <Button type="primary" onClick={this.testFunction}>
                测试钉钉连接
              </Button>
            </Row>
            <Row style={{ textAlign: "right" }}>
              <Button onClick={this.sendContentClicked}>提交</Button>
            </Row>
          </Col>
        </Row>
      </Row>
    );
  }
}
