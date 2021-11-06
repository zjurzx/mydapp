import React, { Component } from "react";

import {
    createPicture,
} from "../allapi"

import { Form, Input, Button, DatePicker, InputNumber, Select, Modal } from 'antd';
import moment from 'moment';
import "../App.css"

function disabledDate(current) {
    return current && current < moment().endOf('day');
}

class CreatePicture extends Component {
    formRef = React.createRef();

    onSubmit = async (values) => {
        let timeStamp = moment(new Date(values.date)).unix()
        await createPicture(values.name)
        this.formRef.current.setFieldsValue({
            "name": "",
        })
        Modal.success({
            content: '提交成功！',
        });
    };

    render () {
        return(
            <div className="form">
                <Form
                    labelCol={{span: 8}}
                    wrapperCol={{span: 10}}
                    layout="horizontal"
                    style={{alignItems: 'center'}}
                    onFinish={this.onSubmit}
                    ref={this.formRef}
                >
                    <Form.Item
                        name="name"
                        label="物品名称"
                        rules={[{
                            required: true,
                            message: "请填写物品名称！"
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default CreatePicture