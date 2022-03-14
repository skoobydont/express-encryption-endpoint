// import supertest
const request = require("supertest");
// import application
const app = require("./index");
// Test Decryption Route
describe('Decrypt Payload', () => {
  it('decrypts payload into object', (done) => {
    request(app)
      .post('/v1/user')
      .send({ payload: "e11dacd859a4087b67ed4c5395674e7485673bee12a5ddaf1e26cc47ef275f2db2f3ae340acb6aa1a7c2814280cc68230e6bafc69668465c999df5abcc6fdab47a" })
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          done();
        }
      });
  });
});
