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
            email: 'sam.verschueren@gmail.com',
            gender: 'male'
        };

        UserSchema = new Schema({
            name:       {type: String},
            email:      {type: String},
            gender:     {type: String}
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

        it('Should return a function', function() {
            validator.notEmpty().should.be.a('function');
        });

        describe('#equals', function() {

            var errMsg = 'The gender can only be male.';

            beforeEach(function() {
                UserSchema.path('gender').validate(validator.equals('male'), errMsg);
            });

            it('Should not return an error if the gender is male', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is empty', function(done) {
                obj.gender = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is female', function(done) {
                obj.gender = 'female';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error', function(done) {
                obj.gender = 'female';

                new User(obj).save(function(err) {
                    err.errors.gender.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

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

            it('Should return an error if the name is empty', function(done) {
                obj.name = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the name is empty', function(done) {
                obj.name = '';

                new User(obj).save(function(err) {
                    err.errors.name.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

        describe('#isIn', function() {

            var list = ['male', 'female'],
                errMsg = 'Gender should be one of ' + list.join(', ') + '.';

            beforeEach(function() {
                UserSchema.path('gender').validate(validator.isIn(list), errMsg);
            });

            it('Should not return an error if the gender is present in the list', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is empty', function(done) {
                obj.gender = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is not in the list', function(done) {
                obj.gender = 'other';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error', function(done) {
                obj.gender = 'other';

                new User(obj).save(function(err) {
                    err.errors.gender.message.should.be.equal(errMsg);

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
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the email address is not valid', function(done) {
                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    err.errors.email.message.should.be.equal(errMsg);

                    done();
                });
            });
        });
    });

    describe('Object', function() {

        it('Should return an object', function() {
            validator.$notEmpty().should.be.an('Object');
        });

        it('Should return an object with the correct properties', function() {
            var v = validator.$notEmpty();

            v.should.have.property('validator');
            v.should.have.property('msg');
        });

        it('Should return an object with the correct error message', function() {
            var v = validator.$notEmpty({msg: 'Invalid property'});

            v.msg.should.be.equals('Invalid property');
        });

        describe('#$equals', function() {

            var errMsg = 'The gender can only be male.';

            beforeEach(function() {
                UserSchema.path('gender').validate(validator.$equals('male', {msg: errMsg}));
            });

            it('Should not return an error if the gender is male', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is empty', function(done) {
                obj.gender = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is female', function(done) {
                obj.gender = 'female';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error', function(done) {
                obj.gender = 'female';

                new User(obj).save(function(err) {
                    err.errors.gender.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

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

            it('Should return an error if the name is empty', function(done) {
                obj.name = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the name is empty', function(done) {
                obj.name = '';

                new User(obj).save(function(err) {
                    err.errors.name.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

        describe('#$isIn', function() {

            var errMsg = 'Invalid gender.';

            beforeEach(function() {
                UserSchema.path('gender').validate(validator.$isIn(['male', 'female'], {msg: errMsg}));
            });

            it('Should not return an error if the gender is present in the list', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is empty', function(done) {
                obj.gender = '';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return an error if the gender is not in the list', function(done) {
                obj.gender = 'other';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error', function(done) {
                obj.gender = 'other';

                new User(obj).save(function(err) {
                    err.errors.gender.message.should.be.equal(errMsg);

                    done();
                });
            });
        });

        describe('#isEmail', function() {

            var errMsg = 'Email is wrong';

            beforeEach(function() {
                UserSchema.path('email').validate(validator.$isEmail({msg: errMsg}));
            });

            it('Should not return an error if the email address is valid', function(done) {
                new User(obj).save(function(err) {
                    should.not.exist(err);

                    done();
                });
            });

            it('Should return an error if the email address is not valid', function(done) {
                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    should.exist(err);

                    done();
                });
            });

            it('Should return the correct error if the email address is not valid', function(done) {
                obj.email = 'sam.verschueren';

                new User(obj).save(function(err) {
                    err.errors.email.message.should.be.equal(errMsg);

                    done();
                });
            });
        });
    });
});
