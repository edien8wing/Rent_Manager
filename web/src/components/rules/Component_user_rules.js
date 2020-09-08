import React from "react";
import { Layout, Input, Breadcrumb, message, Button, Menu } from "antd";

import fetchJsonp from "fetch-jsonp";
import {
  Router,
  Route,
  Link,
  hashHistory,
  IndexRoute,
  Redirect,
  IndexLink,
} from "react-router";
import { ChartCard, yuan, Field } from "ant-design-pro/lib/Charts";
import { MiniBar, TagCloud } from "ant-design-pro/lib/Charts";

import Trend from "ant-design-pro/lib/Trend";
import { Switch, Divider, Row, Col, Icon, Tooltip } from "antd";
import numeral from "numeral";

import AJAX from "../../bin/AJAX.js";
import config from "../../bin/config.js";
//antdesignpro的样式文件
import "ant-design-pro/dist/ant-design-pro.css";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header, Content, Sider, Footer } = Layout;
export default class Component_user_rules extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allUsers: [], //左侧所有用户
      current: {
        //当前用户数据
        id: "0",
        userName: "xxx",
        password: "???",
        name: "test",
        type: "type",
        depId: "",
        rule: [], //启用的规则
        dingId: "",
      },
    };
    this.loadUsers();
  }
  //组件加载前
  componentWillMount = () => {};

  render() {
    return (
      <Layout>
        <Header style={{ backgroundColor: "#f8fbff" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>设置</Breadcrumb.Item>
            <Breadcrumb.Item>权限设置</Breadcrumb.Item>
          </Breadcrumb>
        </Header>
        <Layout>
          <Sider style={{ backgroundColor: "#fff" }}>
            {this.renderUserMenu()}
          </Sider>
          <Content>
            <div style={{ float: "left", margin: "20" }}>
              {this.renderCurrentInfo()}
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
  //获取用户数据
  loadUsers = () => {
    let _this = this;
    let back = AJAX.send3("rules", "getAllUser");
    back.then((json) => {
      if (json.data) {
        message.success("获取到用户数据:" + json.data.length + "条");
        console.info(json.data);
        _this.setState({ allUsers: json.data });
      } else {
        message.error(json.code);
      }
    });
  };
  renderCurrentInfo = () => {
    return (
      <div>
        <Row>
          <h2>当前选中的用户基本信息</h2>
        </Row>
        <Row>
          <Col span={4}>
            id:
            <Input size="small" disabled="true" value={this.state.current.id} />
          </Col>
          <Col span={4}>
            登陆名:
            <Input
              size="small"
              disabled="true"
              value={this.state.current.userName}
            />
          </Col>
          <Col span={4}>
            密码:
            <Input
              size="small"
              value={this.state.current.password}
              onChange={this.setCurrentInfo.bind(this, "password")}
            />
          </Col>
          <Col span={4}>
            姓名:
            <Input
              size="small"
              value={this.state.current.name}
              onChange={this.setCurrentInfo.bind(this, "name")}
            />
          </Col>
          <Col span={4}>
            类型:
            <Input
              size="small"
              disabled="true"
              value={this.state.current.type}
              onChange={this.setCurrentInfo.bind(this, "type")}
            />
          </Col>
          <Col span={4}>
            dingId:
            <Input
              size="small"
              value={this.state.current.dingId}
              onChange={this.setCurrentInfo.bind(this, "dingId")}
            />
          </Col>
          <Col span={4}>
            depId:
            <Input
              size="small"
              value={this.state.current.depId}
              onChange={this.setCurrentInfo.bind(this, "depId")}
            />
          </Col>
        </Row>
        <Row>如果要修改不可更改的内容 请找尤小伟</Row>
        <Divider />
        <Row>
          <h2>左侧menu功能权限</h2>
        </Row>
        <Row>{this.renderMenuMap(config.menu)}</Row>
        <Divider />
        <Row>
          <h2>细小的各种功能</h2>
        </Row>
        <Row>
          {config.item.map((current, i) => (
            <Col span={6}>
              <Switch
                onChange={this.changeCurrentRule.bind(this, current.key)}
                checked={this.currentRule_hasValue(current.key) ? true : false}
              />
              {current.key}:{current.name}
            </Col>
          ))}
        </Row>
        <Divider />
        <Button type="primary" onClick={this.sendUserInfo}>
          保存
        </Button>
      </div>
    );
  };
  setCurrentInfo = (value, e) => {
    console.info(value, e.target.value);
    let inst = this.state.current;
    inst[value] = e.target.value;
    this.setState({ current: inst });
  };
  currentRule_hasValue = (value) => {
    let ans = false;
    for (let i = 0; i < this.state.current.rule.length; i++) {
      if (this.state.current.rule[i] == value) {
        ans = true;
        break;
      }
    }
    //console.info(value,ans);
    return ans;
  };
  //渲染数据rule节点数据
  renderMenuMap = (json) => {
    let _this = this;
    //console.info('renderMenu:',json)
    return json.map(function (arr) {
      if (arr.children) {
        //如果当前arr是父组件
        return (
          <div>
            <Col span={6}>
              <Switch
                onChange={_this.changeCurrentRule.bind(this, arr.key)}
                checked={_this.currentRule_hasValue(arr.key) ? true : false}
              />
              {arr.key}:{arr.name}
            </Col>
            {_this.renderMenuMap(arr.children)}
          </div>
        );
      } else {
        //如果当前arr是子组件
        return (
          <Col span={6}>
            <Switch
              onChange={_this.changeCurrentRule.bind(this, arr.key)}
              checked={_this.currentRule_hasValue(arr.key) ? true : false}
            />
            {arr.key}:{arr.name}
          </Col>
        );
      }
      //  console.info('map:',arr)
    });
  };
  //当修改Switch的rule
  changeCurrentRule = (value, e) => {
    //  console.info('checked');
    let inst = this.state.current;
    if (e) {
      inst.rule.splice(-1, 0, value);
    } else {
      for (let i = 0; i < inst.rule.length; i++) {
        if (inst.rule[i] == value) {
          inst.rule.splice(i, 1);
        }
      }
    }
    this.setState({ current: inst });
  };
  //获取当前用户
  getCurrentUser = (e) => {
    //console.log('click ', e.key);
    //console.info(this.state.allUsers)

    for (let i = 0; i < this.state.allUsers.length; i++) {
      //console.info(this.state.allUsers[i].id,e.key)
      if (this.state.allUsers[i].id == e.key) {
        //
        //console.info(this.state.allUsers[i].rules)
        let thisUser = {
          //当前用户数据
          id: this.state.allUsers[i].id,
          userName: this.state.allUsers[i].userName,
          password: this.state.allUsers[i].password,
          name: this.state.allUsers[i].name,
          type: this.state.allUsers[i].type,
          dingId: this.state.allUsers[i].dingId,
          depId: this.state.allUsers[i].depId,
          rule: this.state.allUsers[i].rule.split(","), //启用的规则
        };
        this.setState({ current: thisUser }, () => {
          console.info(1);
        });
      }
    }
  };
  //载入用户menu
  renderUserMenu = () => {
    return (
      <Menu onClick={this.getCurrentUser} mode="inline">
        {this.state.allUsers.map((item, i) => (
          <Menu.Item key={item.id}>{item.name}</Menu.Item>
        ))}
      </Menu>
    );
  };
  //发送用户数据
  sendUserInfo = () => {
    let _this = this;
    let back = AJAX.send3("rules", "chageUserInfo", this.state.current);
    back.then((json) => {
      console.info(json);
      if (json.data) {
        message.success(json.code);
      } else {
        message.error(json.code);
      }
    });
  };
}
