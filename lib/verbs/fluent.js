
'use strict';

let utils = require('../utils');


function Fluent(operation, args)
{
    let op = operation;

    if (op && utils.isNumber(op) && utils.isArray(args))
    {
        this.data = {};
        this.data.errors = {};
        this.data.callbacks = {};
        this.data.callbacks.called = {};
    }
    else
    {
        throw new Error('Missing operation');
    }
}


module.exports = Fluent;
