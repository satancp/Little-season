import React, { Component } from 'react';
import HomeLayout from 'component/homelayout/homelayout.jsx';
import EditPage from './edit.jsx';
import './list.css';
import axios from 'axios';
import { Table, Modal, Icon, Tooltip, Badge, Switch, Radio, Button, Form, Divider } from 'antd';
const FormItem = Form.Item;

export default class UserList extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 80,
                sorter: (a, b) => a.id - b.id,
                render: text => <a href="#">{text}</a>
            },
            {
                title: 'Nickname',
                dataIndex: 'nickname',
                key: 'nickname',
                width: 120
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 170
            },
            {
                title: 'Location',
                dataIndex: 'location',
                key: 'location',
                filters: [
                    {
                        text: 'Zhejiang',
                        value: 'Zhejiang'
                    },
                    {
                        text: 'Shanghai',
                        value: 'Shanghai'
                    }
                ],
                onFilter: (value, record) => record.location.indexOf(value) === 0
            },
            {
                title: 'Phone Number',
                dataIndex: 'phone',
                key: 'phone'
            },
            {
                title: 'Status',
                key: 'status',
                filters: [
                    {
                        text: 'Normal',
                        value: 1
                    },
                    {
                        text: 'Banned',
                        value: 0
                    }
                ],
                onFilter: (value, record) => record.status == value,
                render: (text, record) =>
                    !!record.status ? (
                        <span>
                            <Badge status="success" />Normal
                        </span>
                    ) : (
                        <span>
                            <Badge status="error" />Banned
                        </span>
                    )
            },
            {
                title: 'Action',
                key: 'action',
                width: 180,
                render: (text, record) => (
                    <span>
                        <Tooltip title="Edit">
                            <Button
                                type="primary"
                                shape="circle"
                                icon="edit"
                                onClick={() => this.showEditModal(record)}
                            />
                        </Tooltip>
                        <Divider type="vertical" />
                        {!!record.status ? (
                            <Tooltip title="Ban">
                                <Button shape="circle" icon="lock" onClick={() => this.showStatusModal(record)} />
                            </Tooltip>
                        ) : (
                            <Tooltip title="Unban">
                                <Button shape="circle" icon="unlock" onClick={() => this.showStatusModal(record)} />
                            </Tooltip>
                        )}
                        <Divider type="vertical" />
                        <Tooltip title="Delete">
                            <Button
                                type="danger"
                                shape="circle"
                                icon="delete"
                                onClick={() => this.showDeleteModal(record)}
                            />
                        </Tooltip>
                    </span>
                )
            }
        ];

        this.expandedRowRender = record => {
            const columns = [
                { title: 'Operation Content', dataIndex: 'operation_content', key: 'operation_content' },
                { title: 'Operation Date', dataIndex: 'operation_date', key: 'operation_date' }
            ];
            return <Table columns={columns} dataSource={record.operations} pagination={false} rowKey="id" />;
        };
        this.state = {
            bordered: true,
            loading: true,
            editLoading: false,
            deleteLoading: false,
            visibleDeleteModal: false,
            visibleStatusModal: false,
            visibleEditModal: false,
            banLoading: false,
            pagination: { position: 'bottom', pageSize: 10 },
            size: 'default',
            expandedRowRender: this.expandedRowRender,
            title: undefined,
            showHeader: undefined,
            footer: undefined,
            scroll: undefined,
            statusText: 'Do you confirm to ',
            currentId: undefined,
            currentStatus: undefined,
            currentData: undefined,
            data: []
        };
        this.handleOkDeleteModal = () => {
            this.setState({
                deleteLoading: true
            });
            this.deleteData(this.state.currentId);
        };
        this.handleCancelDeleteModal = () => {
            this.setState({
                visibleDeleteModal: false
            });
        };
        this.showDeleteModal = r => {
            this.setState({
                visibleDeleteModal: true,
                currentId: r.id
            });
        };
        this.handleOkEditModal = e => {
            this.setState({
                editLoading: true
            });
            this.editpage
                .handleSubmit(e)
                .then(() => {
                    this.setState({
                        editLoading: false,
                        visibleEditModal: false
                    });
                    axios
                        .get('http://localhost:7001/api/user/list')
                        .then(response => this.setState({ data: response.data, loading: false }));
                })
                .catch(err => {
                    this.setState({
                        editLoading: false
                    });
                });
        };
        this.handleCancelEditModal = () => {
            this.setState({
                visibleEditModal: false
            });
        };
        this.showEditModal = r => {
            this.setState({
                visibleEditModal: true,
                currentData: r
            });
        };
        this.handleOkStatusModal = () => {
            this.setState({
                banLoading: true
            });
            this.switchStatus(this.state.currentId, this.state.currentStatus);
        };
        this.handleCancelStatusModal = () => {
            this.setState({
                visibleStatusModal: false
            });
        };
        this.showStatusModal = r => {
            if (!!r.status) {
                this.setState({
                    visibleStatusModal: true,
                    statusText: 'Do you confirm to ban it?',
                    currentId: r.id,
                    currentStatus: r.status
                });
            } else {
                this.setState({
                    visibleStatusModal: true,
                    statusText: 'Do you confirm to unban it?',
                    currentId: r.id,
                    currentStatus: r.status
                });
            }
        };
        this.deleteData = id => {
            axios
                .post('http://localhost:7001/api/user/delete', {
                    id: id
                })
                .then(response => {
                    this.setState({
                        visibleDeleteModal: false,
                        deleteLoading: false
                    });
                    axios
                        .get('http://localhost:7001/api/user/list')
                        .then(response => this.setState({ data: response.data, loading: false }));
                });
        };
        this.switchStatus = (id, status) => {
            axios
                .post('http://localhost:7001/api/user/update', {
                    id: id,
                    status: 1 - status
                })
                .then(response => {
                    this.setState({
                        visibleStatusModal: false,
                        banLoading: false
                    });
                    axios
                        .get('http://localhost:7001/api/user/list')
                        .then(response => this.setState({ data: response.data, loading: false }));
                });
        };
    }

    componentWillMount() {
        axios
            .get('http://localhost:7001/api/user/list')
            .then(response => this.setState({ data: response.data, loading: false }));
    }

    render() {
        const state = this.state;
        return (
            <HomeLayout>
                <Table {...this.state} columns={this.columns} dataSource={this.state.data} rowKey="id" />
                <div>
                    <Modal
                        title="Edit"
                        visible={this.state.visibleEditModal}
                        onOk={this.handleOkEditModal}
                        confirmLoading={this.state.editLoading}
                        onCancel={this.handleCancelEditModal}
                        cancelText="Cancel"
                        okText="Confirm"
                    >
                        <EditPage onRef={ref => (this.editpage = ref)} exist={this.state.currentData} />
                    </Modal>
                </div>
                <div>
                    <Modal
                        title="Switch Status"
                        visible={this.state.visibleStatusModal}
                        onOk={this.handleOkStatusModal}
                        confirmLoading={this.state.banLoading}
                        onCancel={this.handleCancelStatusModal}
                        cancelText="Cancel"
                        okText="Confirm"
                    >
                        <p>{this.state.statusText}</p>
                    </Modal>
                </div>
                <div>
                    <Modal
                        title="Delete"
                        visible={this.state.visibleDeleteModal}
                        onOk={this.handleOkDeleteModal}
                        confirmLoading={this.state.deleteLoading}
                        onCancel={this.handleCancelDeleteModal}
                        cancelText="Cancel"
                        okText="Confirm"
                    >
                        <p>Do you confirm to delete it?</p>
                    </Modal>
                </div>
            </HomeLayout>
        );
    }
}
