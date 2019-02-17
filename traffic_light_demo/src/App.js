import React, { Component } from 'react';
import './App.css';
import GeoMap from "./components/GeoMap";
import 'leaflet/dist/leaflet.css';

class App extends Component {
  render() {
    return (
      <div>
        <GeoMap/>
      </div>
    );
  }
}

export default App;
