
'use strict';

var utils = require('../utils');


function Fluent(operation, args)
{
    var op = operation;
    
    if (op && utils.isNumber(op) && utils.isArray(args))
    {
        this.data = {};
        this.data.errors = {};
        this.data.callbacks = {};
    }
    else
    {
        throw new Error('Missing operation');
    }
}


module.exports = Fluent;
