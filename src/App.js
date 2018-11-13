import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './MapDisplay';

class App extends Component {
  state = {
    lat: 47.62557,
    lng: -122.334388,
    zoom: 13,
    all: locations
  };

  render() {
    return (
      <div className="App">
        <div>
          <h1>Happy Tummy Map for Seattle, WA</h1>
        </div>
        
        <MapDisplay
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
          locations={this.state.all}
        />
      </div>
    );
  }
}

export default App;
