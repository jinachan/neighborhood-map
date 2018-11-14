import React, { Component } from 'react';
import './App.css';
import locations from './data/locations.json';
import MapDisplay from './MapDisplay';
import ListDrawer from './ListDrawer';

/*
 * Credit: App design based on Doug Brown's Udacity walkthrough
 * Source: https://youtu.be/NVAVLCJwAAo
 */

class App extends Component {
  state = {
    lat: 47.62557,
    lng: -122.334388,
    zoom: 13,
    all: locations,
    filtered: null,
    isOpen: false
  };

  styles = {
    menuButton: {
      marginLeft: 10,
      marginRight: 20,
      position: "absolute",
      left: 10,
      top: 20,
      background: "white",
      padding: 10
    },
    hide: {
      display: "none"
    },
    header: {
      marginTop: "0"
    }
  };

  componentDidMount = () => {
    this.setState({
      ...this.state,
      filtered: this.filterLocations(this.state.all, "")
    });
  }

  toggleDrawer = () => {
    // Toggle whether the drawer is shown
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  updateQuery = (query) => {
    // Update the query value and filter list of locations
    this.setState({
      ...this.state,
      selectedIndex: null,
      filtered: this.filterLocations(this.state.all, query)
    });
  }

  filterLocations = (locations, query) => {
    return locations.filter(location => location.name.toLowerCase().includes(query.toLowerCase()));
  }

  render() {
    return (
      <div className="App">
        <div>
          <button onClick={this.toggleDrawer} style={this.styles.menuButton}>
            <i className="fa fa-bars"></i>
          </button>
          <h1>Happy Tummy Map for Seattle, WA</h1>
        </div>
        
        <MapDisplay
          lat={this.state.lat}
          lng={this.state.lng}
          zoom={this.state.zoom}
          locations={this.state.filtered}
        />
        <ListDrawer 
          locations={this.state.filtered}
          isOpen={this.state.isOpen}
          toggleDrawer={this.toggleDrawer}
          filterLocations={this.updateQuery}
        />
      </div>
    );
  }
}

export default App;
