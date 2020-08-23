import React, { Component } from "react";
import { reqWeather } from "../../api/index";
import { Modal } from "antd";
import { connect } from "react-redux";
import { formateDate } from "../../utils/dateUtils";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./index.less";
import menuList from "../../config/menuConfig";
import LinkButton from "../../components/link-button";
import { logout } from "../../redux/action";

class Header extends Component {
  static propTypes = {
    headTitle: PropTypes.string.isRequired,
  };
  state = {
    currentTime: formateDate(Date.now()), // 当前时间
    dayPictureUrl: "",
    weather: "",
  };
  /*
第一次render()之后执行一次
一般在执行异步操作：发ajax请求/启动定时器
*/
  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({ currentTime });
    }, 1000);
  };
  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("xiamen");
    this.setState({ dayPictureUrl, weather });
  };
  getTitle = () => {
    //得到当前请求入境
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      // 如果当前item对象的key与path一样，item的title就是 需要显示的titile
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.key) === 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  logout = (e) => {
    Modal.confirm({
      content: "确定要退出吗?",
      onOk: () => {
        this.props.logout();
      },
    });
  };
  componentDidMount() {
    this.getTime();
    this.getWeather();
  }
  /*
  组建卸载之前，调用
  */
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }
  render() {
    const { headTitle } = this.props;
    const { currentTime, dayPictureUrl, weather } = this.state;
    const { username } = this.props.user;
    const title = headTitle;
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎，{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <img src={dayPictureUrl} alt="weather" />
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    headTitle: state.headTitle,
    user: state.user,
  }),
  { logout }
)(withRouter(Header));
