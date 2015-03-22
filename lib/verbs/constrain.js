
'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


var otherwiseCallback = function()
{
    var msg = 'Item #' + this.data.errors.faulty + ' wasn\'t valid';
    var err = new Error(msg);
    
    if (this.data.errors.throws)
    {
        throw err;
    }
    else if (this.data.callbacks.otherwise && utils.isFunction(this.data.callbacks.otherwise))
    {
        this.data.callbacks.otherwise.call(this, err, this.data.errors.faulty);

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
    
    if (utils.isNull(this.data.values))
    {
        this.data.values = [];
    }
    
    if (args.length === 1 && utils.isArray(args[0]))
    {
        args = args[0];
    }
    
    this.chainPosition = 0;
    
    this.data.values[this.chainPosition] = {data: args};

    if (this.data.values[this.chainPosition])
    {
        this.validate = function()
        {
            var a;
            var b     = 0;
            var found = false;

            var ok = function()
            {
                return true;
            };

            var not_ok = function()
            {
                return false;
            };

            for (var link=0; link<=this.chainPosition && !found; link++)
            {
                var validator = this.data.values[link].validator;
                
                for (a=0; a<this.data.values[link].data.length && !found; a++)
                {
                    b++;
                    
                    found = !validator(this.data.values[link].data[a], a, ok, not_ok);
                }
            }

            this.data.errors.found  = found;
            this.data.errors.faulty = b;
        };
        
        this.notnull = function()
        {
            this.data.values[this.chainPosition].validator = function(data, position, ok, not_ok)
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
            };
            
            this.validate();
            
            return this;
        };
        
        this.objects = function()
        {
            this.data.values[this.chainPosition].validator = function(data, position, ok, not_ok)
            {
                if (utils.isObject(data))
                {
                    return ok();
                }
                else
                {
                    return not_ok();
                }
            };
            
            this.validate();
            
            return this;
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
        
        this.constrain = function()
        {
            otherwiseOrValid.call(this);
            
            var args = Array.prototype.slice.call(arguments);
            
            this.chainPosition++;
            
            this.data.values[this.chainPosition] = {data: args};
            
            return this;
        };
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(ConstrainVerbObject, Fluent);

ConstrainVerbObject.internal = function(args)
{
    return new ConstrainVerbObject(args);
};


module.exports = ConstrainVerbObject;
