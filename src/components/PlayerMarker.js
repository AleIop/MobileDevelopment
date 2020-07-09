import React from 'react';
import { Marker } from 'google-maps-react';
import getDistance from 'geolib/es/getDistance';
import mixColors from '../utils';
import './MapView.css';

const COLD_COLOR = 'hsl(60,100%,100%)';
const WARM_COLOR = 'hsl(0,100%,50%)';
const COLD_DISTANCE = 5000;
const WARM_DISTANCE = 20;
var interval;

export class PlayerMarker extends React.Component {
  props = {
    targetLocation: {}
  };

  state = {
    location: {}
  };

  updateLocation(loc) {
    this.setState({
      location: {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude
      }
    });
    this.props.map.panTo({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude
    });

    console.log('PlayerMarker state: ', this.state,
      '\nPlayerMarker props: ', this.props);
    //this.onLocationUpdate(loc);
  }

  onErrorGettingLocation(err) {
    console.log('Unable to get location', err);
  }

  project(loc) {
    let google = this.props.google;

    let sinY = Math.sin(loc.lat * Math.PI / 180);
    sinY = Math.min(Math.max(sinY, -0.9999), 0.9999);

    return new google.maps.Point(
      256 * (0.5 + loc.lng / 360),
      256 * (0.5 - Math.log((1 + sinY) / (1 - sinY)) / (4 * Math.PI))
    );
  }

  get directionToTarget() {
    let pos = this.project(this.state.location);
    let targetPos = this.project(this.props.targetLocation);
    return Math.atan2(targetPos.y - pos.y, targetPos.x - pos.x) * 180 / Math.PI;
  }

  get distanceToTarget() {
    return getDistance({
      latitude: '' + this.state.location.lat,
      longitude: '' + this.state.location.lng
    }, {
      latitude: '' + this.props.targetLocation.lat,
      longitude: '' + this.props.targetLocation.lng
    });
  }

  get proximityColor() {
    let d = Math.max(Math.min(this.distanceToTarget, COLD_DISTANCE), WARM_DISTANCE);
    let t = Math.sqrt((d - WARM_DISTANCE) / (COLD_DISTANCE - WARM_DISTANCE));
    return mixColors(WARM_COLOR, COLD_COLOR, t);
  }

  componentDidMount() {
    let gl = navigator.geolocation;
    const glOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    };
    gl.watchPosition(
      this.updateLocation.bind(this),
      this.onErrorGettingLocation.bind(this),
      glOptions
    );

    interval = setInterval(() => {
      if (this.state.location.lat) this.props.publishMyLocation(this.state.location);
      console.log('My location is: ', this.state.location);
    }, 10000);
  }

  componentWillUnmount() {
    clearInterval(interval);
  }

  tagTarget = () => {
    this.props.removePlayerFromGame(this.props.huntingPlayer);
    if (this.props.playersInGame.length === 2) {
      this.props.displayToast("Congratulation! You Won!");
      this.props.endGame();
    }
  };

  render() {
    let google = this.props.google;
    if (this.distanceToTarget > WARM_DISTANCE)
      return (
        <Marker {...this.props}
          name={'Player'}
          position={this.state.location}
          icon={{
            path: 'M42,21.002L16.043,0v11.55H0v18.9h16.043V42L42,21.002L42,21.002z',
            anchor: new google.maps.Point(21, 21),
            scale: 1.5,
            strokeWeight: 4,
            fillColor: this.proximityColor,
            fillOpacity: 1,
            rotation: this.directionToTarget
          }}
        />
      );
    else
      return (
        <Marker {...this.props}
          name={'Player'}
          position={this.state.location}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 50,
            strokeWeight: 6,
            fillColor: this.proximityColor,
            fillOpacity: 1,
          }}
          label={{
            text: 'TAG',
            fontSize: '36px',
            fontWeight: 'bold'
          }}
          onClick={this.tagTarget}
        />
      );
  }
}

export default PlayerMarker;
