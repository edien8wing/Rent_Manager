import React from 'react'
import {Breadcrumb,message,Button} from 'antd'

import fetchJsonp from 'fetch-jsonp'
import {Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'
import { ChartCard, yuan, Field } from 'ant-design-pro/lib/Charts';
import { MiniBar,TagCloud } from 'ant-design-pro/lib/Charts';

import Trend from 'ant-design-pro/lib/Trend';
import { Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import AJAX from '../../bin/AJAX.js'
import COOKIE from '../../bin/COOKIE.js'
import Chart2 from '../EDI/Chart2.js'
import Chart3 from '../EDI/Chart3.js'
import Component_BorderFrame from '../EDI/borderFrame.js'
import Component_addMissionModal from '../hetong/Component_addMissionModal.js'
import JsonMenu from '../EDI/JsonMenu.js'
//antdesignpro的样式文件
import 'ant-design-pro/dist/ant-design-pro.css';
export default class Component_SMessenger extends React.Component{
  constructor(props){
    super(props);


  }
  //组件加载前
componentWillMount=()=>{
}



  render(){
      return(
        <div/>
      );
    }


}
