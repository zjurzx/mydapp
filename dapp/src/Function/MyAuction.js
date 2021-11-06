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
    getThePictureOwner,
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

function disabledDate(current) {
    return current && current < moment().endOf('day');
}

class MyTag extends Component {
    render() {
        return(<Tag icon={<SyncOutlined spin />} color="processing">拍卖中</Tag>);
    }
}

class Detail extends Component {
    render() {
        return (
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
        var uu=[];
        for(let i=0;i<tmp.length;i++)
        {
            if(tmp[i]["onsell"]===true)
            {
                uu.push(tmp[i]);
            }
        }
        this.setState({dataSource: uu})
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

    onSubmit = async (e,values) => {
        await cancelAuction(values.picture_id)
        Modal.success({
            content: '拍卖取消',
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
                                    onClick={e => this.onSubmit(e, item)}
                                >
                                    有内鬼，取消交易
                                </Button>
                                <Divider/>
                                
                                <Divider/>
                            </Drawer>
                        </List.Item>
                    )}
                />
            </Content>
        )
    }
}

export default MyPicture