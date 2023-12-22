const chaiHttp = require('chai-http');
const server = require('../app');
const chai = require("chai");
const assert = chai.assert;
const mocha = require('mocha');
const suite = mocha.suite;
const test = mocha.test;

chai.use(chaiHttp);
suite('User API tests', function () {
    test('Get user', function(){
        chai.request(server)
            .get('/users')
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.text, 'respond with a resource');
            });
    })
});