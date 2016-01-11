/* global describe, it */
'use strict';

var assert  = require('assert');

var f = require('../lib/main.js');


// Some test data:
var val1 = 'val1';

var obj = {};

obj.array = [
    {prop1: val1, pos: 'first'},
    {prop1: null},
    {prop1: val1, pos: 'third'},
    {prop1: val1, pos: 'fourth'}
];


describe('Fluent library, basic checks', function()
{
    it('Gets successfully required', function(done)
    {
        assert(f !== null);

        done();
    });

    it('Contains all verbs and all of them are functions', function(done)
    {
        assert(f.check.apply);
        assert(f.notnull.apply);
        assert(f.from.apply);
        assert(f.bundle.apply);
        assert(f.constrain.apply);
        assert(f.protect.apply);

        done();
    });
});

describe('Fluent library, "check" verb', function()
{
    it('Many objects check for a not-null condition', function(done)
    {
        f.check(obj).and(obj.array).and(undefined).notnull()
        .then(function()
        {
            throw new Error('Test failed. Not recognized error in parameter.');
        })
        .otherwise(function(err)
        {
            assert(err !== null);

            done();
        });
    });

    it('Simple successful check', function(done)
    {
        f.check(null).and(undefined).null()
        .then(function()
        {
            done();
        })
        .otherwise(function(/* err */)
        {
            throw new Error('Test failed. Should have validated.');
        });
    });
});
