const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const mocha = require('mocha');
const suite = mocha.suite;
const test = mocha.test;
const assert = chai.assert;

chai.use(chaiHttp);

suite('Route index tests', function () {
    test('Get placeslist', function(){
        chai.request(server)
            .get('/api/geocoding/placeslist')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
            });
    });

    test('Get places', function (){
        chai.request(server)
            .get('/api/geocoding/places')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
            });
    })

    test('Get streets', function (){
        chai.request(server)
            .get('/api/geocoding/streets')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
            });
    })

});
