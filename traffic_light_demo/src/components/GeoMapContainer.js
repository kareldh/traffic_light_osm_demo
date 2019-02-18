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
        this.departureLanes = null; //niet gebruikt
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
                        this.store = store; //niet meer nodig
                        getSignalGroups(store).then(sg => this.signalgroups = sg);  //niet meer nodig
                        this.departureLanes = getDepartureLanes(store); //niet meer nodig
                        Promise.all([getLaneDefs(store).then(lanes => this.laneDefs = lanes),getStateDefs(store).then(states => this.stateDefs = states),getLanesForSignalGroup(store).then((lanesForGroups)=>{this.lanesForSignalgroups = lanesForGroups})]).then(
                            ()=> {getGreenStates(store).then(states => this.setState({greenStates: states}));}
                        )
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
        //nodig eerst terug latest op te vragen en uit de opgevraagde store de greenstates te bepalen
        download(DATASET_URL).then(
            doc => {
                parseAndStoreQuads(doc).then(
                    store => {
                        getGreenStates(store).then(states => this.setState({greenStates: states}));
                    }
                );
            }
        );
    }

    getGreenLightLineStrings(greenStates){
        let greenLightLineStrings = {departureLanes: [], arrivalLanes: []};
        if(greenStates){
            greenStates.forEach(
                (state) => {
                    // console.log("state",state);
                    let signalgroup = this.stateDefs[state];
                    // console.log("signalgroup",signalgroup,"lanesForSignalGroups: ",this.lanesForSignalgroups);
                    // console.log(signalgroup,this.lanesForSignalgroups[signalgroup]);
                    if(this.lanesForSignalgroups[signalgroup]){
                        let greenDepartureLanes = this.lanesForSignalgroups[signalgroup].departureLanes;
                        let greenArrivalLanes = this.lanesForSignalgroups[signalgroup].arrivalLanes;
                        // let greenDepartureLineStrings = [];
                        // let greenArrivalLineStrings = [];
                        // greenDepartureLanes.forEach((lane)=>{ if(this.laneDefs[lane]) greenDepartureLineStrings.push(this.laneDefs[lane])});
                        // greenArrivalLanes.forEach((lane)=>{ if(this.laneDefs[lane]) greenArrivalLineStrings.push(this.laneDefs[lane])});

                        greenDepartureLanes.forEach((lane)=>{ if(this.laneDefs[lane] && !greenLightLineStrings.departureLanes.includes(this.laneDefs[lane])) greenLightLineStrings.departureLanes.push(this.laneDefs[lane])});
                        greenArrivalLanes.forEach((lane)=>{ if(this.laneDefs[lane] && !greenLightLineStrings.arrivalLanes.includes(this.laneDefs[lane])) greenLightLineStrings.arrivalLanes.push(this.laneDefs[lane])});

                        // console.log(greenDepartureLanes,greenArrivalLanes);
                        // console.log(greenDepartureLineStrings);
                        // console.log(greenArrivalLineStrings);
                    }
                }
            );
        }
        return greenLightLineStrings;
    }

    render(){
        //console.log(this.state);
        let greenLightLineStrings = this.getGreenLightLineStrings(this.state.greenStates);
        // console.log(greenLichtLineStrings);
        // console.log("doc: ", this.doc);
        // console.log("store: ", this.store);
        // console.log("signalgroups: ", this.signalgroups);
        // console.log("laneDefs: ", this.laneDefs);
        // console.log("departureLanes: ",this.departureLanes);
        // console.log("stateDefs: ", this.stateDefs);
        // console.log("lanesForSignalGroups: ", this.lanesForSignalgroups);
        return (
            <div>
                <GeoMap linestrings={greenLightLineStrings}/>
            </div>
        )
    }
}