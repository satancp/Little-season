import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import React, { Component } from 'react';
import 'antd/dist/antd.css';
import './homelayout.css';
const { Header, Content, Footer, Sider } = Layout;

export default class HomeLayout extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: false,
            mode: 'inline'
        };
        this.toggle = () => {
            this.setState({
                collapsed: !this.state.collapsed
            });
        };
    }

    render() {
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['user']}>
                        <Menu.SubMenu
                            key="user"
                            title={
                                <span>
                                    <Icon type="user" />
                                    <span>User</span>
                                </span>
                            }
                        >
                            <Menu.Item key="user-list">
                                <a href="/user/list">
                                    <Icon type="api" />User List
                                </a>
                            </Menu.Item>
                            <Menu.Item key="user-add">
                                <a href="/user/add">
                                    <Icon type="user-add" />Add New User
                                </a>
                            </Menu.Item>
                        </Menu.SubMenu>
                        <Menu.SubMenu
                            key="resource"
                            title={
                                <span>
                                    <Icon type="folder" />
                                    <span>Resource</span>
                                </span>
                            }
                        >
                            <Menu.Item key="resource-list">
                                <a href="/resource/list">
                                    <Icon type="switcher" />Resource List
                                </a>
                            </Menu.Item>
                            <Menu.Item key="resource-add">
                                <a href="/resource/add">
                                    <Icon type="folder-add" />Add New Resource
                                </a>
                            </Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#000', padding: 0 }}>
                        <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '1.4em' }}>
                            <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                                style={{ cursor: 'pointer' }}
                            />
                        </span>
                        <span style={{ color: '#fff', paddingLeft: '2%', fontSize: '1.4em' }}>
							Dashboard For Sharing
                        </span>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <div style={{ padding: 24, background: '#fff', minHeight: 780 }}>{this.props.children}</div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Dashboard For Sharing ©2018 Created by Chris</Footer>
                </Layout>
            </Layout>
        );
    }
}
