import React, { Component } from 'react';
import './App.css';
import GeoMapContainer from "./components/GeoMapContainer";
import 'leaflet/dist/leaflet.css';

class App extends Component {
  render() {
    return (
      <div>
        <GeoMapContainer/>
        <div>
            <p>Departure lanes are drawn in green. Arrival lanes are drawn in blue.</p>
            <p> There is no distinction made between which arrival lanes can be reached from which departure lanes.</p>
        </div>
      </div>
    );
  }
}

export default App;
