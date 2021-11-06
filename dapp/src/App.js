import React, { Component } from "react";
import {PageHeader, Menu, BackTop, Layout, Divider, Avatar, Card, List} from 'antd';
import { UnorderedListOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import {Link, Route} from 'react-router-dom';

import AllPictureTable from "./Function/AllPictureTable";
import MyAuction from "./Function/MyAuction";
import MyPicture from "./Function/MyPicture";
import CreatePicture from "./Function/CreatePicture";

import{
  getAccount
}
from "./allapi";

import 'antd/dist/antd.css';
import "./App.css";
import background from "./backgroud.jpg"
// import UserIcon from "./bac"
// import Meta from "antd/es/card/Meta";

const {SubMenu} = Menu;
const {Header, Content, Footer} = Layout;
class App extends Component {
  state = { storageValue: Array(), web3: null, accounts: null, contract: null, show:null };

    constructor() {
      super()
      this.state = {
          current: 'AllPictureTable',
          account: '',
          MyFunds_1: [],
          MyFunds_2: [],
          AllFunds: []
      }
    }

   componentWillMount=async()=>{
      let accounts = await getAccount()
      this.setState({
          account: accounts,
      })
  }

  handleClick = e => {
      this.setState({ current: e.key });
  };

  refreshFunction = () => {
      window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts[0]) {
              this.setState({ account: accounts[0]})
          }
      })
  }
  render() {
    this.refreshFunction()

    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                title="拍卖系统"
                avatar={{src: background}}
                className="header"
            />
            <Layout>
                <Header
                    account={this.state.account}
                />
                <Content>
                    <Menu
                        onClick={this.handleClick}
                        selectedKeys={[this.state.current]}
                        mode="horizontal"
                    >
                        <Menu.Item
                            key="AllPictureTable"
                            icon={<UnorderedListOutlined />}
                            style={{width: '30%', textAlign: 'center'}}
                        >
                            <Link to={{pathname: "/AllPictureTable", state: {account: this.state.account, page: 1}}}>
                                所有图片
                            </Link>
                        </Menu.Item>
                        <SubMenu
                            key="SubMenu"
                            icon={<UserOutlined />}
                            title="我的图片"
                            style={{width: '30%', textAlign: 'center'}}
                        >
                            <Menu.Item key="MyAuction">
                                <Link to={{pathname: "/MyAuction", state: {account: this.state.account, page: 2}}}>
                                    我的拍卖
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="MyPicture">
                                <Link to={{pathname: "/MyPicture", state: {account: this.state.account, page: 3}}}>
                                    我的图片
                                </Link>
                            </Menu.Item>
                        </SubMenu>
                        <Menu.Item
                            key="发起拍卖"
                            icon={<PlusOutlined/>}
                            style={{width: '30%', textAlign: 'center'}}
                        >
                            <Link to={{pathname: "/CreatePicture", state: {account: this.state.account}}}>
                                上传新的物品
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Content>
                <Content className="site-layout-background" style={{padding: 24, margin: 0, minHeight: 420}}>
                    <Route path='/AllPictureTable' exact component={AllPictureTable}/>
                    <Route path='/MyAuction' exact component={MyAuction}/>
                    <Route path='/MyPicture' exact component={MyPicture}/>
                    <Route path='/CreatePicture' exact component={CreatePicture} style={{position: 'center'}}/>
                </Content>
                <Divider/>
                <Footer/>
            </Layout>
            <BackTop>
                <div className="backtotop">回到顶部</div>
            </BackTop>
        </div>
    );
}

  
}

export default App;