const request = require('supertest');
const assert = require('assert');
const express = require('express');

const app = express();

app.get('/user', function(req : any, res : any) {
    res.status(200).json({ name: 'john' });
  });




describe("Validate library features", () => {
    it("Should make a get request", () => {
        request(app)
        .get('/user')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '15')
        .expect(200)
        .end(function(err : any, res : any) {
            if (err) throw err;
        });
    })

})

describe('GET /user', function() {
    it('responds with json', function(done) {
      request(app)
        .get('/user')
        .auth('username', 'password')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

