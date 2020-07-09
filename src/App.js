import React, { Component } from 'react';
import './App.css';
import {
    createFakeLobby,
    setPlayerReadyStatus,
    ListenToPlayersInLobby,
    addPlayerToLobby,
    removePlayerFromLobby,
    removePlayerFromGame,
    addPlayerToNewGame,
    getPlayersInLobby,
    createNewGame,
    stopListeningToLobby,
    ListenToPlayersInGame,
} from "./components/firebase-database.component";
import {
    signIn,
    initFirebaseAuth,
    signOut
} from "./components/firebase-authentication.component";
import Lobby from './components/Lobby.js';
import Home from './components/Home.js';
import MapView from './components/MapView.js';
import { Toast, Modal } from 'react-onsenui';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';


class App extends Component {



    componentWillUnmount() {
        this.pubnub.unsubscribe({
            channels: ['positionChannel']
        });
    }


    state = {
        playersInGame: [],
        playersInLobby: [],
        lobbyPropsUpdate: false,
        toast: {
            open: false,
            timeout: 2500,
            message: ''
        },
        myLocation: {
            lat: 0,
            lng: 0
        },
        targetLocation: {
            lat: 0,
            lng: 0
        },
        user: {},
        redirect: false,
        path: "/",
        huntingPlayer: null,
        modalIsOpen: false,
        // stopCountDown: false,
    };

    authStateObserver = (user) => {
        if (user) { // User is signed in!,
            this.setState({
                user: this.getUserProps(user),
                redirect: true,
                path: '/lobby'
            });
            // console.log({ user }, ' signed in');
        } else { // User is signed out!
            this.setState({
                user: {},
            });
            // console.log({ user }, ' signed out');
        }
    };

    componentDidMount() {
        this.clearState();

        ListenToPlayersInLobby((data) => {
            this.setState({
                playersInLobby: data,
                lobbyPropsUpdate: (!(this.state.lobbyPropsUpdate))
            });
        });

        // the way of Ale, He's so random
        ListenToPlayersInGame((data) => {
            if (this.state.playersInGame.length >= 2 && data.length === 1) {
                // Somebody won!
                this.setState({
                    playersInGame: data,
                    // chasedByPlayer:
                    huntingPlayer: {},
                    gamePropsUpdate: (!(this.state.gamePropsUpdate))
                });

                // if (this.playerInGame(this.state.user.playerId)) {
            }
            if (data.length >= 2) {
                let targetPlayer = data[Math.floor(Math.random() * data.length)];
                while (targetPlayer.playerId === this.state.user.playerId) {
                    targetPlayer = data[Math.floor(Math.random() * data.length)];
                }

                // console.log('Player: ',
                //         this.state.user,
                //         '\nTarget player: ',
                //         {targetPlayer});
                this.setState({
                    playersInGame: data,
                    // chasedByPlayer:
                    huntingPlayer: targetPlayer,
                    gamePropsUpdate: (!(this.state.gamePropsUpdate))
                });
            }
            //console.log('object :>> ', data);
        });

        initFirebaseAuth(this.authStateObserver);
    }

    getUserIndex = (list) => {
        for (let i = 0; i < list.length; i++) {
            const player = list[i];
            if (player.id === this.state.user.id) {
                return i;
            }
        }
    };

    getUserProps = (user) => {
        // console.log('Current user: ', { user });
        return {
            email: user.email,
            playerId: user.uid,
            playerName: this.formatDisplayName(user.displayName),
            imgURL: user.photoURL,
        };
    };

    formatDisplayName = (name) => {
        let maxLength = 8;
        let firstName = this.getFirstName(name);
        if (firstName.length > maxLength) {
            return `${firstName.slice(0, maxLength)}...`;
        } else {
            return firstName;
        }
    };

    getFirstName = (name) => {
        return (name.split(" "))[0];
    };

    playerInLobby = (id) => {
        const allPlayers = this.state.playersInLobby;
        let player;
        for (let i = 0; i < allPlayers.length; i++) {
            player = allPlayers[i];
            if (player.playerId === id) {
                return true;
            }
        }
        return false;
    };

    playerInGame = (id) => {
        const allPlayers = this.state.playersInGame;
        if (allPlayers) {
            let player;
            for (let i = 0; i < allPlayers.length; i++) {
                player = allPlayers[i];
                if (player.playerId === id) {
                    return true;
                }
            }
        }
        return false;
    };


    updateToastMessage = (message) => {
        let toast = this.state.toast;
        toast["message"] = message;
        this.setState({
            toast: toast
        })
    };

    openToast = () => {
        let toast = this.state.toast;
        toast["open"] = true;
        this.setState({
            toast: toast
        });
        setTimeout(() => {
            toast["open"] = false;
            this.setState({
                toast: toast
            });
        }, this.state.toast.timeout)
    };

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect push to={{
                pathname: this.state.path,
                state: {

                }
            }} />
        } else {
            return <React.Fragment />
        }
    };

    // Maybe not needed with the authStateObserver in componentDidMount
    signOut = () => {
        this.setState({
            path: '/'
        });
        removePlayerFromLobby(this.state.user);
        signOut();
    };

    // signIn = () => {
    //     signIn().then(res => {
    //         this.setState({
    //             user: this.getUserProps(res.user),
    //             page: 1,
    //         })
    //     });
    // };

    clearState = () => {
        this.setState({
            huntingPlayer: null,
        })
    };

    setOpenModal = (bool) => {
        this.setState({
            modalIsOpen: bool
        });
    }

    // setStopCountDown = (bool) => {
    //     this.setState({
    //         stopCountDown: bool,
    //     });
    // }

    render() {
        return (
            <div className="App">
                <Router>
                    {this.renderRedirect()}
                    <Route exact render={({ location }) => (
                        <Switch location={location}>
                            <Route exact path={["/lobby"]} render={props => {
                                const user = this.state.user;
                                const userInLobby = this.playerInLobby(user.playerId)
                                return (<Lobby
                                    user={user}
                                    userInLobby={userInLobby}
                                    allPlayers={this.state.playersInLobby}
                                    lobbyPropsUpdate={this.state.lobbyPropsUpdate}
                                    updatePlayerReadyState={setPlayerReadyStatus}
                                    addPlayerToLobbyFunc={addPlayerToLobby}
                                    removePlayerFromLobbyFunc={removePlayerFromLobby}
                                    updateToastMessage={this.updateToastMessage}
                                    openToast={this.openToast}
                                    debounceToast={this.state.toast.open}
                                    signOut={this.signOut}
                                    addPlayerToNewGame={addPlayerToNewGame}
                                    // stopCountDown={this.state.stopCountDown}
                                    // setStopCountDown={this.setStopCountDown}
                                    location={props.location}
                                    history={props.history}
                                />);
                            }} />
                            <Route exact path={["/map"]} render={props => {
                                return (<MapView
                                    user={this.state.user}
                                    playersInGame={this.state.playersInGame}
                                    huntingPlayer={this.state.huntingPlayer}
                                    chasedByPlayer={this.state.chasedByPlayer}
                                    publishMyLocation={this.publishMyLocation}
                                    targetLocation={this.state.targetLocation}
                                    openToast={this.openToast}
                                    updateToastMessage={this.updateToastMessage}
                                    debounceToast={this.state.toast.open}
                                    playerInGame={this.playerInGame(this.state.user.playerId)}
                                    removePlayerFromGame={removePlayerFromGame}
                                    setModal={this.setOpenModal}
                                    renderRedirect={this.renderRedirect}
                                    endGame={this.endGame}
                                    // setStopCountDown={this.setStopCountDown}
                                    location={props.location}
                                    history={props.history}
                                />);
                            }} />

                            <Route exact path={["/", "/index.html", "/*"]}>
                                <Home
                                    signIn={signIn}
                                    content={
                                        <React.Fragment>
                                        </React.Fragment>
                                    }
                                />
                            </Route>
                        </Switch>
                    )} />
                </Router>
                <Modal isOpen={this.state.modalIsOpen}>
                    This game is loading
                </Modal>
                <Toast
                    isOpen={this.state.toast.open}
                    animation={"fall"}
                    animationOptions={{ duration: 0.2, delay: 0.4, timing: 'ease-in' }}
                >
                    <span>{this.state.toast.message}</span>
                </Toast>
            </div>
        );
    }
}

export default App;
