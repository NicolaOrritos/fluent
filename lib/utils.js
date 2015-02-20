
'use strict';


module.exports =
{
    OPERATIONS:
    {
        CHECK:     1,
        FROM:      2,
        BUNDLE:    3,
        CONSTRAIN: 4,
        CALL:      5
    },

    CONDITIONS:
    {
        NOT_NULL:       1,
        NULL:           2,
        NOT_A_FUNCTION: 3,
        ERROR_THROWN:   4
    },
    
    isNull: function(val)
    {
        return (val === undefined || val === null);
    },

    isArray: function(val)
    {
        return (val && val.constructor === Array);
    },

    isObject: function(val)
    {
        var result = false;

        if (val !== null && !this.isArray(val))
        {
            result = (typeof val === 'object');
        }

        return result;
    },

    isFunction: function(val)
    {
        var result = false;

        if (val !== null)
        {
            result = (typeof val === 'function');
        }

        return result;
    },

    isNumber: function(val)
    {
        return (!isNaN(val));
    },

    isRegExp: function(val)
    {
        return (val instanceof RegExp);
    },

    inherits: function(ctor, superCtor)
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
    },

    bundleAllData: function(data)
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
    },

    holds: function(condition, data)
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
    }
};
