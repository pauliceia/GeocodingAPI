const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const mocha = require('mocha');
const suite = mocha.suite;
const test = mocha.test;
const assert = chai.assert
const geolocationTestes = require('./route_index_test_expectation');

chai.use(chaiHttp);

suite('Route index tests', function () {
    test('get index', function (done) {
        chai.request(server)
            .get('/')
            .end(function (err, res) {
                assert.equal(res.status, 404);
                done();
            });
    })

    test('Get placeslist', function(done){
        const responseJson = "alameda barao de piracicaba, 2, 1908"
        chai.request(server)
            .get('/api/geocoding/placeslist')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.include(res.body, responseJson);
                done();
            });
    });

    test('Get places', function (done){
        const responseJson =   {
            places_id: 4149,
            id_street: 21,
            street_name: 'rua de sao bento',
            place_name: '',
            place_number: 0,
            place_firstyear: 1930,
            place_lastyear: 2000,
            place_geom: 'MULTIPOINT((-46.636675903981 -23.548936885947))'
        }

        chai.request(server)
            .get('/api/geocoding/places')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                assert.include(res.body[0], responseJson);
                done();
            });
    })

    test('Get streets', function (done){
        const responseJson = {
            "id": 146,
            "street_name": "rua doutor almirante lima",
            "street_geom": "MULTILINESTRING((-46.61660405251028 -23.542972195183765,-46.61557258261443 -23.544366742405376,-46.61464900572184 -23.545580766460308,-46.61088678950234 -23.55065168145471,-46.60964104640281 -23.552359890404592,-46.60973619524448 -23.554598954417454))",
            "street_firstyear": 1930,
            "street_lastyear": 1940
        };

        chai.request(server)
            .get('/api/geocoding/streets')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.typeOf(res.body, 'array');
                assert.include(res.body[0], responseJson);
                done();
            });
    })

    suite('Geolocation tests', function () {
        let count = 0;
        const parameters = geolocationTestes.parameters;
        const expectations = geolocationTestes.expectations;
        parameters.forEach( parameter => {
            test(`Get geolocation for ${parameter}`, function (done) {
                this.timeout(300000)
                chai.request(server)
                    .get(`/api/geocoding/geolocation/${parameter}/json`)
                    .end(function (err, res) {
                        assert.equal(res.status, 200);
                        assert.typeOf(res.body, 'array');
                        assert.include(res.body[1][0], expectations[count++]);
                        done();
                    });
            });
        });
    });
});
