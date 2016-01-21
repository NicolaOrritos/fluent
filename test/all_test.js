
'use strict';

/* global describe, it */

let assert  = require('assert');

let f = require('../lib/main.js');


// Some test data:
let val1 = 'val1';

let obj = {};

obj.array = [
    {prop1: val1, pos: 'first'},
    {prop1: null},
    {prop1: val1, pos: 'third'},
    {prop1: val1, pos: 'fourth'}
];


describe('Fluent library, basic checks', () =>
{
    it('Gets successfully required', done =>
    {
        assert(f !== null);

        done();
    });

    it('Contains all verbs and all of them are functions', done =>
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

describe('Fluent library, "check" verb', () =>
{
    it('Many objects check for a not-null condition', done =>
    {
        f.check(obj).and(obj.array).and(undefined).notnull()
        .then( () =>
        {
            throw new Error('Test failed. Not recognized error in parameter.');
        })
        .otherwise( err =>
        {
            assert(err !== null);

            done();
        });
    });

    it('Simple successful check', done =>
    {
        f.check(null).and(undefined).null()
        .then( () =>
        {
            done();
        })
        .otherwise( (/* err */) =>
        {
            throw new Error('Test failed. Should have validated.');
        });
    });
});
