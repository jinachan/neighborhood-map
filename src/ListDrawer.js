import React, { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';

class ListDrawer extends Component {
    state = {
        isOpen: false,
        query: ""
    }

    styles = {
        list: {
            width: "250px",
            padding: "0px 15px 0px"
        },
        noBullets: {
            listStyleType: "none",
            padding: 0
        },
        fullList: {
            width: 'auto'
        },
        listItem: {
            marginBottom: "15px"
        },
        listLink: {
            background: "transparent",
            border: "none",
            color: "black"
        },
        filterEntry: {
            border: "1px solid gray",
            padding: "3px",
            margin: "30px 0px 10px",
            width: "100%"
        },
        clearButton: {
            marginLeft: 5,
            marginRight: 10,
            background: "white",
            padding: 10
          }
    };

    updateQuery = (newQuery) => {
        // Save the new query string in state and pass it back up the call tree
        this.setState({ query: newQuery });
        this.props.filterLocations(newQuery);
    }

    render() {
        return(
            <div>
                <Drawer open={this.props.isOpen} onClose={this.props.toggleDrawer}>
                    <div style={this.styles.list}>
                        <input 
                            style={this.styles.filterEntry}
                            type="text"
                            placeholder="Filter by eatery name"
                            name="filter"
                            onChange={e => this.updateQuery(e.target.value)}
                            value={this.state.query}
                        />
                        <button onClick={e => this.updateQuery('')} style={this.styles.clearButton}>
                            Show all
                        </button>
                        <ul style={this.styles.noBullets}>
                            {this.props.locations &&
                                this.props.locations.map((location, index) => {
                                    return (
                                        <li style={this.styles.listItem} key={index}>
                                            <button style={this.styles.listLink} key={index} onClick={e => this.props.clickListItem(index)}>{location.name}</button>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default ListDrawer;