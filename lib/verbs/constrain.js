
'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


function ConstrainVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.CONSTRAIN, args);
    
    if (utils.isNull(this.data.values))
    {
        this.data.values = [];
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
        
        this.object = this.objects;
        
        this.arrays = function()
        {
            this.data.values[this.chainPosition].validator = function(data, position, ok, not_ok)
            {
                if (utils.isArray(data))
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
        
        this.array = this.arrays;
        
        this.strings = function()
        {
            this.data.values[this.chainPosition].validator = function(data, position, ok, not_ok)
            {
                if (utils.isString(data))
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
        
        this.string = this.strings;
        
        this.numbers = function()
        {
            this.data.values[this.chainPosition].validator = function(data, position, ok, not_ok)
            {
                if (utils.isNumber(data))
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
        
        this.number = this.numbers;

        this.otherwise = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            utils.callbacks.otherwiseOrValid.call(this);

            return this;
        };

        this.throws = function(msg)
        {
            this.data.errors.throws        = true;
            this.data.errors.throwsMessage = msg;
            
            utils.callbacks.otherwiseOrValid.call(this);
            
            return this;
        };

        this.valid = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.valid = cb;
            }

            utils.callbacks.otherwiseOrValid.call(this);

            return this;
        };
        
        this.constrain = function()
        {
            utils.callbacks.otherwiseOrValid.call(this);
            
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
