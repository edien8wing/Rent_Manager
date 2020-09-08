import React from 'react'
import {Row,Col,Checkbox,Form,Icon,Button,Input} from 'antd'
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import '../../assets/css/borderFrame.css';

//const WrappedNormalLoginForm = Form.create()(Component_Login);
/*
  <Component_BorderFrame ref='bf' title={this.state.test} >

*/

export default class Component_BorderFrame extends React.Component{
  constructor(props) {
    super(props);
    this.moment = 0;
  //  this.animation = { right: '-800px',opacity:'0', duration: 1000 };
  this.animation = { right: '-800px',opacity:'0', duration: 500 };
    this.props={
       title:'title',
       paused:'true',
    };
    this.state = {
      moment: 500,
      paused: true,
      reverse: false,
    };

  }


  close = () => {

    this.setState({
      paused: false,
      reverse: false,
      moment: null,
    });
  }
  open=()=>{
    this.setState({
      paused: false,
      reverse: true,
      moment: null,
    });
  }






  render() {
    /*var _this=this;
    window.setTimeout(function(){
      console.info('paused:'+_this.state.paused+" moment:"+_this.state.moment);
    },1000);*/
    return (
     <div className="queue-demo">



      <TweenOne
               animation={this.animation}
               paused={this.state.paused}
               reverse={this.state.reverse}
               moment={this.state.moment}

               className="borderFrame"
             >



              <div className="top">

                  <div className='head'>
                    {this.props.title}
                  </div>
                  <div className='btn-close' onClick={this.close}>
                    <Button size='large'>
                      <Icon type='close'></Icon>
                    </Button>
                  </div>
              </div>
              <div className='info'>
                {this.props.children[0]}

              </div>
              <div className="body">

                {this.props.children[1]}
              </div>

    </TweenOne>

     </div>
    );
  }
}
Component_BorderFrame.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  paused: PropTypes.bool,
};
