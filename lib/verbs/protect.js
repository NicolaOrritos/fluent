'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


var otherwiseCallback = function()
{
    if (this.data.callbacks.otherwise && utils.isFunction(this.data.callbacks.otherwise))
    {
        var msg;

        if (this.data.errors.condition === utils.CONDITIONS.NOT_NULL)
        {
            msg = 'Item #' + this.data.errors.faulty + ' was null';
        }
        else if (this.data.errors.condition === utils.CONDITIONS.NULL)
        {
            msg = 'Item #' + this.data.errors.faulty + ' wasn\'t null';
        }

        this.data.callbacks.otherwise.call(this, new Error(msg));

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.otherwise;
    }
};

var otherwiseOrThen = function()
{
    if (this.data.errors.found)
    {
        otherwiseCallback.call(this);
    }
    else
    {
        // Not used
    }
};


function ProtectVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.PROTECT, args);
    
    this.data.values = args;

    if (args && args.length)
    {
        this.pass = function()
        {
            var list = Array.prototype.slice.call(arguments);
            
            var a;
            var found = false;

            for (a=0; a<list.length && !found; a++)
            {
                if (   list[a] === undefined
                    || list[a] === null)
                {
                    found = true;
                }
            }

            if (found)
            {
                this.data.errors.found = found;
                this.data.errors.condition = utils.CONDITIONS.NOT_NULL;
                this.data.errors.faulty = a;
            }
            else
            {
                this.data.result = this.data.values[0].apply(this, arguments);
            }

            return this;
        };

        this.catch = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            otherwiseOrThen.call(this);

            return this;
        };
        
        this.return = function()
        {
            if (this.data.result)
            {
                return this.data.result;
            }
            else if (this.data.callbacks.otherwise)
            {
                otherwiseCallback.call(this);
            }
            else
            {
                return undefined;
            }
        };
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(ProtectVerbObject, Fluent);


module.exports = ProtectVerbObject;
