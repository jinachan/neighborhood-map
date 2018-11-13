import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
const MAP_KEY = "AIzaSyDooJxFSbNJe1lpgeube4K4PkIXeWe8ssM";

class MapDisplay extends Component {
    state = {
        map: null
    };

    componentDidMount() {

    }

    mapReady = (props, map) => {
        this.setState({map});
    }

    render() {
        const mapCenter = {
            lat: this.props.lat,
            lng: this.props.lng
        };
        
        const mapStyles = {
            width: '100%',
            height: '100%'
        };

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                style={mapStyles}
                google={this.props.google}
                zoom={this.props.zoom}
                initialCenter={mapCenter}
                onClick={this.closeInfoWindow}
            />
        )
    }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(MapDisplay);