'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


var otherwiseCallback = function()
{
    if (this.data.errors.throws)
    {
        throw new Error('Item #' + this.data.errors.faulty + ' wasn\'t valid');
    }
    else if (this.data.callbacks.otherwise && utils.isFunction(this.data.callbacks.otherwise))
    {
        var msg;

        if (this.data.errors.condition === utils.CONDITIONS.NOT_NULL)
        {
            msg = 'Item #' + this.data.errors.faulty + ' was null';
        }

        this.data.callbacks.otherwise.call(this, new Error(msg));

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.otherwise;
    }
};

var validCallback = function()
{
    if (this.data.callbacks.valid && utils.isFunction(this.data.callbacks.valid))
    {
        this.data.callbacks.valid.call(this);

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.valid;
    }
};

var otherwiseOrValid = function()
{
    if (this.data.errors.found)
    {
        otherwiseCallback.call(this);
    }
    else
    {
        validCallback.call(this);
    }
};


function ConstrainVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.CONSTRAIN, args);
    
    this.data.values = args;

    if (this.data.values)
    {
        this.validator = function(cb)
        {
            if (cb)
            {
                var a;
                var found = false;
                
                var ok = function()
                {
                    return true;
                };
                
                var not_ok = function()
                {
                    return false;
                };

                for (a=0; a<this.data.values.length && !found; a++)
                {
                    found = !cb(this.data.values[a], a, ok, not_ok);
                }

                this.data.errors.found = found;
                this.data.errors.condition = utils.CONDITIONS.NOT_NULL;
                this.data.errors.faulty = a;
            }

            return this;
        };
        
        this.notnull = function()
        {
            return this.validator(function(data, position, ok, not_ok)
            {
                if (   data === undefined
                    || data === null)
                {
                    return not_ok();
                }
                else
                {
                    return ok();
                }
            });
        };
        
        this.objects = function()
        {
            return this.validator(function(data, position, ok, not_ok)
            {
                if (utils.isObject(data))
                {
                    return ok();
                }
                else
                {
                    return not_ok();
                }
            });
        };

        this.otherwise = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            otherwiseOrValid.call(this);

            return this;
        };

        this.throws = function()
        {
            this.data.errors.throws = true;
            
            otherwiseOrValid.call(this);
            
            return this;
        };

        this.valid = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.valid = cb;
            }

            otherwiseOrValid.call(this);

            return this;
        };
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(ConstrainVerbObject, Fluent);


module.exports = ConstrainVerbObject;
