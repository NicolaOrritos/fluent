
'use strict';


var OPERATIONS =
{
    CHECK: 1,
    FROM:  2
};

var CONDITIONS =
{
    NOT_NULL: 1,
    NULL:     2
};


function isArray(val)
{
    return (val && val.constructor === Array);
}

function isObject(val)
{
    var result = false;
    
    if (val !== null)
    {
        result = (typeof val === 'object');
    }
    
    return result;
}

function isFunction(val)
{
    var result = false;
    
    if (val !== null)
    {
        result = (typeof val === 'function');
    }
    
    return result;
}

function isNumber(val)
{
    return (!isNaN(val));
}

function isRegExp(val)
{
    return (val instanceof RegExp);
}

var inherits = function(ctor, superCtor)
{
    ctor.super_ = superCtor;
    
    ctor.prototype = Object.create(superCtor.prototype,
    {
        constructor:
        {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

var bundleAllData = function(data)
{
    var result = [];
    
    if (data && isArray(data))
    {
        for (var a=0; a<data.length; a++)
        {
            if (isArray(data[a]))
            {
                result = result.concat(data[a]);
            }
            else if (data[a] !== undefined && data[a] !== null
                     && !isFunction(data[a]))
            {
                result.push(data[a]);
            }
        }
    }
    
    return result;
};

var holds = function(condition, data)
{
    var result = false;
    
    if (condition && data)
    {
        if (isObject(condition))
        {
            for (var property in condition)
            {
                if (condition[property] === data[property])
                {
                    result = true;
                }
                else
                {
                    result = false;
                    
                    break;
                }
            }
        }
        else if (isFunction(condition))
        {
            result = condition.call(this, data);
        }
        else if (isRegExp(condition) && data.match)
        {
            result = data.match(condition);
        }
            
    }
    
    return result;
};


var otherwiseCallback = function()
{
    if (this.data.callbacks.otherwise && isFunction(this.data.callbacks.otherwise))
    {
        var msg;

        if (this.data.errors.condition === CONDITIONS.NOT_NULL)
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
    if (this.data.callbacks.then && isFunction(this.data.callbacks.then))
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


var runWhere = function()
{
    this.data.found = [];

    for (var a=0; a<this.data.values.length; a++)
    {
        if (holds(this.data.condition, this.data.values[a]))
        {
            this.data.found.push(this.data.values[a]);
        }
    }

    this.data.errors.found = (this.data.found.length === 0);

    // Enable "chaining" of data, too:
    this.data.values = this.data.found;
};


function Fluent(operation, args)
{
    var op = operation;
    
    if (op && isNumber(op) && isArray(args))
    {
        this.data = {};
        this.data.errors = {};
        this.data.callbacks = {};
    }
    else
    {
        throw new Error('Missing operation');
    }
}


function CheckVerbObject(args)
{
    Fluent.call(this, OPERATIONS.CHECK, args);
    
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
            this.data.errors.condition = CONDITIONS.NULL;
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
            this.data.errors.condition = CONDITIONS.NOT_NULL;
            this.data.errors.faulty = a;

            return this;
        };

        this.otherwise = function(cb)
        {
            if (cb && isFunction(cb))
            {
                this.data.callbacks.otherwise = cb;
            }

            otherwiseOrThen.call(this);

            return this;
        };

        this.then = function(cb)
        {
            if (cb && isFunction(cb))
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

inherits(CheckVerbObject, Fluent);


function FromVerbObject(args)
{
    Fluent.call(this, OPERATIONS.FROM, args);
    
    this.data.values = bundleAllData(args);

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
            if (cb && isFunction(cb))
            {
                var stop = false;
                
                runWhere.call(this);
                
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
            
            return this;
        };
        
        this.all = function(cb)
        {
            if (cb && isFunction(cb))
            {
                runWhere.call(this);
                
                if (this.data.found.length)
                {
                    cb.call(this, this.data.found);
                }
            }
            
            return this;
        };
        
        this.first = function(cb)
        {
            if (cb && isFunction(cb))
            {
                runWhere.call(this);
                
                if (this.data.found.length)
                {
                    cb.call(this, this.data.found[0]);
                }
            }
            
            return this;
        };
        
        this.last = function(cb)
        {
            if (cb && isFunction(cb))
            {
                runWhere.call(this);
                
                if (this.data.found.length)
                {
                    cb.call(this, this.data.found[this.data.found.length - 1]);
                }
            }
            
            return this;
        };
        
        this.otherwise = function(cb)
        {
            if (cb && isFunction(cb))
            {
                if (this.data.errors.found)
                {
                    cb.call(this, new Error('Nothing found'));
                }
            }
            
            return this;
        };
    }
    else
    {
        throw new Error('Missing item to be checked');
    }
}

inherits(FromVerbObject, Fluent);


module.exports =
{
    /* No short-circuit evaluation here
     */
    check: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new CheckVerbObject(args);
    },
    
    from: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new FromVerbObject(args);
    }
};
