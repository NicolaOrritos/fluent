
'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


function BundleVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.BUNDLE, args);
    
    this.result = utils.bundleAllData(args);
    
    this.then = function(cb)
    {
        if (cb && utils.isFunction(cb))
        {
            if (this.result)
            {
                cb.call(this, this.result);
            }
            else if (this.data.callbacks.otherwise)
            {
                this.data.callbacks.otherwise.call(this, new Error('Nothing to bundle'));
            }
        }

        return this;
    };
    
    this.otherwise = function(cb)
    {
        if (cb && utils.isFunction(cb))
        {
            this.data.callbacks.otherwise = cb;

            if (utils.isNull(this.result))
            {
                cb.call(this, new Error('Nothing to bundle'));
            }
        }

        return this;
    };
}

utils.inherits(BundleVerbObject, Fluent);


module.exports = BundleVerbObject;
