import React, {Component} from 'react';
import './Player.css';
import UserSVG from './svgs/User.js'



class Player extends Component{

    render() {
        const hasImgURL = (this.props.player.imgURL !== "" && this.props.player.imgURL !== undefined && this.props.player.imgURL !== null);
        return (
            <div
                className={`player-component ${this.props.className} ${'player-component-show'}`}
                key={this.props.id}
                style={{...this.props.style, color: 'white'}}
            >
                <div className={'content'}>
                    {(hasImgURL) ?
                        <img
                            className={'player-img'}
                            src={`${this.props.player.imgURL}`}
                        />:
                        <UserSVG
                            className ={'player-img'}
                        />
                    }
                    <div className='player-name'>
                        {this.props.player.playerName}
                    </div>
                </div>


            </div>
        );
    }
}

export default Player;
