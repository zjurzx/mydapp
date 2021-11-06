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
    Input,
    DatePicker
} from "antd";

import {
    getThePictureBelongMe,
    cancelAuction,
    creataAuction,
    web3
} from "../allapi"
import moment from 'moment';
import {CheckCircleOutlined, SyncOutlined,IssuesCloseOutlined } from "@ant-design/icons";
import "../App.css"

const {Content} = Layout;

const DescriptionItem = ({ title, content }) => (
    <div className="site-description-item-profile-wrapper">
        <p className="site-description-item-profile-p-label">{title}:</p>
        {content}
    </div>
);

function disabledDate(current) {
    return current && current < moment().endOf('day');
}

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
                <Row gutter={40}>
                    <Col span={14}>
                        <Statistic title="起拍价" value={web3.utils.fromWei(this.props.item.startprice,"ether")} />
                    </Col>
                    <Col span={14}>
                        <Statistic title="当前最高价" value={this.props.item.highestprice} />
                    </Col>
                </Row>
                <Divider/>
            </>
        )
        else return (
            <>
                <Row gutter={40}>
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

class MyPicture extends Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            visible: -1,
            childrenDrawer: -1
        }
        this.fetchData()
    }

    async fetchData() {
        let tmp = await getThePictureBelongMe()
        this.setState({dataSource: tmp})
    }

    showDrawer = (e, item) => {
        console.log(item.picture_id)
        
        this.setState({
            visible: item.picture_id,
        });
    };

    onClose = () => {
        this.setState({
            visible: -1,
        });
    };

    showChildrenDrawer = (e, item) => {
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
        let timeStamp = moment(new Date(values.date)).unix()
        let dat=new Date(values.date)
        console.log(dat)
        console.log(timeStamp)
        await creataAuction(values.picture_id, values.amount,timeStamp)
        Modal.success({
            content: '已开始拍卖',
        });
    };

    timestampToTimeFormat(timestamp, format = 'Y-M-D h:m') {
        console.log(timestamp)
        let time = parseInt(timestamp)
        time=time*1000
        console.log("这是tam")
        console.log(time)
        let date = new Date(time);
        console.log(date)
        let obj = {
            Y: date.getFullYear(),
            M: (date.getMonth() +1 < 10 ? '0' + (date.getMonth()+1 ) : (date.getMonth()+1) ),
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
                                <DescriptionItem title="截止时间" content={this.timestampToTimeFormat(item.deadline, 'Y/M/D h:m:s')} />
                                <Divider/>
                                <Detail item={item}/>
                                <Divider/>
                                <Button
                                    type="primary"
                                    onClick={e => this.showChildrenDrawer(e, item)}
                                    disabled={item.onsell}
                                >
                                    我要卖掉它
                                </Button>
                                <Divider/>
                                <Drawer
                                    title="拍卖"
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
                                            label="起拍金额"
                                            
                                            
                                            rules={[{ required: true, message: '请输入你的起拍金额！' }]}
                                        >
                                            <InputNumber min={1} />
                                        </Form.Item>
                                        <Form.Item
                                            name="date"
                                            label="截止日期"
                                            rules={[
                                            {
                                                required: true,
                                                message: "请选择截止日期！"
                                            },
                                            ]}
                                        >
                                            <DatePicker
                                            format="YYYY-MM-DD HH:mm:ss"
                                            disabledDate={disabledDate}
                                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                                            />
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

export default MyPicture