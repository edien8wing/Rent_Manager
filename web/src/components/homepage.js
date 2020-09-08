import React from 'react'
import {Breadcrumb,message,Button} from 'antd'

import fetchJsonp from 'fetch-jsonp'
import {Router, Route, Link, hashHistory, IndexRoute, Redirect, IndexLink} from 'react-router'
import { ChartCard, yuan, Field } from 'ant-design-pro/lib/Charts';
import { MiniBar,TagCloud } from 'ant-design-pro/lib/Charts';

import Trend from 'ant-design-pro/lib/Trend';
import { Row, Col, Icon, Tooltip } from 'antd';
import numeral from 'numeral';
import AJAX from '../bin/AJAX.js'
import COOKIE from '../bin/COOKIE.js'
import config from '../bin/config.js'
import Chart2 from './EDI/Chart2.js'
import Chart3 from './EDI/Chart3.js'
import Component_BorderFrame from './EDI/borderFrame.js'
import Component_addMissionModal from './hetong/Component_addMissionModal.js'
import JsonMenu from './EDI/JsonMenu.js'
//antdesignpro的样式文件
import 'ant-design-pro/dist/ant-design-pro.css';
export default class Home extends React.Component{
  constructor(props){
    super(props);

    this.state={
      hetong_sum_prices:0,
      hetong_count:0,
      tagCloud:[],
      fixData:[],
    }

  }
  //组件加载前
componentWillMount=()=>{
  var postmethod="type=hetong&fun=currentTask";
  var result=AJAX.send(postmethod);
  let _this=this;
  result.then(function (response) {
    //console.log(response);
    return response.json();
  }).then(function (json) {
  //  console.info(json);
    let ans=JSON.parse(json)
    let sum_prices=0;
    let tags=[];
    for(let i=0;i<ans.data.length;i++){
    //  console.info(ans.data[i])
      sum_prices=(sum_prices+ans.data[i].prices-ans.data[i].pay);
      tags.push({
        name:ans.data[i].wtd,
        value:sum_prices+ans.data[i].prices-ans.data[i].pay
      //  value: Math.floor((Math.random() * 50)) + 20,
      });
    }
    _this.setState({
      hetong_sum_prices:sum_prices,
      hetong_count:ans.data.length,
      tagCloud:tags,
    })

  }).catch(function (ex) {
    console.log('parsing failed', ex)
  });

   let postmethod2="type=wuye&fun=historySumNumberbyDay";
   let result2=AJAX.send(postmethod2);
  result2.then(function (response) {
    //console.log(response);
    return response.json();
  }).then(function (json) {
  //  console.info(json)
    let ans=JSON.parse(json)
    _this.setState({
        fixData:ans.data,
    })

  }).catch(function (ex) {
    console.log('parsing failed', ex)
  });
}



  render(){
        return(
        <div>

        <Row gutter={16}>
        {config.hasRule(101)?
          <Col span={8} style={{ marginTop: 24 }}>
            <ChartCard
              title="维修走势图"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(8846).format('0,0')}
              footer={<Field label="日维修报修走势" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniBar
                height={46}
                data={this.state.fixData}
              />
            </ChartCard>
          </Col>
          :''
          }
        {config.hasRule(102)?
          <Col span={8} style={{ marginTop: 24 }}>
          <ChartCard
                title="需要完成的Mission总金额"
                avatar={
                  <img
                    style={{ width: 56, height: 56 }}
                    src="https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png"
                    alt="indicator"
                  />
                }
                action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                total={yuan(this.state.hetong_sum_prices)}
                footer={<Field label="需要处理的Task数量：" value={this.state.hetong_count} />}
              />
          </Col>
          :''
        }
        {config.hasRule(103)?
          <Col span ={8} style={{ marginTop: 24 ,border:'solid 1px #ddd',backgroundColor:'#fff' }} >

              <TagCloud data={this.state.tagCloud} height={144} />

          </Col>
        :''
      }
        </Row>


        </div>
      );
    }


}
