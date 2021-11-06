import React, { Component } from "react";
import {
    Button,
    Card,
    Layout,
    List,
    Drawer,
    InputNumber,
    Tag,
    Form,
    Divider,
    Col,
    Row,
    Statistic,
    Progress,
    Modal,
    Input
} from "antd";

import {
    getAllPicture,
    bid,
    getThePictureOwner,
    getAccount,
    auctionConfirm,
    web3
} from "../allapi"
import moment from 'moment';
import {CheckCircleOutlined, SyncOutlined,IssuesCloseOutlined} from "@ant-design/icons";
import "../App.css"

const {Content} = Layout;

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);

class MyTag extends Component {
    constructor() {
        super();
        this.state = {
            current:false
        }
    }
    render() {
        if (this.props.current) return(<Tag icon={<SyncOutlined spin />} color="processing">拍卖中</Tag>);
        else return(<Tag icon={<IssuesCloseOutlined />} color="yellow">未在拍卖中</Tag>);
    }
}

class Detail extends Component {
    render() {
        if (this.props.item.onsell) return (
            <>
                <Row gutter={30}>
                    <Col span={12}>
                        <Statistic title="起拍价" value={web3.utils.fromWei(this.props.item.startprice,"ether")} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="当前最高价" value={this.props.item.highestprice} />
                    </Col>
                </Row>
                <Divider/>
            </>
        )
        else return (
            <>
                <Row gutter={30}>
                    <Col span={12}>
                        <Statistic title="上次成交价" value={this.props.item.highestprice} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="买家" value={this.props.item.highest_bidder} />
                    </Col>
                </Row>
                <Divider/>
            </>
        )
    }
}

class AllPictureTable extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            visible: -1,
            childrenDrawer: -1,
            sameowner:false,
            whetherthehiggest:false
        }
        this.fetchData()
    }

    whetherthehighest= async(item)=>{
        let account=await getAccount();
        let timeStamp = moment(new Date()).unix()
        let timed=item.deadline
        console.log(timeStamp)
        console.log(timed)
        if(item.highest_bidder==account&&(timed<=timeStamp)){
            this.setState({
                whetherthehighest: true
            });
            
        }
        else
        {
            this.setState({
                whetherthehighest: false
            });
        }
        console.log("这是测试"+this.state.whetherthehighest);
    }

    async fetchData() {
        let tmp = await getAllPicture()
        console.log(tmp)
        this.setState({dataSource: tmp})
    }

    showDrawer = async(e, item) => {
        console.log(item.picture_id);
        await this.whetherthehighest(item);
        console.log(this.state.whetherthehiggest)
        this.setState({
            visible: item.picture_id,
        });
    };

    onClose = () => {
        this.setState({
            visible: -1,
        });
    };

    showChildrenDrawer = async(e, item) => {
        console.log(item.onsell)
        let account=await getAccount();
        let owner=await getThePictureOwner(item.picture_id)

      if(item.onsell&&account!=owner)
        this.setState({
            
            childrenDrawer: item.picture_id,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: -1
        });
    };

    onSubmit = async (values) => {
        console.log(values)
        await bid(values.picture_id, values.amount)
        Modal.success({
            content: '出价成功',
        });
    };
    
    onfinish =async(e,item)=>{
        await auctionConfirm(item.picture_id,item.highestprice)
        Modal.success({
            content: '东西是你的了',
        });
    }
    timestampToTimeFormat(timestamp, format = 'Y-M-D h:m') {
        let time = parseInt(timestamp)
        let date = new Date(time);
        let obj = {
            Y: date.getFullYear(),
            M: (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1),
            D: (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
            h: (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()),
            m: (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()),
            s: (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        }
        let newItem = format.split("").map(item => {
            for (let key in obj) {
                if (item === key) {
                    item = obj[key]
                }
            }
            return item;
        })
        if(obj["Y"]===1970)
        return '当前未开始拍卖'
        return newItem.join("");
    }

    render () {
        return(
            <Content style={{height: '100%'}}>
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        onChange: page => {
                            console.log(page);
                        },
                        pageSize: 3,
                    }}
                    dataSource={this.state.dataSource}
                    renderItem={item => (
                        <List.Item>
                            <Card
                                title={item.picture_id}
                                extra={
                                    <>
                                        <MyTag current={item.onsell}/>
                                        <Button size="small" onClick={e => this.showDrawer(e, item)}>详情</Button>
                                    </>
                                }
                            >
                                <p>{"物品名称:" + item.picture_nft}</p>
                            </Card>
                            <Drawer
                                title={item.title}
                                width={640}
                                closable={false}
                                onClose={this.onClose}
                                visible={this.state.visible === item.picture_id}
                            >
                                <DescriptionItem title="物品名称" content={item.picture_nft} />
                                <DescriptionItem title="上次最高出价" content={item.highestprice} />
                                <DescriptionItem title="截止时间" content={this.timestampToTimeFormat(item.deadline * 1000, 'Y/M/D h:m:s')} />
                                <Divider/>
                                <Detail item={item}/>
                                <Divider/>
                                <Button
                                    type="primary"
                                    onClick={e => this.showChildrenDrawer(e, item)}
                                    disabled={!item.onsell}
                                >
                                    我要参与拍卖
                                </Button>
                                <Divider/>
                                <Button
                                    type="primary"
                                    onClick={e => this.onfinish(e, item)}
                                    disabled={!this.state.whetherthehighest||item.startprice==0}
                                >
                                    东西是我的
                                </Button>
                                <Drawer
                                    title="出价"
                                    width={320}
                                    closable={false}
                                    onClose={this.onChildrenDrawerClose}
                                    visible={this.state.childrenDrawer === item.picture_id}
                                >
                                    <Form
                                        hideRequiredMark
                                        onFinish={this.onSubmit}
                                    >
                                        <Form.Item
                                            name="picture_id"
                                            label="物品id"
                                            hidden = "true"
                                            initialValue = {item.picture_id}
                                            rules={[{ 
                                                required: true, 
                                                message: '请输入你的起拍金额！' 
                                            }]}
                                            // hidden={true}
                                        >
                                            <InputNumber min={1} value={item.picture_id} />
                                        </Form.Item>
                                        <Form.Item
                                            name="amount"
                                            label="出价金额"
                                            rules={[{ required: true, message: '请输入你的出价金额！' }]}
                                        >
                                            <InputNumber min={1} />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                提交
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Drawer>
                            </Drawer>
                        </List.Item>
                    )}
                />
            </Content>
        )
    }
}

export default AllPictureTable