import axios from 'axios';
import n3 from 'n3';

const { DataFactory } = n3;
const { namedNode } = DataFactory;

export function download(_uri){
    return new Promise((resolve,reject) => {
        axios.get(_uri)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}

export function parseAndStoreQuads(_doc){
    return new Promise(resolve => {
       const parser = new n3.Parser();
       const store = n3.Store();
       parser.parse(_doc, (error, quad, prefixes) => {
           if(quad)
               store.addQuad(quad);
           else
               resolve(store);
       })
    });
}

export async function getSignalGroups(_store){
    let signalgroups = [];
    await _store
        .getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#type'), namedNode('https://w3id.org/opentrafficlights#Signalgroup'))
        .forEach(
            (quad) => {signalgroups.push(quad.subject.value);}
        );
    return signalgroups;
}

export async function getLaneDefs(_store){ //map linestring op lane
    let lanes = {};
    await _store
        .getQuads(null, "http://www.opengis.net/#geosparql/wktLiteral", null)
        .forEach(
            (quad) => {lanes[quad.subject.value] = quad.object.value;}
        );
    return lanes;
}

export async function getStateDefs(_store){ //map state op signalgroup
    let greenStates = {};
    await _store
        .getQuads(null, "https://w3id.org/opentrafficlights#signalState", null)
        .forEach(
            (quad) => {greenStates[quad.object.value] = quad.subject.value;}
        );
    return greenStates;
}

export async function getGreenStates(_store){ //phase 6
    let greenStates = [];
    await _store
        .getQuads(null, "https://w3id.org/opentrafficlights#signalPhase", "https://w3id.org/opentrafficlights/thesauri/signalphase/6")
        .forEach(
            (quad) => {greenStates.push(quad.subject.value);}
        );
    return greenStates;
}

export function getDepartureLanes(_store){
    let departurelanes = [];
    if(_store){
        let processedDepartureLanes = [];
        _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#departureLane'), null).forEach((quad) => {
            _store.getQuads(quad.object, namedNode('http://purl.org/dc/terms/description'), null).forEach( (quad) => {
                if (!processedDepartureLanes.includes(quad.object.value)){
                    processedDepartureLanes.push(quad.object.value);
                }

                // Load arrival lanes
                _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#departureLane'), quad.subject).forEach((connectie) => {
                    let signalgroup = _store.getQuads(connectie.subject, namedNode('https://w3id.org/opentrafficlights#signalGroup'), null)[0].object.value;
                    _store.getQuads(connectie.subject, namedNode('https://w3id.org/opentrafficlights#arrivalLane'), null).forEach( (arrivalLane) => {
                        _store.getQuads(arrivalLane.object, namedNode('http://purl.org/dc/terms/description'), null).forEach( (descr) => {
                            if(!departurelanes[quad.subject.value]) departurelanes[quad.subject.value] = [];
                            departurelanes[quad.subject.value][arrivalLane.object.value] = {
                                '@id': arrivalLane.object.value,
                                'http://purl.org/dc/terms/description': descr.object.value,
                                'https://w3id.org/opentrafficlights#signalGroup': signalgroup
                            };
                        });
                    });
                });
            });
        });
    }
    return departurelanes;
}

export function getLanesForSignalGroup(_store){ //build index which gives an array of arrival lanes and an array of departure lanes for each signalgroup
    return new Promise((resolve)=>{
        let signalGroups = {};
        if(_store) {
            _store.getQuads(null, namedNode('http://www.w3.org/2000/01/rdf-schema#type'), namedNode('https://w3id.org/opentrafficlights#Signalgroup')).forEach((signalGroup) => {
                if(!signalGroups[signalGroup.subject.value]){
                    signalGroups[signalGroup.subject.value] = {departureLanes: [], arrivalLanes: []};
                }

                _store.getQuads(null, namedNode('https://w3id.org/opentrafficlights#signalGroup'), signalGroup.subject).forEach((connection) => {

                    //Load departure lanes
                    _store.getQuads(connection.subject, namedNode('https://w3id.org/opentrafficlights#departureLane'), null).forEach((quad) => {
                        if(!signalGroups[connection.object.value].departureLanes.includes(quad.object.value)) signalGroups[connection.object.value].departureLanes.push(quad.object.value);
                    });

                    //Load arrival lanes
                    _store.getQuads(connection.subject, namedNode('https://w3id.org/opentrafficlights#arrivalLane'), null).forEach((quad) => {
                        if(!signalGroups[connection.object.value].arrivalLanes.includes(quad.object.value)) signalGroups[connection.object.value].arrivalLanes.push(quad.object.value);
                    });

                });
            })
        }
        resolve(signalGroups);
    });
}

