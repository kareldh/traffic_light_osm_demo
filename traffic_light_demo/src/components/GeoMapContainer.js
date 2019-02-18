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
        this.stateDefs = null; //niet meer nodig
        this.lanesForSignalgroups = null;

        this.state = {
            greenLightLineStrings: null
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
                        let stateDefs = {};
                        let greenStates = [];
                        Promise.all([
                            getLaneDefs(store).then(lanes => this.laneDefs = lanes),
                            getLanesForSignalGroup(store).then((lanesForGroups)=>{this.lanesForSignalgroups = lanesForGroups}),
                            getStateDefs(store).then(defs => stateDefs = defs),
                            getGreenStates(store).then(states => greenStates = states)
                        ]).then(
                            ()=> {this.setState({greenLightLineStrings: this.getGreenLightLineStrings(greenStates,stateDefs)})}
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
                        getStateDefs(store).then(states => {
                            getGreenStates(store).then(greenStates => this.setState({greenLightLineStrings: this.getGreenLightLineStrings(greenStates,states)}));
                        });
                    }
                );
            }
        );
    }

    /*
    Be careful, all arrival lanes are taken together in an array, but not every arrival lane can be reached from every departure lane.
    We use this function to gather the linestrings that should be drawn and we make no difference in color between which arrival lane belongs to which departure lane.
    If we would want to be able to display the arrival lanes that can be reached from one selected departure lane, this methods return value and the props given to GeoMap should be revised.
     */
    getGreenLightLineStrings(greenStates,stateDefs){
        let greenLightLineStrings = {departureLanes: [], arrivalLanes: []};
        if(greenStates){
            greenStates.forEach(
                (state) => {
                    // console.log("state",state);
                    let signalgroup = stateDefs[state];
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
        let {greenLightLineStrings} = this.state;
        // console.log(greenLightLineStrings);
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