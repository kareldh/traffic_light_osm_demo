import React from 'react';
import {Map, TileLayer} from 'react-leaflet';
import AntPath from 'react-leaflet-ant-path';
import linestringToLatLng from "../utils/linestringToLatLng";


export default class GeoMap extends React.Component {
    constructor(props){
        super();
        this.lat = 51.21205;
        this.lng = 4.39717;
        this.zoom = 18;
        this.state = {
            linestrings: props.linestrings
        }
    }

    componentWillReceiveProps(newProps){
        this.setState({linestrings: newProps.linestrings})
    }

    getAntPaths(){
        let antPaths = [];
        let {linestrings} = this.state;
        if(linestrings){
            let i=0;
            linestrings.departureLanes.forEach(
                (linestring)=>{
                    let positions = linestringToLatLng(linestring);
                    antPaths.push(<AntPath positions={positions} options={{color: "green", reverse: "true"}} key={linestring+i}/>);
                    i++;
                }
            );
            linestrings.arrivalLanes.forEach(
                (linestring)=>{
                    let positions = linestringToLatLng(linestring);
                    antPaths.push(<AntPath positions={positions} options={{color: "blue"}} key={linestring+i}/>);
                    i++;
                }
            );
        }
        return antPaths;
    }

    render(){
        // console.log(this.state.linestrings);
        const position = [this.lat, this.lng];
        let antPaths = this.getAntPaths();
        return (
            <Map style={{width:'600px', height: '600px'}} center={position} zoom={this.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {antPaths}
            </Map>
        )
    }
}