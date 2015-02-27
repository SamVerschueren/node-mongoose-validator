/*jshint expr:true */
'use strict';

/**
 * Test runners for the node-mongoose-validator library.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  27 Feb. 2015
 */

// module dependencies
var chai = require('chai'),
    mongoose = require('mongoose'),
    sinon = require('sinon'),
    validator = require('../index.js');

var Schema = mongoose.Schema;

// Use should flavour
var should = chai.should();

describe('node-mongoose-validator', function() {

    var UserSchema,
        User,
        obj;

    beforeEach(function() {
        obj = {
            name: 'Sam',
            email: 'sam.verschueren@gmail.com'
        };

        UserSchema = new Schema({
            name:       {type: String, required: true},
            email:      {type: String, required: true}
        });

        User = mongoose.model('User', UserSchema);
    });

    afterEach(function() {
        delete mongoose.models.User;
    });

    before(function() {
        sinon.stub(mongoose.Model.prototype, 'save', function(callback) {
            callback();
        });
    });

    describe('Function', function() {

        describe('#notEmpty', function() {

            var errMsg = 'Please provide a name';

            beforeEach(function() {
                UserSchema.path('name').validate(validator.notEmpty(), errMsg);
            });

            it('Should not return an error if a name is provided', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the name is not provided', function(done) {
                delete obj.name;

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                delete obj.name;

                new User(obj).save(function(err) {
                    //err.errors.name.message.should.be.equal(errMsg);


                    done();
                });
            });
        });

        describe('#isEmail', function() {

            var errMsg = 'Email is wrong';

            beforeEach(function() {
                UserSchema.path('email').validate(validator.isEmail(), errMsg);
            });

            it('Should not return an error if the email address is valid', function(done) {
                new User({name: 'Sam', email: 'sam.verschueren@gmail.com'}).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the email address is not valid', function(done) {
                new User({name: 'Sam', email: 'sam.verschueren'}).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                new User({name: 'Sam', email: 'sam.verschueren'}).save(function(err) {
                    err.errors.email.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

    });

    describe('Object', function() {

        describe('#$notEmpty', function() {

            var errMsg = 'Please provide a name';

            beforeEach(function() {
                UserSchema.path('name').validate(validator.$notEmpty({msg: errMsg}));
            });

            it('Should not return an error if a name is provided', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the name is not provided', function(done) {
                delete obj.name;

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                delete obj.name;

                new User(obj).save(function(err) {
                    //err.errors.name.message.should.be.equal(errMsg);


                    done();
                });
            });
        });

        describe('#$isEmail', function() {

            var errMsg = 'Email is wrong';

            it('Should not return an error if the email address is valid', function(done) {
                UserSchema.path('email').validate(validator.$isEmail({msg: errMsg}));

                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the email address is not valid', function(done) {
                UserSchema.path('email').validate(validator.$isEmail({msg: errMsg}));

                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                UserSchema.path('email').validate(validator.$isEmail({msg: errMsg}));

                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    err.errors.email.message.should.be.equal(errMsg);

                    done();
                });
            });

            it('Should not return an error if the email is a display email and this is enabled in the validator', function(done) {
                UserSchema.path('email').validate(validator.$isEmail({allow_display_name: true, }, {msg: errMsg}));

                obj.email = 'Sam Verschueren <sam.verschueren@gmail.com>';

                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });
        });
    });
});
