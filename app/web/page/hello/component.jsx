import React, { Component } from 'react';
import HomeLayout from 'component/homelayout/homelayout.jsx';

export default class Hello extends Component {
    componentDidMount() {
        console.log('----componentDidMount-----');
    }
    render() {
        return <HomeLayout />;
    }
}
