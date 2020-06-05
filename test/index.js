const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;
const fs = require('fs');

chai.use(chaiHttp);

describe('API ENDPOINT TESTING', () => {
  it('GET Landing Page', (done) => {
    chai
      .request(app)
      .get('/api/v1/member/landing-page')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('Object');
        expect(res.body).to.have.property('hero');
        expect(res.body.hero).to.have.all.keys(
          'travelers',
          'treasures',
          'cities'
        );
        expect(res.body).to.have.property('mostPicked');
        expect(res.body.mostPicked).to.be.an('Array');
        expect(res.body).to.have.property('categories');
        expect(res.body.categories).to.be.an('Array');
        expect(res.body).to.have.property('testimonial');
        expect(res.body.testimonial).to.be.an('Object');
        done();
      });
  }),
    it('GET Detail Page', (done) => {
      chai
        .request(app)
        .get('/api/v1/member/detail-page/5e96cbe292b97300fc902223')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('country');
          expect(res.body).to.have.property('isPopular');
          expect(res.body).to.have.property('sumBooking');
          expect(res.body).to.have.property('unit');
          expect(res.body).to.have.property('categoryId');
          expect(res.body.categoryId).to.be.an('Array');
          expect(res.body).to.have.property('featureId');
          expect(res.body.featureId).to.be.an('Array');
          expect(res.body).to.have.property('activityId');
          expect(res.body.activityId).to.be.an('Array');
          expect(res.body).to.have.property('_id');
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('price');
          expect(res.body).to.have.property('city');
          expect(res.body).to.have.property('description');
          expect(res.body).to.have.property('__v');
          expect(res.body).to.have.property('testimonial');
          expect(res.body.testimonial).to.be.an('Object');
          expect(res.body.testimonial).to.have.all.keys(
            '_id',
            'imageUrl',
            'name',
            'rate',
            'content',
            'familyName',
            'familyOccupation'
          );
          done();
        });
    }),
    it('POST Booking Page', (done) => {
      const image = __dirname + '/image.png';
      const dataSample = {
        image,
        idItem: '5e96cbe292b97300fc902223',
        duration: 2,
        bookingStartDate: '1-1-2020',
        bookingEndDate: '3-3-2020',
        firstName: 'Ryan',
        lastName: 'Akbar',
        email: 'ryanakbar@gmail.com',
        phoneNumber: 081281245885,
        accountHolder: 'Akbar',
        bankFrom: 'BCA',
      };
      chai
        .request(app)
        .post('/api/v1/member/booking-page')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('idItem', dataSample.idItem)
        .field('duration', dataSample.duration)
        .field('bookingStartDate', dataSample.bookingStartDate)
        .field('bookingEndDate', dataSample.bookingEndDate)
        .field('firstName', dataSample.firstName)
        .field('lastName', dataSample.lastName)
        .field('email', dataSample.email)
        .field('phoneNumber', dataSample.phoneNumber)
        .field('accountHolder', dataSample.accountHolder)
        .field('bankFrom', dataSample.bankFrom)
        .attach('image', fs.readFileSync(dataSample.image), 'image.png')
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('Object');
          expect(res.body).to.have.property('booking');
          expect(res.body.booking).to.be.an('Object');
          expect(res.body.booking).to.have.all.keys(
            'payments',
            '_id',
            'bookingStartDate',
            'bookingEndDate',
            'invoice',
            'date',
            'itemId',
            'total',
            'memberId',
            '__v'
          );
          expect(res.body.booking.payments).to.have.all.keys(
            'status',
            'proofPayment',
            'bankFrom',
            'accountHolder'
          );
          expect(res.body.booking.itemId).to.have.all.keys(
            '_id',
            'title',
            'price',
            'duration'
          );
          console.log(res.body);
          done();
        });
    });
});
