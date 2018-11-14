import React, { Component } from 'react';

class NoMap extends Component {
    state = {
        isShowing: false,
        timeout: null
    }

    componentDidMount = () => {
        // Set a one-second timeout
        let timeout = window.setTimeout(this.showMessage, 1000);
        this.setState({timeout});
    }

    componentWillUnmount = () => {
        // Clean up so we don't cause a resource leak
        window.clearTimeout(this.state.timeout);
    }

    showMessage = () => {
        this.setState({isShowing: true});
    }

    render() {
        return (
            <div>
                {this.state.isShowing
                    ? (
                        <div>
                            <h1>Sorry, we couldn't load the map</h1>
                            <p>There's been an error. We can't load the map right now.</p>
                        </div>
                    )
                    : (<div><h1>Loading</h1></div>)
                }
            </div>
        );
    }
}

export default NoMap;