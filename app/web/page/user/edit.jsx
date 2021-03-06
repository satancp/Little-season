import React, { Component } from 'react';
import './add.css';
import axios from 'axios';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;

const location = [
    {
        value: 'Shanghai',
        label: 'Shanghai',
        children: [
            {
                value: 'Shanghai',
                label: 'Shanghai',
                children: [
                    {
                        value: 'Xu Hui',
                        label: 'Xu Hui'
                    }
                ]
            }
        ]
    },
    {
        value: 'Zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'Hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'Xi Hu',
                        label: 'Xi Hu'
                    }
                ]
            }
        ]
    },
    {
        value: 'Jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'Nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'Zhong Hua Men',
                        label: 'Zhong Hua Men'
                    }
                ]
            }
        ]
    }
];

let UserAdd = undefined;

class RegistrationForm extends Component {
    constructor() {
        super();
        this.state = {
            confirmDirty: false,
            autoCompleteResult: []
        };
        this.handleSubmit = e => {
            return new Promise((resolve, reject) => {
                e.preventDefault();
                this.props.form.validateFieldsAndScroll((err, values) => {
                    if (!err) {
                        console.log('Received values of form: ', values);
                        const postValues = { ...values };
                        delete postValues.confirm;
                        postValues.id = this.props.exist.id;
                        postValues.phone = '+' + postValues.prefix + ' ' + postValues.phone;
                        postValues.location = postValues.location.join('-');
                        delete postValues.prefix;
                        console.log(postValues);
                        axios.post('http://localhost:7001/api/user/update', postValues).then(response => {
                            this.setState({ data: response.data, loading: false });
                            resolve();
                        });
                    } else reject();
                });
            });
        };
        this.handleConfirmBlur = e => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        };
        this.compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        };
        this.validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], { force: true });
            }
            callback();
        };
        this.handleWebsiteChange = value => {
            let autoCompleteResult;
            if (!value) {
                autoCompleteResult = [];
            } else {
                autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
            }
            this.setState({ autoCompleteResult });
        };
    }

    componentWillUnmount() {
        this.props.onRef(undefined);
    }

    componentDidMount() {
        this.props.onRef(this);
        this.props.form.setFieldsValue({
            id: this.props.exist.id,
            email: this.props.exist.email,
            password: this.props.exist.password,
            nickname: this.props.exist.nickname,
            location: this.props.exist.location.split('-'),
            phone: this.props.exist.phone.split(' ')[1],
            prefix: this.props.exist.phone.split(' ')[0].substring(1)
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { autoCompleteResult } = this.state;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: '86'
        })(
            <Select style={{ width: 70 }}>
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
            </Select>
        );

        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!'
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Password">
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!'
                            },
                            {
                                validator: this.validateToNextPassword
                            }
                        ]
                    })(<Input type="password" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Confirm">
                    {getFieldDecorator('confirm', {
                        rules: [
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            },
                            {
                                validator: this.compareToFirstPassword
                            }
                        ]
                    })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
							Nickname&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('nickname', {
                        rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }]
                    })(<Input />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Location">
                    {getFieldDecorator('location', {
                        initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                        rules: [{ type: 'array', required: true, message: 'Please select your location!' }]
                    })(<Cascader options={location} />)}
                </FormItem>
                <FormItem {...formItemLayout} label="Phone">
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: 'Please input your phone number!' }]
                    })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
                </FormItem>
            </Form>
        );
    }
}

export default (UserAdd = Form.create()(RegistrationForm));
