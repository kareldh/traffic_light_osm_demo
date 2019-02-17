import React from 'react';
import {Map, TileLayer, Marker, Popup} from 'react-leaflet';

export default class GeoMap extends React.Component {
    constructor(){
        super();
        this.lat = 51.21205;
        this.lon = 4.39717;
        this.zoom = 19;
    }

    render(){
        const position = [this.lat, this.lon];
        return (
            <Map style={{width:'600px', height: '600px'}} center={position} zoom={this.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>
        )
    }
}