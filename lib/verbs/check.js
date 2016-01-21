'use strict';

let Fluent = require('./fluent');
let utils  = require('../utils');


function CheckVerbObject(args, condition)
{
    Fluent.call(this, utils.OPERATIONS.CHECK, args);

    this.data.values = args;

    if (this.data.values)
    {
        this.and = function()
        {
            let newArgs = Array.prototype.slice.call(arguments);

            this.data.values = this.data.values.concat(newArgs);

            return this;
        };

        this.null = function()
        {
            let a;
            let found = false;

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
            let a;
            let found = false;

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

            utils.callbacks.otherwiseOrValid.call(this);

            return this;
        };

        this.then = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.valid = cb;
            }

            utils.callbacks.otherwiseOrValid.call(this);

            return this;
        };

        if (condition === utils.CONDITIONS.NULL)
        {
            this.null();
        }
        else if (condition === utils.CONDITIONS.NOT_NULL)
        {
            this.notnull();
        }
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

utils.inherits(CheckVerbObject, Fluent);

CheckVerbObject.internal = function(args, condition)
{
    return new CheckVerbObject(args, condition);
};


module.exports = CheckVerbObject;
