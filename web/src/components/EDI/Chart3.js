import React from 'react'
import {Label, Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
var _this;
var isSelectItem=[];
export default class Chart3 extends React.Component{
  constructor(props){
    super(props);
    _this=this;
    isSelectItem=[];
    this.state={
      height:this.props.height||400,
      data:this.props.data,
      cols:this.props.cols,
    }
  }

  //获取数值返回到props.onClick
  getValue=function(e){

    //如果点击在其他位置，没有data数据则直接
    if(!e.data){
      return;
    }

    let hasValue=false
    for(var i =0;i<isSelectItem.length;i++){
      if(isSelectItem[i][Object.keys(_this.props.cols)[1]]==e.data._origin[Object.keys(_this.props.cols)[1]]){
        isSelectItem.splice(i,1);
        console.info('hasvalue');
        hasValue=true;
      }
    }
    if(!hasValue){
      let item1=Object.keys(_this.props.cols)[0]
      let item2=Object.keys(_this.props.cols)[1]
      let newSelectItem={}
       newSelectItem[item1]=e.data._origin[Object.keys(_this.props.cols)[0]];
       newSelectItem[item2]=e.data._origin[Object.keys(_this.props.cols)[1]];
       isSelectItem.push(newSelectItem);
    }


  //  console.info(isSelectItem);
    _this.props.onClick(isSelectItem);
  }
  render(){
    //console.info(this.state.cols);
    //console.info('render');
    return(

      <Chart  height={this.props.height} data={this.props.data} scale={this.props.cols} forceFit={true}
      onPlotClick={this.getValue}
      >
        <Axis name={Object.keys(this.props.cols)[0] }/>
        <Axis name={Object.keys(this.props.cols)[1] }/>
        <Legend position="top" dy={-20} />
        <Tooltip />
        <Geom type="interval" position={Object.keys(this.props.cols)[1]+'*'+Object.keys(this.props.cols)[0]}

         select={[true, {
         mode:  'multiple', // 选中模式，单选、多选
         style: {fill: '#ff9c00', }, // 选中后 shape 的样式
         cancelable: true , // 选中之后是否允许取消选中，默认允许取消选中
         animate: true  // 选中是否执行动画，默认执行动画
       }]} >
       <Label content={Object.keys(this.props.cols)[0]}  />
       </Geom>
      </Chart>
    );
  }
}
