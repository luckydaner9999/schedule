/**
 * Created by gaodandan on 2017/5/10.
 */
import React from 'react';
import ReactSwipe from 'react-swipe'
import Header from '../index/component/header'
import PublicNav from '../publicComponent/publicNav'
import PublicWaterFall from '../publicComponent/publicWaterFall'
import ModalBottom from '../publicComponent/modal_bottom'
import ModalFromRight from '../publicComponent/modal_from_right'
const IndexMain=React.createClass({
    getInitialState(){
        return{
            headerR:"右边",
            headerTitle:"React 学习首页",
            'modalState':'hide',
            'modalStateForRight':'hide',

        }

    },
    showModal(active){
      this.setState({
          'modalState':active
      })
    },
    showModalFromRight(){
      this.setState({
          'modalStateForRight':active
      })
    },
    render(){
        var headerL="<p>headerL</p>";
        return(
            <div>
                <div className="bui_fac_gray mp_page_header mp_bsd_b">
                    <Header
                        headerL={headerL}
                        headerR={this.state.headerR}
                        headerTitle={this.state.headerTitle}
                        showModal={this.showModal}
                        showModalFromRight={this.showModalFromRight} />
                </div>
                <div className="mp_page_body slideFast hasheader hasfooter">
                    <ReactSwipe>
                        <div style={{height:"240px"}}>
                            <div className="box">
                                <img src={"../images/user_center_bg.png"} style={{height:"240px",width:"100%" }}/>
                            </div>
                        </div>
                        <div style={{height:"240px"}}>
                            <div className="box">
                                <img src={"../images/uploadBg.png"} style={{height:"240px",width:"100%" }}/>
                            </div>
                        </div>

                    </ReactSwipe>
                    <PublicNav />
                    {this.props.children}
                    <PublicWaterFall />



                </div>
                { /*底部弹窗*/}
                <ModalBottom
                    modalState={this.state.modalState}
                    showModal={this.showModal} />
                { /*点击菜单弹窗*/}
                <ModalFromRight
                    modalStateForRight={this.state.modalStateForRight}
                    showModalFromRight={this.state.showModalFromRight} />

            </div>
        )
    }
});
export default IndexMain;