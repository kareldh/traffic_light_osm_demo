/*
helper function to get [[lat,long],[lat,long],[lat,long]] from "LINESTRING ( lat long, lat long, lat long )"
 */

export default function (linestring) {
    let result = [];
    let regex = /\d*\.\d*/g;
    let numbers = linestring.match(regex);

    let lat = 0;
    let i = 0;
    numbers.forEach((number)=>{
        if(i%2===0){
            lat = parseFloat(number);
        }
        else {
            result.push([lat,parseFloat(number)]);
        }
        i=(i+1)%2;
    });

    return result;
}