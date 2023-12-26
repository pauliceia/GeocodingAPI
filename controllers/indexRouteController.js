const client = require('../models/database');
const Match = require("./dictionary");
const Locate = require("./lineLocate");
const Create = require("./lineSubstring");
const Search = require("./searchPoint");
const Calculate = require("./confidenceRate");

/*-------------------------------------------------+
| function getDateTime()                           |
+-------------------------------------------------*/
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return hour + ":" + min + ":" + sec + " " + day + "/" + month + "/" + year;
}

function getPlacesList(){
    return new Promise((resolve, reject) => {

        const results = [];

        //Build the SQL Query
        const SQL_Query_Select_List = "select a.id as places_id, b.name as name_s, a.number::float, a.first_year::integer as firstyear, a.last_year::integer as lastyear, ST_AsText(a.geom) as geom from streets_pilot_area as b join places_pilot_area2 as a on a.id_street::integer = b.id::integer where a.number::float > 1 and b.name IS NOT NULL order by name_s, a.first_year, a.last_year, a.number;";

        //Execute SQL Query
        client.query(SQL_Query_Select_List)
            .then(res => {
                const results = res.rows.map(row => {
                    if (!row.firstyear) {
                        return row.name_s + ', ' + row.number + ', ' + row.lastyear;
                    } else {
                        return row.name_s + ', ' + row.number + ', ' + row.firstyear;
                    }
                });
                resolve(results);
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                reject(err);
            });
    });
}

function getPlaces(){
    return new Promise((resolve, reject) => {
        //Results Variable
        const results = [];

        //Build the SQL Query
        const SQL_Query_Select_List = "select a.id as places_id, a.id_street, b.name as name_s, a.number::float, a.first_year::integer as firstyear, a.last_year::integer as lastyear, ST_AsText(a.geom) as geom from streets_pilot_area as b join places_pilot_area2 as a on a.id_street::integer = b.id::integer union select a.id as places_id, a.id_street, b.name as name_s, a.number::float, a.first_year::integer as firstyear, a.last_year::integer as lastyear, ST_AsText(a.geom) as geom from streets_pilot_area as b join places_pilot_area as a on a.id_street::integer = b.id::integer where a.number::float = 0.0 order by number;";

        //Execute SQL Query
        client.query(SQL_Query_Select_List)
            .then(res => {
                const results = res.rows.map(row => {
                    if (!row.lastyear) {
                        return {
                            places_id: row.places_id,
                            id_street: row.id_street,
                            street_name: row.name_s,
                            place_name: '',
                            place_number: row.number,
                            place_firstyear: row.firstyear,
                            place_lastyear: 2000,
                            place_geom: row.geom
                        };
                    } else {
                        return {
                            places_id: row.places_id,
                            id_street: row.id_street,
                            street_name: row.name_s,
                            place_name: '',
                            place_number: row.number,
                            place_firstyear: row.firstyear,
                            place_lastyear: row.lastyear,
                            place_geom: row.geom
                        };
                    }
                });
                resolve(results);
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                reject(err);
            });
    });
}

function getStreets(){
    return new Promise((resolve, reject) =>
    {
        const results = [];

        //Build the SQL Query
        const SQL_Query_Select_List = "select id, name, first_year::integer as firstyear, last_year::integer as lastyear, ST_astext(geom) as geom from streets_pilot_area;";

        //Execute SQL Query
        client.query(SQL_Query_Select_List)
            .then(res => {
                const results = res.rows.map(row => {
                    return {
                        id: row.id,
                        street_name: row.name,
                        street_geom: row.geom,
                        street_firstyear: row.firstyear,
                        street_lastyear: row.lastyear
                    };
                });
                resolve(results);
            })
            .catch(err => {
                console.error('Error executing query', err.stack);
                reject(err);
            });
    });
}

function getGeolocation(textpoint, year, number){
    return new Promise(async (resolve, reject) => {
        //Results variables
        let results = [];
        let head = [];

        //Set the bodyjson with the body of the request
        var places = await getPlaces();

        //Filter json places using the entering variables
        var places_filter = places.filter(el => el.street_name == textpoint);
        //Results if there is no point in the searched street
        if (places_filter.length == 0) {
            console.log('entrous')
            //Result
            results.push({
                name: "Point not found",
                alertMsg: "Não encontramos pontos nesse logradouro referentes ao ano buscado (" + textpoint + ", " + number + ", " + year + ")",
                status: 0
            });

            //Write header
            head.push({
                createdAt: getDateTime(),
                type: 'GET'
            });

            //Push Head
            head.push(results);

            //Return the json with results
            resolve(head);
            return;
        }

        let id_street = places_filter[0].id_street;

        places_filter = places_filter.filter(el => el.place_firstyear <= year);
        places_filter = places_filter.filter(el => el.place_lastyear >= year);
        places_filter = places_filter.filter(el => el.place_number == number);

        /*--------------------+
        | Geolocation         |
        +--------------------*/
        if (places_filter.length == 1) {

            //Organize the Json results
            results.push({
                name: places_filter[0].place_name,
                geom: places_filter[0].place_geom,
                confidence: 1,
                status: 1
            });

            //Write header
            head.push({
                createdAt: getDateTime(),
                type: 'GET'
            });

            //Push Head
            head.push(results);

            //Return the json with results
            resolve(head);
            return;

        } else {

            places_filter = places.filter(el => el.street_name == textpoint);

            places_filter = places_filter.filter(el => el.place_lastyear >= year);
            places_filter = places_filter.filter(el => el.place_firstyear <= year);

            places_filter.sort((a, b) => {
                resolve(parseInt(a.place_number) - parseInt(b.place_number))
            })

            /*-----------------------+
            | Spatial Extrapolation  |
            +-----------------------*/

            if (parseFloat(places_filter[places_filter.length - 1].place_number) < number) {

                places_filter = places.filter(el => el.street_name == textpoint);
                places_filter = places_filter.filter(el => el.place_number == parseInt(places_filter[places_filter.length - 1].place_number));

                //Check if only one result was found
                if (places_filter.length == 1 && places_filter[0].place_number > 0) {

                    //Organize the Json results
                    results.push({
                        name: 'Point Spatial Extrapolated',
                        geom: places_filter[0].place_geom,
                        confidence: 0,
                        status: 1
                    });

                    //Write header
                    head.push({
                        createdAt: getDateTime(),
                        type: 'GET'
                    });

                    //Push Head
                    head.push(results);

                    //Return the json with results
                    resolve(head);
                    return
                }
            }

            /*-----------------------+
            | Saboya Geolocation     |
            +-----------------------*/
            if (year > 1931) {

                client.query('SELECT saboya_geometry($1, $2) AS saboya_geometry;', [id_street, number])
                    .then(result => {
                        const row = result.rows[0];

                        //Organize the Json results
                        results.push({
                            name: "Point Geolocated S",
                            geom: row.saboya_geometry,
                            confidence: 0.9,
                            status: 1
                        });

                        //Write header
                        head.push({
                            createdAt: getDateTime(),
                            type: 'GET'
                        });

                        //Push Head
                        head.push(results);

                        //Return the json with results
                        resolve(head);
                    })
                    .catch(err => {
                        console.error('Error executing query', err.stack);
                        reject(err);
                    });

                // Else (Not Saboya)
            } else {
                /*-----------------------+
                | Geocode              S  |
                +-----------------------*/

                //Set the bodyjson with the body of the request
                var streets = await getStreets();

                //Filter json streets using the entering variables
                var streets_filter = streets.filter(el => el.street_name == textpoint);

                //Get the street and merge it into linestring
                var linemerge = (streets_filter[0].street_geom);

                //Filter json places using the entering variables
                places_filter = places.filter(el => el.street_name == textpoint);

                //Filter json places using the entering variables
                places_filter = places_filter.filter(el => el.place_lastyear >= year);

                //Filter json places using the entering variables
                places_filter = places_filter.filter(el => el.place_firstyear <= year);

                //Declare array with numbers
                const numbers = [];

                //Loop to fill the array numbers
                for (var i = 0; i < places_filter.length; i++) {
                    numbers[i] = places_filter[i].place_number;
                }

                //Filter the json places to get the p1
                var p1 = places_filter.filter(el => el.place_number < number);

                //define array numbers 1
                var numbers_p1 = [];
                var j = 0;

                //Loop to fill the array numbers
                for (var i = 0; i < p1.length; i++) {

                    //Check if the number is even if that so append it to the array numbers
                    if (number % 2 == 0) {

                        let numero = '' + p1[i].place_number
                        numero = numero.replace(".", ",")

                        if (numero % 2 == 0) {
                            numbers_p1[j] = p1[i].place_number;
                            j++;
                        }

                        //Check if the number is odd if that so append it to the array numbers
                    } else {

                        let numero = '' + p1[i].place_number
                        numero = numero.replace(".", ",")

                        if (numero % 2 != 0) {
                            numbers_p1[j] = p1[i].place_number;
                            j++;
                        }
                    }
                }

                //filter the p1
                p1 = p1.filter(el => el.place_number == Math.max.apply(Math, numbers_p1));

                //Filter the json places to get the p2
                var p2 = places_filter.filter(el => el.place_number > number);

                //define array numbers 1-
                var numbers_p2 = [];
                j = 0;

                //Loop to fill the array numbers
                for (var i = 0; i < p2.length; i++) {

                    let numero = '' + number
                    numero = numero.replace(".", ",")

                    //Check if the number is even if that so append it to the array numbers
                    if (numero % 2 == 0) {

                        let numero = '' + p2[i].place_number
                        numero = numero.replace(".", ",")

                        if (parseFloat(numero) % 2 == 0) {
                            numbers_p2[j] = p2[i].place_number;
                            j++;
                        }

                        //Check if the number is odd if that so append it to the array numbers
                    } else {

                        let numero = '' + p2[i].place_number
                        numero = numero.replace(".", ",")

                        if (parseFloat(numero) % 2 != 0) {
                            numbers_p2[j] = p2[i].place_number;
                            j++;
                        }
                    }
                }

                //filter the p2
                p2 = p2.filter(el => el.place_number == Math.min.apply(Math, numbers_p2));

                console.log('--- P1 ---')
                console.log(p1)
                console.log()

                console.log('--- P2 ---')
                console.log(p2)
                console.log()

                /*-----------------------+
                | Points not found       |
                +-----------------------*/
                if (p2.length == 0 || p1.length == 0) {

                    //Result
                    results.push({
                        name: "Point not found",
                        alertMsg: "Não encontramos pontos necessarios para a geolocalização nesse logradouro no ano buscado (" + textpoint + ", " + number + ", " + year + ")",
                        status: 0
                    });

                    //Write header
                    head.push({
                        createdAt: getDateTime(),
                        type: 'GET'
                    });

                    //Push Head
                    head.push(results);

                    //Return the json with results
                    resolve(head)
                    return;

                }

                /*-----------------------+
                | Same geom problem      |
                +-----------------------*/
                if (p2[0].place_geom == p1[0].place_geom) {

                    //Filter the json places to get the p2
                    let new_p2 = places_filter.filter(el => el.place_number > number);

                    //Filter the json places to get the p2
                    let p2_num = p2[0].place_number;
                    new_p2 = new_p2.filter(el => el.place_number > p2_num);

                    //Declare loop variables
                    numbers_p2 = []
                    let j = 0;

                    //Loop to fill the array numbers
                    for (let i = 0; i < new_p2.length; i++) {

                        let numero = '' + number
                        numero = numero.replace(".", ",")

                        //Check if the number is even if that so append it to the array numbers
                        if (numero % 2 == 0) {

                            let numero = '' + new_p2[i].place_number
                            numero = numero.replace(".", ",")

                            if (parseFloat(numero) % 2 == 0) {
                                numbers_p2[j] = new_p2[i].place_number;
                                j++
                            }

                            //Check if the number is odd if that so append it to the array numbers
                        } else {

                            let numero = '' + new_p2[i].place_number
                            numero = numero.replace(".", ",")

                            if (parseFloat(numero) % 2 != 0) {
                                numbers_p2[j] = new_p2[i].place_number;
                                j++;
                            }
                        }
                    }

                    //Filter the places2 to get the min
                    p2 = new_p2.filter(el => el.place_number == Math.min.apply(Math, numbers_p2));

                }

                //set the geometry of the P1 and P2
                var p1_geom = p1[0].place_geom;
                var p2_geom = p2[0].place_geom;

                //get the startfraction
                var startfraction = Locate.lineLocate(linemerge, p1_geom);

                //get the endfraction
                var endfraction = Locate.lineLocate(linemerge, p2_geom);

                //check if end is bigger then start
                if (endfraction > startfraction) {

                    //get the geom of lineSubString
                    var sublinestring = Create.lineSubstring(linemerge, startfraction, endfraction);

                    //Else if end is bigger then start
                } else {

                    //get the geom of lineSubString
                    var sublinestring = Create.lineSubstring(linemerge, endfraction, startfraction);

                }

                //take the geom number of p1_geom
                p1_geom = p1_geom.substr(p1_geom.indexOf("(") + 1);
                p1_geom = p1_geom.substr(0, p1_geom.indexOf(")"));
                var p1_g = p1_geom;

                //take the geom number of p2_geom
                p2_geom = p2_geom.substr(p2_geom.indexOf("(") + 1);
                p2_geom = p2_geom.substr(0, p2_geom.indexOf(")"));
                var p2_g = p2_geom;

                //MULTILINESTRING Handler
                if (sublinestring == ',') {

                    //build the street geom
                    var geometry = ("MULTILINESTRING((" + p1_geom + "," + p2_geom + "))");

                } else {
                    if (!sublinestring) {

                        //build the street geom
                        var geometry = ("MULTILINESTRING((" + p1_geom + "," + p2_geom + "))");

                    } else {

                        //build the street geom
                        var geometry = ("MULTILINESTRING((" + p1_geom + "," + sublinestring + p2_geom + "))");

                    }
                }

                //Get the four variable to geocode
                var nl = p2[0].place_number;
                var nf = p1[0].place_number;
                var num = parseInt(number);

                //Organize the Json results
                results.push({
                    name: "Point Geolocated",
                    geom: ("POINT(" + Search.getPoint(geometry, parseInt(nf), parseInt(nl), parseInt(num)).point + ")"),
                    confidence: Calculate.confidenceRateCode(p1_g.split(" "), p2_g.split(" "), year),
                    status: 1
                });

                //Write header
                head.push({
                    createdAt: getDateTime(),
                    type: 'GET'
                });

                //Push Head
                head.push(results);

                //Return the json with results
                resolve(head);


            }
        }
    })
}

module.exports = {
    getPlaces,
    getStreets,
    getPlacesList,
    getGeolocation
};