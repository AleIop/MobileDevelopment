import React, { Component } from 'react';
import './Lobby.css';
import Player from './Player.js';
import { Page as OnsPage } from 'react-onsenui';
import LobbyToolbar from './LobbyToolbar'
import { Redirect } from 'react-router-dom';

const COUNT_DOWN = 10;
class Lobby extends Component {
    countDown = COUNT_DOWN;
    countDownInterval;

    state = {
        redirect: false,
    }

    componentWillUnmount() {
    }

    startCountDown() {
        const decrementSeconds = 5;
        this.countDownInterval = setInterval(() => {
            if (this.countDown <= 0) {
                this.props.addPlayerToNewGame(this.props.user, () => {
                });
                this.setState({
                    redirect: true,
                });
                this.displayToast("Game is starting!");
            } else {
                this.displayToast(this.countDown + " seconds to start of the game");
            }
            this.countDown = this.countDown - decrementSeconds;
        }, decrementSeconds * 1000);
        // }
    }

    stopCountDownNow() {
        if (this.countDownInterval) {
            // stop the countdown if too few players
            clearInterval(this.countDownInterval);
            this.countDownInterval = null;
            this.countDown = COUNT_DOWN;
        }
    }

    componentDidMount() {
        // this.props.setStopCountDown(false);
    }

    componentDidUpdate(prevProps) {
        //console.log('this.state.allPlayers :>> ', this.props.allPlayers);

        if (prevProps.allPlayers.length !== this.props.allPlayers.length) { // number of players in the lobby changed
            if (this.props.allPlayers.length >= 2 && this.props.userInLobby) {
                console.log('2 players or more');
                if (!this.countDownInterval) {
                    this.startCountDown();
                }
            }
        }

        // if (this.props.stopCountDown !== prevProps.stopCountDown) {
        //     if (this.props.stopCountDown) {
        //         this.stopCountDownNow();
        //     }
        // }
    }

    displayToast = (message) => {
        this.props.updateToastMessage(message);
        if (!(this.props.debounceToast)) {
            this.props.openToast();
        }
    };

    toggleReady = () => {

        if (!this.props.userInLobby) {
            // console.log('this.props.userInLobby :>> ', this.props.userInLobby);
            this.props.addPlayerToLobbyFunc(this.props.user);
            this.displayToast("You joined the current game session");
        } else {
            // console.log('this.props.userInLobby :>> ', this.props.userInLobby);
            this.props.removePlayerFromLobbyFunc(this.props.user);
            this.displayToast("You exited the current game session");
        }
    };

    renderRedirect = () => {

        if (this.state.redirect) {
            this.stopCountDownNow();
            return <Redirect push to={{
                pathname: '/map',
                state: {
                    redirected: true
                }
            }} />
        } else {
            return <React.Fragment />
        }
    };

    render() {

        const allPlayers = this.props.allPlayers;
        return (
            <React.Fragment>
                {this.renderRedirect()}
                <OnsPage
                    className={'lobby-component'}
                    renderToolbar={() => {
                        return (
                            <LobbyToolbar
                                title={'Lobby'}
                                user={this.props.user}
                                signOut={this.props.signOut}
                            />)
                    }}
                    style={{
                        backgroundColor: 'red',
                        backgroundSize: 0,

                    }}
                >
                    <div
                        style={{
                            marginTop: 70,
                            marginBottom: 20
                        }}>

                    </div>
                    {allPlayers.map((player) => {

                        return (
                            <Player
                                className="player-item"
                                key={player.playerId}
                                id={player.playerId}
                                style={{
                                    marginTop: 20,

                                }}
                                player={player} />)
                    })}
                    <div>
                        <button
                            className={`lobby-btn ${(this.props.userInLobby) ? `lobby-exit-btn` : `lobby-join-btn`}`}
                            onClick={this.toggleReady}
                        />
                    </div>
                </OnsPage>
            </React.Fragment>
        );
    }
}

export default Lobby;
