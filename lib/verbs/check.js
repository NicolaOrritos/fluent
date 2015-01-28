'use strict';

var Fluent = require('./fluentclass');
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

        // Cleanup errors before calling-back:
        delete this.data.errors.found;
        delete this.data.errors.condition;
        delete this.data.errors.faulty;


        this.data.callbacks.otherwise.call(this, new Error(msg));

        // Delete the callback to prevent double calls:
        delete this.data.callbacks.then;
    }
};

var thenCallback = function()
{
    if (this.data.callbacks.then && utils.isFunction(this.data.callbacks.then))
    {
        this.data.callbacks.then.call(this);

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


function CheckVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.CHECK, args);
    
    this.data.values = args;

    if (this.data.values)
    {
        this.and = function()
        {
            var newArgs = Array.prototype.slice.call(arguments);

            this.data.values = this.data.values.concat(newArgs);

            return this;
        };
        
        this.null = function()
        {
            var a;
            var found = false;

            for (a=0; a<this.data.values.length && !found; a++)
            {
                if (   this.data.values[a] !== undefined
                    && this.data.values[a] !== null)
                {
                    found = true;
                }
            }

            this.data.errors.found = found;
            this.data.errors.condition = utils.CONDITIONS.NULL;
            this.data.errors.faulty = a;

            return this;
        };

        this.notnull = function()
        {
            var a;
            var found = false;

            for (a=0; a<this.data.values.length && !found; a++)
            {
                if (   this.data.values[a] === undefined
                    || this.data.values[a] === null)
                {
                    found = true;
                }
            }

            this.data.errors.found = found;
            this.data.errors.condition = utils.CONDITIONS.NOT_NULL;
            this.data.errors.faulty = a;

            return this;
        };

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
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(CheckVerbObject, Fluent);


module.exports = CheckVerbObject;
