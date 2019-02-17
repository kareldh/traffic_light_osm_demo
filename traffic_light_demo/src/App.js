import React, { Component } from 'react';
import './App.css';
import GeoMapContainer from "./components/GeoMapContainer";
import 'leaflet/dist/leaflet.css';

class App extends Component {
  render() {
    return (
      <div>
        <GeoMapContainer/>
      </div>
    );
  }
}

export default App;
