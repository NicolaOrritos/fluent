
'use strict';

var Fluent = require('./fluent');
var utils  = require('../utils');


var runWhere = function()
{
    for (var a=0; a<this.data.values.length; a++)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            this.data.found.push(this.data.values[a]);
        }
    }

    this.data.errors.found = (this.data.found.length === 0);

    // Enable "chaining" of data, too:
    this.data.values = this.data.found;
};

var runWhere_first = function()
{
    var result;

    var found = false;

    for (var a=0; a<this.data.values.length && !found; a++)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            result = this.data.values[a];

            found = true;
        }
    }

    this.data.errors.found = (found === false);

    // No "chaining" of data, here

    return result;
};

var runWhere_last = function()
{
    var result;

    var found = false;

    for (var a=this.data.values.length - 1; a>0 && !found; a--)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            result = this.data.values[a];

            found = true;
        }
    }

    this.data.errors.found = (found === false);

    // No "chaining" of data, here

    return result;
};


function FromVerbObject(args)
{
    Fluent.call(this, utils.OPERATIONS.FROM, args);
    
    this.data.found  = [];
    this.data.values = utils.bundleAllData(args);

    if (this.data.values)
    {
        this.where = function(condition)
        {
            if (condition)
            {
                this.data.condition = condition;
            }
            else
            {
                throw new Error('No condition provided');
            }
            
            return this;
        };
        
        this.then = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                var stop = false;
                
                runWhere.call(this);
                
                if (this.data.found.length)
                {
                    this.data.found.forEach(function(item)
                    {
                        if (!stop)
                        {
                            cb.call(this, item, function()
                            {
                                stop = true;
                            });
                        }
                    });
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        this.all = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                runWhere.call(this);
                
                if (this.data.found.length)
                {
                    cb.call(this, this.data.found);
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        this.first = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                var result = runWhere_first.call(this);
                
                if (result)
                {
                    cb.call(this, result);
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        this.last = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                var result = runWhere_last.call(this);
                
                if (result)
                {
                    cb.call(this, result);
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        this.otherwise = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
                
                if (this.data.errors.found && !this.data.errors.empty)
                {
                    cb.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        this.empty = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                this.data.callbacks.empty = cb;
                
                if (this.data.errors.found && this.data.errors.empty)
                {
                    cb.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
        
        if (this.data.values.length === 0)
        {
            this.data.errors.empty = true;
            
            if (utils.isFunction(this.data.callbacks.empty))
            {
                this.data.callbacks.empty.call(this);
            }
        }
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}


utils.inherits(FromVerbObject, Fluent);


module.exports = FromVerbObject;
