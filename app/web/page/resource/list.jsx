import React, { Component } from 'react';
import HomeLayout from 'component/homelayout/homelayout.jsx';
import './list.css';
import axios from 'axios';
import { Table, Icon, Switch, Radio, Form, Divider } from 'antd';
const FormItem = Form.Item;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        render: text => <a href="#">{text}</a>
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 170
    },
    {
        title: 'Tags',
        dataIndex: 'tags',
        key: 'tags'
    },
    {
        title: 'Action',
        key: 'action',
        width: 180,
        render: (text, record) => (
            <span>
                <a href="#">Edit</a>
                <Divider type="vertical" />
                <a href="#">Delete</a>
            </span>
        )
    }
];

const expandedRowRender = record => <p>{record.description}</p>;

export default class ResourceList extends Component {
    constructor() {
        super();
        this.state = {
            bordered: true,
            loading: true,
            pagination: { position: 'bottom' },
            size: 'default',
            expandedRowRender,
            title: undefined,
            showHeader: undefined,
            footer: undefined,
            scroll: undefined,
            data: []
        };
    }

    componentWillMount() {
        axios
            .get('http://localhost:7001/api/resource/list')
            .then(response => this.setState({ data: response.data, loading: false }));
    }

    render() {
        const state = this.state;
        return (
            <HomeLayout>
                <Table {...this.state} columns={columns} dataSource={this.state.data} />
            </HomeLayout>
        );
    }
}
