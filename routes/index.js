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
var Match = require('../controllers/dictionary');
const indexController = require('../controllers/indexRouteController');

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
