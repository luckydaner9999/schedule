/**
 * Created by gaodandan on 2017/5/10.
 */
import React from 'react'
import { render } from 'react-dom'
import {Router,Route,IndexRoute,Link,IndexLink } from 'react-router'
const ACTIVE = {color:'#ffa6a6'}
const style={};
style.link={
    color:'#ccc',
}
style.activeLink={
    ...style.link, //...引入style.link的所有属性
    color:'#ffa6a6'
}
const Footer = React.createClass({
    render:function(){
        return (
            <div className="bui_avg_sm_4 bui_ta_c bui_bgc_lgray bui_ptb_6">
                <li>
                    {/**使用IndexLink，可以让首页的链接不会一直处于活动状态**/}
                    <IndexLink to="/" style={style.link} active={style.activeLink} className="bui_block bui_plr_24 bui_tc_gray" >
                        <i className="fa-ticket fa fa-2x bui_fac_gray"></i>
                        <p>教程</p>
                    </IndexLink>
                </li>
                <li>
                    <Link to="/circle" style={style.link} active={style.activeLink} className="bui_block bui_plr_24 bui_tc_gray">
                        <i className="fa-plus-circle fa fa-2x bui_fac_gray"></i>
                        <p className="bui_ts_14">烘培圈</p>
                    </Link>
                </li>
                <li>
                    <Link to="/mall" style={style.link} active={style.activeLink} className="bui_block bui_plr_24 bui_tc_gray">
                        <i className="fa-delicious fa fa-2x bui_fac_gray"></i>
                        <p className="bui_ts_14">商城</p>
                    </Link>
                </li>
                <li>
                    <Link to="/my" style={style.link} active={style.activeLink} className="bui_block bui_plr_24 bui_tc_gray">
                        <i className="fa-user fa fa-2x bui_fac_gray"></i>
                        <p className="bui_ts_14">我的</p>
                    </Link>
                </li>

            </div>
        )
    }
});
export default Footer;