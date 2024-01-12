//p1 -> latitude, longitude, year

//Euclidian Distance
const getDistance = function(x1, y1, z1, x2, y2, z2){
    return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1)+(z2-z1)*(z2-z1));
};
//p2 -> latitude, longitude, year

exports.confidenceRateCode = function(p1, p2, year){
    
    //define references
    const pointRef = [-46.63617,-23.54360];
    const firstYear = 1860;
    const lastYear = 1940;

    //calculate distances
    const distP1 = getDistance(p1[0], p1[1], year, pointRef[0], pointRef[1], year);
    const distP2 = getDistance(p2[0], p2[1], year, pointRef[0], pointRef[1], year);
    
    //calculate rate 
    const meanDist = (distP1+distP2)/2;
    const total = getDistance(pointRef[0], pointRef[1], firstYear, pointRef[0], pointRef[1], lastYear);
    const distRel = getDistance(pointRef[0], pointRef[1], firstYear, pointRef[0], pointRef[1], year);

    //coenficent
    //return the rate
    return (distRel + meanDist) / total
}

exports.confidenceRateLocate = function(year){
    
    //return the rate
    return 1

}


