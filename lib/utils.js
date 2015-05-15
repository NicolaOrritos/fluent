
'use strict';


var Utils = function()
{
    var self = this;
    
    this.OPERATIONS =
    {
        CHECK:     1,
        FROM:      2,
        BUNDLE:    3,
        CONSTRAIN: 4,
        CALL:      5,
        PROTECT:   6
    };

    this.CONDITIONS =
    {
        NOT_NULL:       1,
        NULL:           2,
        NOT_A_FUNCTION: 3,
        ERROR_THROWN:   4
    };
    
    this.isNull = function(val)
    {
        return (val === undefined || val === null);
    };

    this.isArray = function(val)
    {
        return (val && val.constructor === Array);
    };

    this.isObject = function(val)
    {
        var result = false;

        if (val !== null && !this.isArray(val))
        {
            result = (typeof val === 'object');
        }

        return result;
    };

    this.isString = function(val)
    {
        var result = false;

        if (val !== undefined && val !== null)
        {
            result = (typeof val === 'string' || val instanceof String);
        }

        return result;
    };

    this.isFunction = function(val)
    {
        var result = false;

        if (val !== null)
        {
            result = (typeof val === 'function');
        }

        return result;
    };

    this.isNumber = function(val)
    {
        return (!isNaN(val));
    };

    this.isRegExp = function(val)
    {
        return (val instanceof RegExp);
    };

    this.inherits = function(ctor, superCtor)
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

    this.bundleAllData = function(data)
    {
        var result = [];

        if (data && this.isArray(data))
        {
            for (var a=0; a<data.length; a++)
            {
                if (this.isArray(data[a]))
                {
                    result = result.concat(data[a]);
                }
                else if (data[a] !== undefined && data[a] !== null
                         && !this.isFunction(data[a]))
                {
                    result.push(data[a]);
                }
            }
        }

        return result;
    };

    this.holds = function(condition, data)
    {
        var result = false;

        if (condition && data)
        {
            if (this.isObject(condition))
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
            else if (this.isFunction(condition))
            {
                var ok = function()
                {
                    return true;
                };

                var not_ok = function()
                {
                    return false;
                };

                result = condition.call(this, data, ok, not_ok);
            }
            else if (this.isRegExp(condition) && data.match)
            {
                result = data.match(condition);
            }

        }

        return result;
    };
    
    this.callbacks =
    {
        otherwiseCallback: function()
        {
            var msg = 'Item #' + this.data.errors.faulty + ' wasn\'t valid';
            var err = new Error(msg);

            if (this.data.errors.throws)
            {
                throw err;
            }
            else if (this.data.callbacks.otherwise && self.isFunction(this.data.callbacks.otherwise))
            {
                this.data.callbacks.otherwise.call(this, err, this.data.errors.faulty);

                // Delete the callback to prevent double calls:
                delete this.data.callbacks.otherwise;
            }
        },

        validCallback: function()
        {
            if (this.data.callbacks.valid && self.isFunction(this.data.callbacks.valid))
            {
                this.data.callbacks.valid.call(this);

                // Delete the callback to prevent double calls:
                delete this.data.callbacks.valid;
            }
        },

        otherwiseOrValid: function(otherwiseCallback, validCallback)
        {
            otherwiseCallback = otherwiseCallback || self.callbacks.otherwiseCallback;
            validCallback     = validCallback     || self.callbacks.validCallback;
            
            if (this.data.errors.found)
            {
                otherwiseCallback.call(this);
            }
            else
            {
                validCallback.call(this);
            }
        }
    };
};


module.exports = new Utils();
