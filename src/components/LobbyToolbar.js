import React, {Component} from 'react';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import {Toolbar, Button as OnsButton} from 'react-onsenui';
import './OnsToolbar.css';
import './Player.css';
import UserSVG from './svgs/User.js'

class LobbyToolbar extends Component {

    getProfileJSX = () => {
        const hasImgURL = (this.props.user.imgURL !== "" && this.props.user.imgURL !== undefined && this.props.user.imgURL !== null);

        if(hasImgURL){
            return (
                <div>
                    <img
                        src={this.props.user.imgURL}
                        className={'player-img'}
                    />
                </div>
            )
        }else{
            return (
                <div>
                    <UserSVG
                        className={'player-img'}
                    />
                </div>

            )
        }

    };

    render() {
        return(
            <Toolbar
                style={{
                    backgroundColor: '#333',
                    height: 104,
                    backgroundSize: 0
                }}
            >
                <div
                     style={{
                         // borderWidth: 2,
                         // borderStyle: 'solid',
                         // borderColor: 'hotpink',
                         display: 'flex',
                         flexDirection: 'row',
                         alignItems: 'center',
                         justifyContent: 'space-between',
                         color: 'white',
                         position: 'absolute',
                         left: 18,
                         top: 14
                     }}
                >
                        {this.getProfileJSX()}
                        <div className='player-name'>
                            {this.props.user.playerName}
                        </div>
                </div>
                <div
                    style={{
                        position: 'absolute',
                        right: 18,
                        top: 18
                    }}
                >
                    <OnsButton onClick={this.props.signOut}>
                        Sign out
                    </OnsButton>
                </div>
            </Toolbar>
        )
    }
}

export default LobbyToolbar;
