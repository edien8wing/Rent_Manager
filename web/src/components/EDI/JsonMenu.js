import React from 'react'
import { Menu, Icon, Button } from 'antd'
import {Link } from 'react-router'
const SubMenu = Menu.SubMenu;
//无限递归json自动生成Menu

export default class JsonMenu extends React.Component{
/*案例
const menu=[{
  name: '表单页1',
  icon: 'form',
  path: 'form',
  children: [{
    name: '基础表单',
    path: 'basic-form',
  }, {
    name: '分步表单',
    path: 'step-form',
  }, {
    name: '高级表单',
    authority: 'admin', // 配置准入权限
    path: 'advanced-form',
  }],
},
{
name: '表单页2',
icon: 'form',
path: 'form',
children: [{
  name: '基础表单',
  path: 'basic-form',
}, {
  name: '分步表单',
  path: 'step-form',
}, {
  name: '高级表单',
  authority: 'admin', // 配置准入权限
  path: 'advanced-form',
}],
}
]
*/
  constructor(props){
    super();

  }
  render(){

    return(

      <Menu theme={'dark'}
        mode="inline">
      {
        this.renderMenu(this.props.menu,this.props.userRule)
      }
      </Menu>

    );
  }
  renderMenu=(json,rule)=>{
    let _this=this;
    //console.info('renderMenu:',json)
    return(

      json.map(function(arr){
        //如果当前的键值在用户功能中时进行渲染
        if(_this.hasValue(arr.key)){
            if(arr.children){//如果当前arr是父组件
              return (

                <SubMenu title={<span><Icon type="appstore" /><span>{arr.name}</span></span>}>
                  {_this.renderMenu(arr.children)}
                </SubMenu>
               )
            }else{//如果当前arr是子组件
              return (<Menu.Item><Link to={arr.path}>{arr.name}</Link></Menu.Item>)
            }
      //  console.info('map:',arr)
        }
      })
    )
  }
  hasValue=(value)=>{
  //  console.info('userrule',this.props.userRule,value)
    var ans=false
    for(let i =0;i<this.props.userRule.length;i++){
      //console.info('this.props.userRule[i]',this.props.userRule[i],'value',value)
      if(this.props.userRule[i]==value){
        ans=true
        break;
      }
    }
    //console.info(ans)
    return ans
  }
}
