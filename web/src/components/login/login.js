import React from "react";
import { message, Row, Col, Checkbox, Form, Icon, Button, Input } from "antd";
import {
  Router,
  Route,
  Link,
  hashHistory,
  IndexRoute,
  Redirect,
  IndexLink,
} from "react-router";
import "../../assets/css/login.css";
import AJAX from "../../bin/AJAX.js";
import COOKIE from "../../bin/COOKIE.js";
import config from "../../bin/config.js";

const FormItem = Form.Item;
//const WrappedNormalLoginForm = Form.create()(Component_Login);

export default class Component_Login extends React.Component {
  constructor() {
    super();
    this.state = {
      userName: "",
      password: "",
    };
  }
  send = () => {
    console.info("username:" + this.state.userName);
    console.info("password:" + this.state.password);
    var body = {
      username: this.state.userName,
      password: this.state.password,
    };
    var result = AJAX.send("type=user&fun=login&json=" + JSON.stringify(body));

    result
      .then(function (response) {
        //  console.log(response)
        return response.json();
      })
      .then(function (json) {
        console.log("back", json);
        var data = JSON.parse(json);
        if (data.type == 0) {
          message.error("错误：" + data.code);
        } else {
          COOKIE.set("name", data.data.name);
          COOKIE.set("type", data.data.type);
          //console.info('config.userRule:',config.userRule);
          COOKIE.set(
            "rule",
            config.userRule[data.data.type].concat(data.data.rule.split(","))
          );
          COOKIE.set("id", data.data.id);
          COOKIE.set("dingId", data.data.dingId);
          COOKIE.set("depId", data.data.depId);
          message.success("欢迎:" + data.data.name + " 正在为您进行跳转");
          setTimeout(function () {
            hashHistory.push("/");
          }, 800);
        }
      })
      .catch(function (ex) {
        console.log("parsing failed", ex);
      });
  };
  userNameChange = (event) => {
    var newValue = event.target.value;
    this.setState({ userName: newValue });
  };
  passwordChange = (event) => {
    var newValue = event.target.value;
    this.setState({ password: newValue });
  };
  render() {
    //  COOKIE.set('S_NAME','sssss');
    //  console.info(COOKIE.get('S_NAME'));
    //  hashHistory.push('/');
    //  const { getFieldDecorator } = this.props.form;
    return (
      <div className="loginform">
        <Row>
          <Col xs={0} md={9}></Col>
          <Col xs={24} md={6}>
            <div className="logo">
              <img
                src="./src/assets/images/logo.png"
                alt="logoimg"
                width="70px"
                height="70px"
              />
              YOU集成管理工具
            </div>
            <Form className="login-form">
              <FormItem>
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onChange={this.userNameChange}
                  placeholder="Username"
                />
              </FormItem>
              <FormItem>
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  onChange={this.passwordChange}
                  type="password"
                  placeholder="Password"
                />
              </FormItem>
              <FormItem>
                <Button
                  type="primary"
                  className="login-form-button"
                  onClick={this.send}
                  style={{ width: "200px" }}
                >
                  登陆
                </Button>
              </FormItem>
            </Form>
          </Col>
          <Col xs={0} md={9}></Col>
        </Row>
      </div>
    );
  }
}
