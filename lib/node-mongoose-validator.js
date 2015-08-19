'use strict';

/**
 * This library offers a way of using the `validator` library methods for
 * validating Mongoose paths.
 *
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  27 Feb. 2015
 */

// module dependencies
var validator = require('validator'),
    _ = require('lodash');

// create the module
module.exports = (function() {

    var blacklist = ['init', 'extend', 'version', 'trim', 'ltrim', 'rtrim', 'escape', 'stripLow', 'whitelist', 'blacklist', 'normalizeEmail'],
        methods = {
            extend: function(methodName, fn) {
                if(methods[methodName] !== undefined) {
                    // Make sure people will not overwrite already existing methods
                    throw new Error('A method with this name already exists.');
                }

                // Returns a function
                methods[methodName] = function() {
                    var args = Array.prototype.slice.call(arguments);

                    return function(value) {
                        return fn.apply(validator, [value].concat(args));
                    };
                };

                // Returns a validator object
                methods['$' + methodName] = function() {
                    var args = Array.prototype.slice.call(arguments),
                        options = args.pop();

                    // The last parameter is an options object if it is a plain object and it has a msg parameter.
                    if(!_.isPlainObject(options) || options.msg === undefined) {
                        args.push(options);
                        options = {};
                    }

                    // Return the validator object
                    return {
                        validator: methods[methodName].apply(validator, args),
                        msg: options.msg
                    };
                };
            }
        };

    // Iterate over the validator and make the functions accordingly
    Object.keys(validator).forEach(function(methodName) {
        if(!methodName.match(/^to/) && blacklist.indexOf(methodName) === -1) {
            methods.extend(methodName, validator[methodName]);
        }
    });

    /**
     * Extend with extra functionality
     */

    // Checks if a string at leas has a length of 1
    methods.extend('notEmpty', function(str) {
        return validator.isLength(str, 1);
    });

    return methods;
})();
