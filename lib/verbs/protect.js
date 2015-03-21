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

var ensureCall = function(thisArg, args)
{
    if (thisArg.data.executed !== true && thisArg.data.values[0] && thisArg.data.errors.found !== true)
    {
        var scope = thisArg.data.scope || thisArg;
        thisArg.data.result = thisArg.data.values[0].apply(scope, args);
        thisArg.data.executed = true;
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
                found = utils.isNull(list[a]);
            }
            
            if (found)
            {
                this.data.errors.found = true;
                this.data.errors.condition = utils.CONDITIONS.NOT_NULL;
                this.data.errors.faulty = a;
            }
            else
            {
                ensureCall(this, list);
            }

            return this;
        };

        this.catch = function(cb)
        {
            ensureCall(this);
            
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            otherwiseOrThen.call(this);

            return this;
        };

        this.scope = function(scope)
        {
            if (scope)
            {
                this.data.scope = scope;
            }

            return this;
        };
        
        this.return = function()
        {
            var result;
            
            if (this.data.errors.found !== true)
            {
                ensureCall(this);

                if (this.data.result)
                {
                    result = this.data.result;
                }
                else if (this.data.callbacks.otherwise)
                {
                    otherwiseCallback.call(this);
                }
            }
            
            return result;
        };
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(ProtectVerbObject, Fluent);


module.exports = ProtectVerbObject;
