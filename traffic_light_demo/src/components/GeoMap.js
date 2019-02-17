import React from 'react';
import {Map, TileLayer} from 'react-leaflet';
import AntPath from 'react-leaflet-ant-path';


export default class GeoMap extends React.Component {
    constructor(){
        super();
        this.lat = 51.21205;
        this.lng = 4.39717;
        this.zoom = 18;
        this.state = {
            paths: []
        }
    }

    render(){
        const position = [this.lat, this.lng];
        return (
            <Map style={{width:'600px', height: '600px'}} center={position} zoom={this.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <AntPath positions={[[51.2118379,4.3970829],[51.2111054,4.3961904]]}/>
            </Map>
        )
    }
}