import "animate.css/animate.min.css";
import "font-awesome/css/font-awesome.min.css";
import React from "react";
import { render } from "react-dom";

// 引入React-Router模块
import {
  Router,
  Route,
  Link,
  hashHistory,
  IndexRoute,
  Redirect,
  IndexLink,
} from "react-router";
// 引入主体样式文件
import "./main.css";

// 引入单个页面（包括嵌套的子页面）
import myTable from "./components/table.js";
import myForm from "./components/form.js";
import myChart from "./components/chart.js";
import myHome from "./components/homepage.js";
import Component_Login from "./components/login/login.js";
import COOKIE from "./bin/COOKIE.js";
import AJAX from "./bin/AJAX.js";
import config from "./bin/config.js";
import Component_wuye_currentFix from "./components/wuye/currentFix.js";
import Component_wuye_historyFix from "./components/wuye/historyFix.js";
import Component_Hetong_Task from "./components/hetong/task.js";
import Component_Hetong_Mission from "./components/hetong/finishedMission.js";
import Component_Hetong_CurrentMission from "./components/hetong/CurrentMission.js";
import Component_SMessenger from "./components/SMessenger/Component_SMessenger.js";
import Component_Hetong_QUAmission from "./components/hetong/QUAmission.js";
import JsonMenu from "./components/EDI/JsonMenu.js";
import Component_user_rules from "./components/rules/Component_user_rules.js";
import rentBill from "./components/rent/rentBill.js";
import rentBuilding from "./components/rent/rentBuilding.js";
import rentContract from "./components/rent/rentContract.js";
import rentBuildingProfile from "./components/rent/rentBuildingProfile.js";
import rentBI from "./components/rent/rentBI.js";
//import adApp from './components/ad/adApp.js'
import { message, Form, Layout, Menu, Breadcrumb, Icon, Dropdown } from "antd";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class LeftSider extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      name: "",
      type: "",
      rule: "",
    };
  }
  componentWillMount() {
    var name = COOKIE.get("name"); //id
    var rule = COOKIE.get("rule"); //规则
    var type = COOKIE.get("type"); //类型
    var dingId = COOKIE.get("dingId");
    var depId = COOKIE.get("depId");
    console.info("cookies:", name, rule, type);
    if (name == null || rule == null || type == null) {
      message.error("您尚未登陆/跳转到登陆页面:->");
      hashHistory.push("/login");
    } else {
      this.setState({
        name: name,
        rule: rule,
        type: type,
        dingId: dingId,
        depId: depId,
      });
    }
  }
  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  hasValue = (value) => {
    let ans = false;
    for (let i = 0; i < this.state.rule.length; i++) {
      if (this.state.rule[i] == value) {
        ans = true;
        break;
      }
    }
    return ans;
  };
  logout = () => {
    console.info("logout");
    COOKIE.del("name");
    COOKIE.del("type");
    COOKIE.del("rule");
    COOKIE.del("id");
    COOKIE.del("dingId");
    COOKIE.del("depId");
    hashHistory.push("/login");
  };
  render() {
    const usermenu = (
      <Menu>
        <Menu.Item key="1">
          <span>{this.state.name}</span>
        </Menu.Item>
        <Menu.Item key="2">
          <a to="#" onClick={this.logout}>
            退出
          </a>
        </Menu.Item>
      </Menu>
    );
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo">
            <Link to={"/"}>
              <div className="logo">
                <img
                  src="./src/assets/images/logo.png"
                  alt="logoimg"
                  width="70px"
                  height="70px"
                />
                <span>YOU集成管理工具</span>
              </div>
            </Link>
          </div>
          <JsonMenu
            menu={config.menu}
            userRule={config.userRule[this.state.type].concat(
              this.state.rule.split(",")
            )}
          ></JsonMenu>
        </Sider>
        <Layout>
          {/*头文件内容*/}
          <Header
            style={{ background: "#fff", padding: 0, textAlign: "right" }}
          >
            <a>
              <Icon
                type="mail"
                style={{
                  fontSize: "22px",
                  borderRadius: "25px",
                  backgroundColor: "#35e",
                  textAlign: "center",
                  height: "30px",
                  width: "30px",
                  color: "#fff",
                }}
              />
            </a>
            <Dropdown overlay={usermenu}>
              <a>
                <Icon
                  type="user"
                  style={{
                    fontSize: "22px",
                    borderRadius: "25px",
                    backgroundColor: "#e52",
                    textAlign: "center",
                    height: "30px",
                    width: "30px",
                    color: "#fff",
                  }}
                />
              </a>
            </Dropdown>
            <span>{this.state.name}</span>
          </Header>

          {/*测试主页内容*/}
          <Content style={{ margin: "0 16px" }}>{this.props.children}</Content>
          <Footer style={{ textAlign: "center" }}>
            ©2018 Created by Josef.You powered by ant design & React
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

// 配置路由
const WrappedNormalLoginForm = Form.create()(Component_Login);
render(
  <Router history={hashHistory}>
    <Route path="/" component={LeftSider}>
      <IndexRoute path="myhome" component={myHome} />
      //默认首页
      <Route path="myTable" component={myTable} />
      <Route path="myForm" component={myForm} />
      <Route path="myChart" component={myChart} />
      <Route path="wuye_currentFix" component={Component_wuye_currentFix} />
      <Route path="wuye_historyFix" component={Component_wuye_historyFix} />
      <Route path="richang_hetong_unfinish" component={Component_Hetong_Task} />
      <Route
        path="richang_hetong_isfinished"
        component={Component_Hetong_Mission}
      />
      <Route
        path="richang_hetong_currentMission"
        component={Component_Hetong_CurrentMission}
      />
      <Route
        path="richang_hetong_QUAMission"
        component={Component_Hetong_QUAmission}
      />
      <Route path="SMessenger" component={Component_SMessenger} />
      <Route path="rules" component={Component_user_rules} />
      <Route path="rent_bill" component={rentBill} />
      <Route path="rent_building" component={rentBuilding} />
      <Route path="rentBuildingProfile" component={rentBuildingProfile} />
      <Route path="rent_contract" component={rentContract} />
      <Route path="rentBI" component={rentBI} />
    </Route>
    <Route path="/login" component={WrappedNormalLoginForm}></Route>
  </Router>,
  document.getElementById("app")
);
