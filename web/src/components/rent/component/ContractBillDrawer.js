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
  Popover,
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
  Dropdown,
  Menu,
  Divider,
  Button,
  Timeline,
} from "antd";
import moment from "moment";
import AJAX from "../../../bin/AJAX.js";
import Component_BorderFrame from "../../EDI/borderFrame.js";
import TimelineBillItem from "./TimelineBillItem.js";
import COOKIE from "../../../bin/COOKIE.js";
import "../../../bin/DateSet.js";
import STR from "../../../bin/STR.js";
import config from "../../../bin/config.js";
import PayModal from "./PayModal.js";
import RenamePartBModal from "./RenamePartBModal.js";
import LeaveModal from "./LeaveModal.js";
const { TextArea } = Input;
const { MonthPicker, RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const monthFormat = "YYYY/MM";
const Timeformat = "HH/mm";
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const InputGroup = Input.Group;
const headTitleCss = { color: "#6b809f", fontSize: "12px" };
const contentCss = { fontSize: "15px", fontWeight: "bold", fontFamily: "黑体" };
/**房间结构 */
export default class ContractBillDrawer extends React.Component {
  constructor(props) {
    super(props);

    //console.info(props);
    this.state = {
      contractData: {
        contractId: "",
        contractArea: "",
        contractCODE: "",
        contractDingding: "",
        contractDingType: "",
        contractName: "",
        part_B: "",
        contractIsFinished: "",
        contractBeginDate: "",
        contractEndDate: "",

        building: "",
        location: "",
        code: "",
        room: "",
        roomSumArea: "",
      },
      billData: [],
      payModalVisible: false,
      renamePartBVisible: false,
      leaveModalVisible: false,
    };
  }

  //组件载入后运行的方法 主要是依靠ajax获取表格数据
  componentWillReceiveProps(props) {
    //console.info('willreceive',props);
    let contractId = props.contractId;
    this.setState({ "contractData.contractId": contractId }, () => {
      //  console.info("drawer", contractId);
      if (contractId) {
        this.getContractData(contractId);
      }
    });
  }

  //获取三张表 分别是
  /**
 * 
 * 111111
 * select * from  rent_bill as rb where rb.contract_id=1
 * 
 * 
 * 
 * 2222222222
 * select 
cr.contract_Id as building,
b.name as building,
group_concat(r.id) as roomId,
group_concat(r.name) as room  
from rent_contract_room as cr 
left join rent_room as r on r.id=cr.room_Id
left join rent_floor as f on f.id=r.floor
left join rent_building as b on b.id=f.rent_building_id
where cr.contract_id=1 
group by cr.contract_Id


3333333333
select * from rent_contract where contractId=1;
 */
  getContractData = (contractId) => {
    let link =
      "type=rent&fun=getContractData&contractId=" + JSON.stringify(contractId);
    var result = AJAX.send(link);
    console.info(link);
    result
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        let arr = JSON.parse(json).data;
        //let cbox=JSON.parse(JSON.stringify(arr).replace(/name/g, 'label').replace(/id/g,'value'))  ;
        // console.info(arr);
        this.setState({
          contractData: {
            contractId: arr[0][0].id,
            contractArea: arr[0][0].area,
            contractCODE: arr[0][0].contractCODE,
            contractDingding: arr[0][0].dingding,
            contractDingType: arr[0][0].dingType,
            contractName: arr[0][0].contractName,
            part_B: arr[0][0].part_B,
            contractIsFinished: arr[0][0].isFinished,
            contractBeginDate: arr[0][0].beginDate,
            contractEndDate: arr[0][0].endDate,

            building: arr[1][0].building,
            location: arr[1][0].location,
            code: arr[1][0].code,
            room: arr[1][0].room,
            roomSumArea: arr[1][0].roomSumArea,
          },
          billData: arr[2],
          payModalData: [],
        });
      });
  };

  contractState = (value) => {
    switch (value) {
      case 0:
        return <Tag color="cyan">履行中</Tag>;
        break;
      case 1:
        return <Tag color="magenta">已签退租</Tag>;
        break;
      case 2:
        return <Tag color="#7c7407">审批中</Tag>;
        break;
      case -1:
        return <Tag color="	#DC143C">审批遭拒</Tag>;
      default:
        break;
    }
  };

  downloadContract = (e) => {
    console.info(e);
    //console.info(this.state);

    let link =
      "type=FileCreater&fun=getBuildingContract&data=" +
      JSON.stringify(this.state) +
      "&mouldType=" +
      e.key;
    let result = AJAX.send(link);
    AJAX.getFile(link, "合同.docx");
  };
  paySuccessAction = () => {
    let contract_Id = this.state.contractData.contractId;
    this.getContractData(contract_Id);
    this.props.onResetTable();
  };
  change_partB = () => {
    console.info("change_partB onClicked");
    this.setState({ renamePartBVisible: true });
  };
  stopContract = () => {
    this.setState({ leaveModalVisible: true });
  };
  RenamePartBModalonCancel = () => {
    this.setState({ renamePartBVisible: false });
  };
  leaveModalonCancel = () => {
    this.setState({ leaveModalVisible: false });
  };
  leaveModalonOk = () => {
    this.setState({ leaveModalVisible: false });
    this.getContractData(this.state.contractData.contractId);
    //this.props.onResetTable();
  };
  /*主渲染函数 */
  render() {
    return (
      <Drawer
        title="合同明细"
        placement="right"
        closable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        closable={true}
        width={720}
      >
        <RenamePartBModal
          visible={this.state.renamePartBVisible}
          contractData={this.state.contractData}
          onCancel={this.RenamePartBModalonCancel}
        />
        <LeaveModal
          visible={this.state.leaveModalVisible}
          onCancel={this.leaveModalonCancel}
          onOk={this.leaveModalonOk}
          contractData={this.state.contractData}
          billData={this.state.billData}
        />

        <Row>
          <Col span={24}>
            <Row>
              <Col span={4}>
                {this.contractState(this.state.contractData.contractIsFinished)}
              </Col>
              {config.hasRule(607) ? (
                <Dropdown
                  overlay={
                    <Menu onClick={this.downloadContract}>
                      <Menu.Item key="building">
                        <Icon type="user" />
                        使用写字楼模板
                      </Menu.Item>
                      <Menu.Item key="shop">
                        <Icon type="user" />
                        使用商铺模板
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button type="primary" shape="round" icon="download">
                    生成并下载合同 <Icon type="down" />
                  </Button>
                </Dropdown>
              ) : (
                ""
              )}
              {!this.state.contractData.contractDingType > 0 &&
              this.state.contractData.contractIsFinished == 0 &&
              config.hasRule(610) ? (
                <Button
                  onClick={this.change_partB}
                  type="danger"
                  shape="round"
                  icon="download"
                >
                  Ding企业更名
                </Button>
              ) : (
                ""
              )}
              {!this.state.contractData.contractDingType > 0 &&
              this.state.contractData.contractIsFinished == 0 &&
              config.hasRule(611) ? (
                <Button
                  onClick={this.stopContract}
                  type="danger"
                  shape="round"
                  icon="download"
                >
                  退租
                </Button>
              ) : (
                ""
              )}

              {this.state.contractData.contractDingType == 1 ? (
                <div>更名审批正在流转，钉钉id</div>
              ) : (
                ""
              )}
              {this.state.contractData.contractDingType == 2 ? (
                <div>新建审批正在流转，钉钉id</div>
              ) : (
                ""
              )}
              {this.state.contractData.contractDingType == 3 ? (
                <div>退租审批正在流转，钉钉id</div>
              ) : (
                ""
              )}
              {this.state.contractData.contractDingding}
            </Row>
            <Divider />
            <Row>
              <Col span={4}>
                <Row style={headTitleCss}>合同ID</Row>
                <Row style={contentCss}>
                  {this.state.contractData.contractId}
                </Row>
              </Col>
              <Col span={4}>
                <Row style={headTitleCss}>合同面积</Row>
                <Row style={contentCss}>
                  {this.state.contractData.contractArea}
                </Row>
              </Col>
              <Col span={8}>
                <Row style={headTitleCss}>part_B</Row>
                <Row style={contentCss}>{this.state.contractData.part_B}</Row>
              </Col>
              <Col span={4}>
                <Row style={headTitleCss}>合同开始时间</Row>
                <Row style={contentCss}>
                  {this.state.contractData.contractBeginDate}
                </Row>
              </Col>
              <Col span={4}>
                <Row style={headTitleCss}>合同结束时间</Row>
                <Row style={contentCss}>
                  {this.state.contractData.contractEndDate}
                </Row>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={8}>
                <Row style={headTitleCss}>租借楼宇</Row>
                <Row style={contentCss}>{this.state.contractData.building}</Row>
              </Col>
              <Col span={8}>
                <Row style={headTitleCss}>租用房间号</Row>
                <Row style={contentCss}>{this.state.contractData.room}</Row>
              </Col>
              <Col span={8}>
                <Row style={headTitleCss}>实际合计面积</Row>
                <Row style={contentCss}>
                  {this.state.contractData.roomSumArea} m<sup>2</sup>
                </Row>
              </Col>
            </Row>
            <Divider />
          </Col>
        </Row>
        {/*账单时间轴*/}
        <Row style={{ backgroundColor: "#eee" }}>
          <Timeline style={{ marginLeft: "250px", marginTop: "20px" }}>
            {this.state.billData.map((item, key) => {
              return (
                <TimelineBillItem
                  contractData={this.state.contractData}
                  item={item}
                  index={key}
                  paySuccess={this.paySuccessAction}
                ></TimelineBillItem>
              );
            })}
          </Timeline>
        </Row>
      </Drawer>
    );
  }
}
