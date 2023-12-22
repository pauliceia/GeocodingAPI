const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const mocha = require('mocha');
const suite = mocha.suite;
const test = mocha.test;
const assert = chai.assert

chai.use(chaiHttp);

suite('Route index tests', function () {
    test('Get placeslist', function(done){
        chai.request(server)
            .get('/api/geocoding/placeslist')
            .end(function(err, res){
                assert.equal(res.status, 200);
                done();
            });
    });

    test('Get places', function (done){
        chai.request(server)
            .get('/api/geocoding/places')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                done();
            });
    })

    test('Get streets', function (done){
        chai.request(server)
            .get('/api/geocoding/streets')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                done();
            });
    })

    suite('Geolocation tests', function () {
        const parameters = ['alameda barao de piracicaba,34,1908']
        parameters.forEach( parameter => {
            test(`Get geolocation for ${parameter}`, function (done) {
                this.timeout(30000);
                chai.request(server)
                    .get(`/api/geocoding/geolocation/${parameter}/json`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.typeOf(res.body, 'array');
                        assert.equal(res.body[1][0].status, 1)
                        done();
                    });
                done();
            });
        });
    });
});
