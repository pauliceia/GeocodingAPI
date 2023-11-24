const assert = require('assert');
const { Given, When, Then, AfterAll } = require('cucumber');
const request = require('supertest')
const app = require('../../app')

let response;
let server

Given(/^I am an user of the application$/, async function () {
    this.request = request(app)
    server = app.listen();
});

When(/^I ask for the places\-list$/, async function () {
    response = await this.request.get('/api/geocoding/placeslist');
});

Then(/^I should receive a list of places$/, async function () {
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body));
});

AfterAll(async function () {
    await server.close();
});