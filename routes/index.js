/* ----------------------------------------------------------------------------+
|                                                                              |
|                 Pauliceia Geoocoding API - Gabriel Sansigolo                 |
|                                                                              |
+-----------------------------------------------------------------------------*/

/*--------------------------------------------------+
| Var                                               |
+--------------------------------------------------*/
// local
// var webServiceAddress = process.env.PORT ? "http://localhost:" + process.env.PORT : "http://localhost:3000";
// production
// var webServiceAddress = "http://www.pauliceia.dpi.inpe.br";
// read dotenv
require('dotenv').config();


// default address
let webServiceAddress = process.env.WEB_SERVICE_HOST ? process.env.WEB_SERVICE_HOST : "https://pauliceia.unifesp.br"

// if there are environment variables, then get them
if (process.env.HOST && process.env.PORT) {
    webServiceAddress = `https://${process.env.HOST}:${process.env.PORT}`
}

console.log('webServiceAddress: ', webServiceAddress)

var express = require('express');
var router = express.Router();
var Search = require('../controllers/searchPoint');
var Locate = require('../controllers/lineLocate');
var Create = require('../controllers/lineSubstring');
var Match = require('../controllers/dictionary');
var Calculate = require('../controllers/confidenceRate');
const indexController = require('../controllers/indexRouteController');
var request = require('request');

/*--------------------------------------------------+
| Connection                                        |
+--------------------------------------------------*/
const pg = require('pg');

const db_user = process.env.DATABASE_USER || "postgres";
const db_pass = process.env.DATABASE_PASS || "postgres";
const db_host = process.env.DATABASE_HOST || "localhost";
const db_name = process.env.DATABASE_NAME || "pauliceia";

const connectionString = {
    host: db_host,
    port: 5432,
    user: db_user,
    database: db_name,
    password: db_pass,
    connectionTimeoutMillis: 5000 // timeout after 5 seconds
}

console.log('starting server')

const client = new pg.Client(connectionString);

client.connect((err) => {
    if(err) {
        console.error('Failed to connect to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
});



/* ------------------------------------------------------------------------+
|                                                                          |
|                              URLS                                        |
|                                                                          |
+-------------------------------------------------------------------------*/

/*-----------------------------------------------+
| Places List                                    |
+-----------------------------------------------*/
router.get('/placeslist', async (req, response, next) => {
    try{
        const result = await indexController.getPlacesList();
        return response.json(result);
    } catch (e) {
        return response.json(e);
    }
});

/*-----------------------------------------------+
| Places Dataset                                 |
+-----------------------------------------------*/
router.get('/places', async (req, response, next) => {
    try{
        const result = await indexController.getPlaces();
        return response.json(result);
    } catch (e){
        return response.json(e);
    }

});

/*-----------------------------------------------+
| Street Dataset                                 |
+-----------------------------------------------*/
router.get('/streets', async (req, response, next) => {
   try{
       const result = await indexController.getStreets();
       return response.json(result);
   } catch (e){
       return response.json(e);
   }
});

/*--------------------------------------------------+
|  Geolocation                                      |
+--------------------------------------------------*/
router.get('/geolocation/:textpoint,:number,:year/json', async function(req, res, next) {
    try{
        const textpoint = Match.dictionary(req.params.textpoint.toLowerCase());
        const year = req.params.year.replace(" ", "");
        const number = req.params.number.replace(" ", "");
        const result = await indexController.getGeolocation(textpoint, year, number);
        return res.json(result);
    } catch (e){
        return res.json(e);
    }
});

/*---------------------------------------------------+
| Console Log                                        |
+---------------------------------------------------*/
console.log(process.env.PORT ? 'Listening on port ' + process.env.PORT : 'Listening on port 3000');
module.exports = router;
