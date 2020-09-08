import React from 'react'
import {Link,hashHistory} from 'react-router'
import {Tabs,Icon} from 'antd';
const TabPane = Tabs.TabPane;

export default class Component_TabSwitch extends React.Component{
  constructor(props){
    super(props);

  }
  changePage=(key)=>{
    if(key==1){
      console.info(key);
      hashHistory.push('/richang_hetong_unfinish');
    }else if(key==2){
      console.info(key);
      hashHistory.push('/richang_hetong_isfinished');
    }else if(key==4){
      console.info(key);
      hashHistory.push('/richang_hetong_QUAMission');
    }else if(key==3){
      console.info(key);
      hashHistory.push('/richang_hetong_currentMission');
    }
  }
  render(){

    return(
      <div>
          <Tabs  activeKey={this.props.activeId} onChange={this.changePage}>
              <TabPane tab={<span><Icon type="apple" />未完成的节点[Task]</span>} key="1">
              </TabPane>
              <TabPane tab={<span><Icon type="apple" />未完成的项目[Mission]</span>} key="3">
              </TabPane>
              <TabPane tab={<span><Icon type="apple" />质保周期的mission[QUA-Mission]</span>} key="4">
              </TabPane>
              <TabPane tab={<span><Icon type="apple" />已完结的所有项目[END-Misssion]</span>} key="2">
              </TabPane>
          </Tabs>
      </div>
    );
  }
}
