import React, { Component } from 'react';
import { Map, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import NoMap from './NoMap';

// API keys
const MAP_KEY = "AIzaSyDooJxFSbNJe1lpgeube4K4PkIXeWe8ssM";
const FS_CLIENT = "I1DEPPPUXR4APAUHVOWBISJRFRMERQLQ5W2JSSAYNWBBYIWF";
const FS_SECRET = "PEDUHODOHQPUC3NSOM3P3JCRXCH5DNZLMZDEJPHZI44OOOGM";
const FS_VERSION = "20180323";


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

    componentWillReceiveProps = (props) => {
        console.log("Selected index is " + props.selectedIndex);

        // Only drop the markers the first time
        this.setState({firstDrop: false});

        // Change in the number of locations --> update markers
        if (this.state.markers.length !== props.locations.length) {
            console.log("Number of markers has changed");
            this.closeInfoWindow();
            this.updateMarkers(props.locations);
            this.setState({activeMarker: null});
            return;
        }

        // Selected item is not the same as the active marker, so close infowindow
        if (!props.selectedIndex || (this.state.activeMarker &&
            (this.state.markers[props.selectedIndex] !== this.state.activeMarker))) {
                console.log("Selected item differs from active marker");
                this.closeInfoWindow();
            }

        // Make sure there's a selected index
        if (props.selectedIndex === null || typeof(props.selectedIndex) === "undefined") {
            console.log("There's no selected index");
            return;
        }

        // Treat the marker as clicked
        console.log("Treating the marker as clicked");
        this.onMarkerClick(this.state.markerProps[props.selectedIndex], this.state.markers[props.selectedIndex]);
    }

    closeInfoWindow = () => {
        // Disable any active marker animation
        this.state.activeMarker && (this.state.activeMarker.setAnimation(null));
        this.setState({isInfoWindowShowing: false, activeMarker: null, activeMarkerProps: null});
    }

    getBusinessInfo = (props, data) => {
        // Look for matching restaurant data in FourSquare
        return data.response.venues.filter(item => item.name.includes(props.name) || props.name.includes(item.name));
    }

    onMarkerClick = (props, marker, event) => {
        // Close any infowindow that's open
        this.closeInfoWindow();

        // Fetch the FourSquare data for the selected restaurant
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=100&ll=${props.position.lat},${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        // Create props for the active marker
        let activeMarkerProps;
        fetch(request)
            .then(response => response.json())
            .then(result => {
                // Get just the business reference for the restaurant we want
                let restaurant = this.getBusinessInfo(props, result);
                activeMarkerProps = {
                    ...props,
                    foursquare: restaurant[0]
                };

                if (activeMarkerProps.foursquare) {
                    // If there is FourSquare data, get the list of images for this restaurant
                    let url=`https://api.foursquare.com/v2/venues/${restaurant[0].id}/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            activeMarkerProps = {
                                ...activeMarkerProps,
                                images: result.response.photos
                            };
                            if (this.state.activeMarker)
                                this.state.activeMarker.setAnimation(null);
                            marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                            this.setState({isInfoWindowShowing: true, activeMarker: marker, activeMarkerProps});
                        })
                    } else {
                        // Finish setting state with the data we have
                        marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
                        this.setState({isInfoWindowShowing: true, activeMarker: marker, activeMarkerProps});
                    }
            })
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

            let animation = this.state.firstDrop ? this.props.google.maps.Animation.DROP : null;
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
                        {amProps && amProps.images
                        ? (
                            <div> <img 
                                alt={amProps.name + " photo"}
                                src={amProps.images.items[0].prefix + "100x100" + amProps.images.items[0].suffix}/>
                                <p>Image from Foursqure</p>
                            </div>
                        )
                        : ""
                        }
                    </div>
                </InfoWindow>
            </Map>
        )
    }
}

export default GoogleApiWrapper({apiKey: MAP_KEY, LoadingContainer:NoMap})(MapDisplay);