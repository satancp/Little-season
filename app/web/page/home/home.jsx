import React, { Component } from 'react';
import HomeLayout from 'component/homelayout/homelayout.jsx';
import './home.css';
export default class Home extends Component {
    componentDidMount() {
        console.log('----componentDidMount-----');
    }

    render() {
        return (
            <div>
                <HomeLayout>Home Page</HomeLayout>
            </div>
        );
    }
}
