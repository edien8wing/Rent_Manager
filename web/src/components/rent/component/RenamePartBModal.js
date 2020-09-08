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

/**房间结构 */
export default class renamePartBModal extends React.Component {
  constructor(props) {
    super(props);
    let width = window.innerWidth * 0.6 < 800 ? 800 : window.innerWidth * 0.6;
    console.info(props);
    this.state = { contractData: props.contractData, newPartB: "" };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    //console.info('willreceive',props);
    this.setState({ contractData: props.contractData });
  }

  renamePartBonClicked = () => {
    if (this.state.newPartB != "" && COOKIE.get("dingId") != "") {
      let link = "type=rent&fun=renamePart_B";
      link += "&contractData=";
      link += JSON.stringify(this.state.contractData);
      link += "&newPartB=";
      link += JSON.stringify(this.state.newPartB);
      console.info(link);
      var result = AJAX.send(link);

      result
        .then((response) => {
          return response.json();
        })
        .then((r) => {
          console.info("返回数据v", r);
          if (r.errcode == 0) {
            message.success(r.errcode + "发送成功了");
            this.props.onCancel();
          } else {
            message.error(r.errcode + r.errmsg);
          }
        });
    } else {
      message.error("没有填写新名称 或者你没有钉钉id");
    }
  };
  PartBNameonChange = (e) => {
    //console.info(e);
    this.setState({ newPartB: e.target.value });
  };
  /*主渲染函数 */
  render() {
    return (
      <Modal
        title="编辑楼层及房源"
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        onOk={this.renamePartBonClicked}
        width={this.state.modalWidth}
        keyboard={true}
      >
        <Row>当前用户dingId：{COOKIE.get("dingId")}</Row>
        <Row>
          <Col span={10}>原来乙方名称：</Col>
          <Col span={14}>{this.props.contractData.part_B}</Col>
        </Row>
        <Row>
          <Col span={10}>新的名字：</Col>
          <Col span={14}>
            <Input
              placeholder="新公司名称"
              onChange={this.PartBNameonChange}
              value={this.state.newPartB}
            />
          </Col>
        </Row>
        <Row style={{ color: "red" }}>
          注:更名请求会自动发钉钉，考虑周全再点ok
        </Row>
      </Modal>
    );
  }
}
