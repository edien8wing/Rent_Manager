import G2 from '@antv/g2';
import React from 'react'

//父组件中直接使用<Chart2 data={data} onClick={this.getValue.bind(this)}>调用
//event.data._origin.x)
//props.id 指定id
//props.height 指定高度
//props.data指定数据
//props.onClick 指定点击数据返回函数参数1 事件，参数2 选择到的item json
export default class Chart2 extends React.Component {
//构造函数
    constructor(props) {
      console.info('chart2 constructor'),
        super(props)
        if(this.props.id==null){
          this.chartId='CHArt'+Math.floor(Math.random()*10000000);
        }else{
          this.chartId=this.props.id;
        }
        this.selectedItem=[];
    }


    //首次加载
    componentDidMount(){
      console.info('CHART2 did Mount')
      const _this=this;
        //若没有chart则新建一个
        if(this.chart==null){
          this.chart = new G2.Chart({
            container: this.chartId,
            forceFit: true,
            height: this.props.height,
          });
       }
       //获取数据
      this.chart.source(this.props.data);
      //刻度关系
    /*  this.chart.scale('y', {
        tickInterval: 20
      });*/
      //设置炫富tooltip
      this.chart.tooltip({
        triggerOn: 'mousemove' , // tooltip 的触发方式，默认为 mousemove
        crosshairs: {
          type: 'rect',
          style: {

          }
        }, // tooltip 辅助线配置
        offset: 10, // tooltip 距离鼠标的偏移量
        inPlot: true, // 将 tooltip 展示在指定区域内
        follow: true, // tooltip 是否跟随鼠标移动
        position:  'top' // 固定位置展示 tooltip
      });
      this.chart.interval().position('x*y').label('y').tooltip('y').select({
            mode: 'multiple', // 多选还是单选
            style: {
              fill: '#ff9c00', // 选中的样式
            },
          });
      this.chart.on('interval:click',event=>{
        //console.info(event);
        var x=event.data._origin.x;
        var y=event.data._origin.y;
        var hasValue=false;
        for(var i=0;i<this.selectedItem.length;i++){
          if(this.selectedItem[i].x==x && this.selectedItem[i].y==y){
            hasValue=true
            this.selectedItem.splice(i,1);
            break;
          }
        }
        if(!hasValue){
          var newSelectItem={'x':x,'y':y}
          this.selectedItem.push(newSelectItem);
        }
        _this.props.onClick(event,this.selectedItem);//事件，选中的数据json
      });
      //console.info('start render chart');
      this.chart.render();
      //console.info('end render chart');


      //console.info('CHART2  Mount 结束');
    }
//二次加载
    componentDidUpdate(){

      console.info('chart2 did update');
            this.chart.source(this.props.data);
            this.chart.render();
            const shapes = this.chart.getAllGeoms()[0].getShapes();
            //console.info('获取所有geoms',this.chart.getAllGeoms());
            //console.info('获取所有shapes',this.chart.getAllGeoms()[0].getShapes());
            //console.info('设置shapes 是否选中');
            //console.info('选中的shapelist',this.selectedItem);
            for (let i = 0, len = shapes.length; i < len; i++) {
              const shape = shapes[i];
              const origin = shape.get('origin')['_origin'];
              //console.info('origin',origin);
              const x = origin.x;
              const y = origin.y;

              for(var j=0;j<this.selectedItem.length;j++){
                //console.info("参数对比",this.selectedItem[j].x,x,this.selectedItem[j].y,y);
                if(this.selectedItem[j].x==x && this.selectedItem[j].y==y){
                  this.chart.getAllGeoms()[0].setShapeSelected(shape);
                  //console.info('选中的shape',shape);
                }
              }
            }
    }
    //根节点预置
    render() {
      console.info('chart2 render');
        return (
            <div id={this.chartId}/>
        )
    }
}
