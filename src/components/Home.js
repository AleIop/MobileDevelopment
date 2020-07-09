import React, {Component} from 'react';
import './Home.css';
import {Page as OnsPage, Button as OnsButton} from 'react-onsenui';
import HomeToolbar from './HomeToolbar'


class Home extends Component{
    render() {
        return (
            <OnsPage className={'home-component'}>
                <div className={'home-content'}>
                    <div className={'home-title'}>
                        <h1>CATCH <span className={'accent'}>ME</span></h1>
                        <h2>IF YOU CAN</h2>
                    </div>
                    <OnsButton onClick={this.props.signIn}>
                        <div className={'button-caption'}>
                            Sign in to play!
                        </div>
                    </OnsButton>
                </div>
            </OnsPage>
        );
    }
}

export default Home;
