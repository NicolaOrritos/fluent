
'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


function LastVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.LAST, args);

    this.data.last    = args[0];
    this.data.started = Date.now();


    var self = this;

    var finish = function()
    {
        if (self.data.aggressive && self.data.isMax)
        {
            clearTimeout(self.data.aggressive);

            if (self.data.callbacks.then)
            {
                self.data.callbacks.then.call();
            }
        }
        else if (self.data.aggressive && self.data.isMin)
        {
            clearTimeout(self.data.aggressive);

            // Everything went OK
        }
        else
        {
            var out = false;

            self.data.finished = Date.now();

            if (self.data.isMax && self.data.finished > self.data.started + self.data.last)
            {
                out = true;
            }

            if (self.data.isMin && self.data.finished < self.data.started + self.data.last)
            {
                out = true;
            }

            if (out)
            {
                if (self.data.callbacks.otherwise)
                {
                    self.data.callbacks.otherwise.call();
                }
                else
                {
                    throw new Error('Time requirements weren\'t met');
                }
            }
            else
            {
                if (self.data.callbacks.then)
                {
                    self.data.callbacks.then.call();
                }
            }
        }
    };

    var timedOut = function()
    {
        delete self.data.aggressive;

        finish();
    };


    this.then = function(cb)
    {
        if (cb && utils.isFunction(cb))
        {
            this.data.callbacks.then = cb;
        }

        return this;
    };

    this.otherwise = function(cb)
    {
        if (cb && utils.isFunction(cb))
        {
            this.data.callbacks.otherwise = cb;
        }

        return finish;
    };

    this.min = function()
    {
        this.data.isMin = true;
        this.data.isMax = false;

        return this;
    };

    this.max = function()
    {
        this.data.isMin = false;
        this.data.isMax = true;

        return this;
    };

    this.aggressive = function()
    {
        this.data.aggressive = setTimeout(timedOut, this.data.last);

        return this;
    };
}

utils.inherits(LastVerbObject, Fluent);

LastVerbObject.internal = function(args)
{
    return new LastVerbObject(args);
};


module.exports = LastVerbObject;
