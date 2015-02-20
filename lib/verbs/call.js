'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


var otherwiseCallback = function()
{
    if (this.data.callbacks.otherwise && utils.isFunction(this.data.callbacks.otherwise))
    {
        var msg;

        if (this.data.errors.condition === utils.CONDITIONS.NOT_A_FUNCTION)
        {
            msg = 'Item #' + this.data.errors.faulty + ' was not a function';
        }
        else if (this.data.errors.condition === utils.CONDITIONS.ERROR_THROWN)
        {
            msg = 'Item #' + this.data.errors.faulty + ' threw an error. ' + this.data.errors.thrown;
        }

        this.data.callbacks.otherwise.call(this, new Error(msg));

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.otherwise;
    }
};

var thenCallback = function()
{
    if (this.data.callbacks.then && utils.isFunction(this.data.callbacks.then))
    {
        this.data.callbacks.then.call(this, this.data.result);

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.then;
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
        thenCallback.call(this);
    }
};


function CallVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.CALL, args);
    
    var self = this;
    
    var evaluateFunctions = function(fns)
    {
        for (var a=0; a< fns.length; a++)
        {
            var fn = fns[a];
            
            if (utils.isFunction(fn))
            {
                try
                {
                    // TODO: Enable passing 'this' reference
                    var result = fn.call(self);
                    
                    if (result instanceof Error)
                    {
                        self.data.errors.found     = true;
                        self.data.errors.condition = utils.CONDITIONS.ERROR_THROWN;
                        self.data.errors.faulty    = a;
                        self.data.errors.thrown    = result;
                    }
                    else
                    {
                        self.data.result = result;
                    }
                }
                catch(exc)
                {
                    self.data.errors.found     = true;
                    self.data.errors.condition = utils.CONDITIONS.ERROR_THROWN;
                    self.data.errors.faulty    = a;
                    self.data.errors.thrown    = exc;
                }
            }
            else
            {
                self.data.errors.found     = true;
                self.data.errors.condition = utils.CONDITIONS.NOT_A_FUNCTION;
                self.data.errors.faulty    = a;
            }
        }
    };
    
    
    this.data.values = args;

    if (this.data.values)
    {
        this.otherwise = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            otherwiseOrThen.call(this);

            return this;
        };

        this.then = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.then = cb;
            }

            otherwiseOrThen.call(this);

            return this;
        };
        
        evaluateFunctions(args);
    }
    else
    {
        throw new Error('Missing function(s) to be called');
    }
}

utils.inherits(CallVerbObject, Fluent);


module.exports = CallVerbObject;
