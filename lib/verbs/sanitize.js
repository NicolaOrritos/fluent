'use strict';

let Fluent = require('./fluent');
let utils  = require('../utils');


function SanitizeVerbObject()
{
    Fluent.call(this, utils.OPERATIONS.SANITIZE, []);

    this.string = function(value)
    {
        if (value === 0)
        {
            value = '0';
        }
        else if (value === false)
        {
            value = 'false';
        }

        return '' + (value || '');
    };
}

utils.inherits(SanitizeVerbObject, Fluent);

SanitizeVerbObject.internal = function()
{
    return new SanitizeVerbObject();
};


module.exports = SanitizeVerbObject;
