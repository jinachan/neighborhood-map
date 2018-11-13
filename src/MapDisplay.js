import React, { Component } from 'react';
import { Map, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
const MAP_KEY = "AIzaSyDooJxFSbNJe1lpgeube4K4PkIXeWe8ssM";

class MapDisplay extends Component {
    state = {
        map: null,
        markers: [],
        markerProps: [],
        activeMarker: null,
        activeMarkerProps: null,
        isInfoWindowShowing: false
    };

    componentDidMount() {

    }

    closeInfoWindow = () => {
        // Disable any active marker animation
        this.state.activeMarker && (this.state.activeMarker.setAnimation(null));
        this.setState({isInfoWindowShowing: false, activeMarker: null, activeMarkerProps: null});
    }

    onMarkerClick = (props, marker, event) => {
        // Close any infowindow that's open
        this.closeInfoWindow();

        // Set the state to have the marker info show
        this.setState({isInfoWindowShowing: true, activeMarker: marker, activeMarkerProps: props});
    }

    updateMarkers = (locations) => {
        // If all the locations have been filtered, then don't do anything
        if (!locations) {
            return;
        }

        // For any existing markers, remove them from the map
        this.state.markers.forEach(marker => marker.setMap(null));

        // Iterate over the locations and add the markers to the map
        let markerProps = [];
        let markers = locations.map((location, index) => {
            let mProps = {
                key: index,
                index,
                name: location.name,
                position: location.pos,
                url: location.url
            };
            markerProps.push(mProps);

            let animation = this.props.google.maps.Animation.DROP;
            let marker = new this.props.google.maps.Marker({
                position: location.pos,
                map: this.state.map,
                animation
            });
            marker.addListener('click', () => {
                this.onMarkerClick(mProps, marker, null);
            });
            return marker;
        })

        this.setState({markers, markerProps});
    }

    mapReady = (props, map) => {
        this.setState({map});
        this.updateMarkers(this.props.locations);
    }

    render() {
        const mapCenter = {
            lat: this.props.lat,
            lng: this.props.lng
        };

        const mapStyle = {
            width: '100%',
            height: '100%'
        };

        let amProps = this.state.activeMarkerProps;

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                style={mapStyle}
                google={this.props.google}
                zoom={this.props.zoom}
                initialCenter={mapCenter}
                onClick={this.closeInfoWindow}
            >
                <InfoWindow 
                    marker={this.state.activeMarker}
                    visible={this.state.isInfoWindowShowing}
                    onClose={this.closeInfoWindow}
                >
                    <div>
                        <h3>{amProps && amProps.name}</h3>
                        {amProps && amProps.url
                        ? (
                            <a href={amProps.url}>Website</a>
                        )
                        : ""}
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({apiKey: MAP_KEY})(MapDisplay);