import React, {Component} from 'react';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import {Toolbar} from 'react-onsenui';
import './OnsToolbar.css';


class HomeToolbar extends Component {

    render() {
        return(
            <Toolbar
                style={{
                    backgroundColor: '#c00',
                    height: 104,
                    backgroundSize: 0,
                }}
            >
                <div className="center"
                     style={{
                         // borderWidth: 2,
                         // borderStyle: 'solid',
                         // borderColor: 'black',
                         display: 'flex',
                         flexDirection: 'row',
                         flexWrap: 'wrap',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: 40
                     }}
                >
                    {this.props.title}
                </div>
                <div className="right">
                    <button
                        className={'sign-out-btn'}
                        onClick={this.props.signIn}
                    >
                        Sign in
                    </button>
                </div>
            </Toolbar>
        )
    }
}

export default HomeToolbar;
