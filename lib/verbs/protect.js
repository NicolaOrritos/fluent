'use strict';

let Fluent = require('./fluent');
let utils  = require('../utils');


let ensureCall = function(thisArg, args)
{
    if (thisArg.data.executed !== true && thisArg.data.values[0] && thisArg.data.errors.found !== true)
    {
        let scope = thisArg.data.scope || thisArg;
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
            let list = Array.prototype.slice.call(arguments);

            let a;
            let found = false;

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

            utils.callbacks.otherwiseOrValid.call(this, utils.callbacks.otherwiseCallback, function() {});

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
            let result;

            if (this.data.errors.found !== true)
            {
                ensureCall(this);

                if (this.data.result)
                {
                    result = this.data.result;
                }
                else if (this.data.callbacks.otherwise)
                {
                    utils.callbacks.otherwiseOrValid.call(this, utils.callbacks.otherwiseCallback, function() {});
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

ProtectVerbObject.internal = function(args)
{
    return new ProtectVerbObject(args);
};


module.exports = ProtectVerbObject;
