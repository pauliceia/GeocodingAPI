const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET placeslist', () => {
    it('it should GET all the places', (done) => {
        chai.request(server)
            .get('/api/geocoding/placeslist')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
});

// describe('/GET places', () => {
//     it('it should GET all the places', (done) => {
//         chai.request(server)
//             .get('/api/geocoding/places')
//             .end((err, res) => {
//                 res.should.have.status(200);
//                 res.body.should.be.a('array');
//                 //res.body.length.should.be.eql(0);
//                 done();
//             });
//     });
// });