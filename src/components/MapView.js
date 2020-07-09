import React from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import PlayerMarker from './PlayerMarker.js';
import './MapView.css';
import PubNubReact from 'pubnub-react';
import { Redirect } from 'react-router-dom';


export class MapView extends React.Component {

  state = {
    myLocation: {
      lat: 0,
      lng: 0
    },
    targetLocation: {
      lat: 0,
      lng: 0
    },
  }
  target = null;

  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-c72ffc95-6f42-4bdf-8a95-04015fd20d32',
      subscribeKey: 'sub-c-ea26bb44-92b6-11ea-8dc6-429c98eb9bb1'
    });
    this.pubnub.init(this);
  }

  componentDidMount() {
    //ALE'S BRILLIANT IDEA
    if (this.state.targetLocation.lat === 0 && this.state.targetLocation.lng === 0)
      this.props.setModal(true);
    else
      this.props.setModal(false);

    window.onunload = () => {
      this.props.removePlayerFromGame(this.state.user);
      //TODO redirect to another component
      //enable user to get back in the game
    };
    window.onpopstate = () => {
      this.props.removePlayerFromGame(this.state.user);
    };
    // if (this.props.location.state.redirected) {
    //   this.props.setStopCountDown(true);
    // }


    this.pubnub.subscribe({
      channels: ['positionChannel'],
      withPresence: true
    });

    // Listening to 'positionChannel'
    this.pubnub.getMessage('positionChannel', (msg) => {
      if (this.props.huntingPlayer !== null) {
        if (this.props.huntingPlayer.playerId === msg.message.user.playerId) {
          this.setState({
            targetLocation: msg.message.userLocation,
          });
        }
      }
    });
  }

  publishMyLocation = (loc) => {
    //console.log('this.props :>> ', this.state);
    //console.log('loc :>> ', loc);
    this.pubnub.publish({
      message: {
        user: this.props.user,
        userLocation: loc
      },
      channel: 'positionChannel'
    });
  };

  displayToast = (message) => {
    this.props.updateToastMessage(message);
    if (!(this.props.debounceToast)) {
      this.props.openToast();
    }
  };


  componentDidUpdate(prevProps, prevState) {
    if (this.state.targetLocation.lat !== prevState.targetLocation.lat || this.state.targetLocation.lng !== prevState.targetLocation.lng) {
      if (this.state.targetLocation.lat === 0 && this.state.targetLocation.lng === 0)
        this.props.setModal(true);
      else
        this.props.setModal(false);
    }

    // if (this.props.huntingPlayer === null) {
    //   this.props.setModal(true);
    // } else {
    //   this.props.setModal(false);
    // }

    if (this.props.playerInGame !== prevProps.playerInGame) {
      if (!this.props.playerInGame) {
        this.displayToast("You lost!!!");
        this.endGame();
      }
    }
    if (prevProps.huntingPlayer !== this.props.huntingPlayer) console.log('Current props: ', this.props);
  }

  componentWillUnmount() {
    this.props.removePlayerFromGame(this.props.user);
  }

  endGame = () => {
    this.setState({
      redirect: true,
      path: '/lobby'
    });
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
  

  render() {
    if (!this.props.loaded)
      return (
        <div>Loading...</div>
      );

    return (
      <React.Fragment>
        {this.renderRedirect()}
        <Map
          google={this.props.google}
          zoom={14}
          initialCenter={{
            lat: 59.329323,
            lng: 18.068581
          }}

          // For the demo: 
          onClick={(props, map, e) => {
            this.setState({
              targetLocation: {
                lat: e.latLng.lat(),
                lng: e.latLng.lng()
              }
            });
          }}
        >
          <Marker {...this.props}
            ref={element => {
              if (element)
                this.target = element.marker;
            }}
            name={'Target'}
            position={this.state.targetLocation}
          />
          <PlayerMarker
            targetLocation={this.state.targetLocation}
            publishMyLocation={this.publishMyLocation}
            endGame={this.endGame}
            displayToast={this.displayToast}
            removePlayerFromGame={this.props.removePlayerFromGame}
            huntingPlayer={this.props.huntingPlayer}
            playersInGame={this.props.playersInGame}
          />
        </Map>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyD-HO6pALPiY9nrniME6UmHy3P3YUCv2Eg')
})(MapView)
