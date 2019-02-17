import React from 'react';
import GeoMap from "./GeoMap";
import {download, getSignalGroups, parseAndStoreQuads, getDepartureLanes, getLaneDefs, getGreenStates, getStateDefs, getLanesForSignalGroup} from "../data/api";
import {DATASET_URL} from "../data/const";

export default class GeoMapContainer extends React.Component {
    constructor(){
        super();
        this.doc = null; //niet gebruikt
        this.store = null; //niet gebruikt en niet geupdated
        this.signalgroups = null; //niet gebruikt
        this.laneDefs = null;
        this.departureLanes = null;
        this.stateDefs = null;
        this.lanesForSignalgroups = null;

        this.state = {
            greenStates: null
        };
        this.init();
    }

    init(){
        download(DATASET_URL).then(
            doc => {
                this.doc = doc;
                parseAndStoreQuads(doc).then(
                    store => {
                        this.store = store;
                        getSignalGroups(store).then(sg => this.signalgroups = sg);
                        getLaneDefs(store).then(lanes => this.laneDefs = lanes);
                        getStateDefs(store).then(states => this.stateDefs = states);
                        this.departureLanes = getDepartureLanes(store);
                        this.lanesForSignalgroups = getLanesForSignalGroup(store);
                    });
            }
        );
    }

    componentDidMount(){
        this.timer = setInterval(()=>this.tick(),2000);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    tick(){
        //werk de huidige store bij met de nieuwe lichten die groen zijn

        //nog nodig eerst terug latest op te vragen en uit de opgevraagde store de greenstates te bepalen
        getGreenStates(this.store).then(states => this.setState({greenStates: states}));
    }

    getGreenLightLineStrings(greenStates){ //wip
        if(greenStates){
            greenStates.forEach(
                (state) => {
                    console.log("state",state);
                    let signalgroup = this.stateDefs[state];
                    console.log("signalgroup",signalgroup);
                    // let greenDepartureLanes = this.lanesForSignalgroups[signalgroup].departureLanes;
                    // let greenArrivalLanes = this.lanesForSignalgroups[signalgroup].arrivalLanes;
                    // let greenDepartureLineStrings = greenDepartureLanes.forEach((lane)=>{ return this.laneDefs[lane]});
                    // let greenArrivalLineStrings = greenArrivalLanes.forEach((lane)=>{ return this.laneDefs[lane]});
                    // console.log(greenDepartureLineStrings);
                    // console.log(greenArrivalLineStrings);
                }
            );
        }
    }

    render(){ //wip
        //console.log(this.state);
        this.getGreenLightLineStrings(this.state.greenStates);
        // console.log("doc: ", this.doc);
        // console.log("store: ", this.store);
        // console.log("signalgroups: ", this.signalgroups);
        // console.log("laneDefs: ", this.laneDefs);
        // console.log("departureLanes: ",this.departureLanes);
        // console.log("stateDefs: ", this.stateDefs);
        console.log("lanesForSignalGroups: ", this.lanesForSignalgroups);
        return (
            <div>
                <GeoMap/>
            </div>
        )
    }
}