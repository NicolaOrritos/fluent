
'use strict';


var Utils = function()
{
    let self = this;

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

    this.isNotNull = function(val)
    {
        return (val !== undefined && val !== null);
    };

    this.notNull = this.isNotNull;

    this.isArray = function(val)
    {
        if (Array.isArray)
        {
            return Array.isArray(val);
        }
        else
        {
            return (val && val.constructor === Array);
        }
    };

    this.isObject = function(val)
    {
        let result = false;

        if (val !== null && !this.isArray(val))
        {
            result = (typeof val === 'object');
        }

        return result;
    };

    this.isString = function(val)
    {
        let result = false;

        if (val !== undefined && val !== null)
        {
            result = (typeof val === 'string' || val instanceof String);
        }

        return result;
    };

    this.isFunction = function(val)
    {
        let result = false;

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
        let result = [];

        if (data && this.isArray(data))
        {
            for (let a=0; a<data.length; a++)
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
        let result = false;

        if (condition && data)
        {
            if (this.isObject(condition))
            {
                for (let property in condition)
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
                let ok = function()
                {
                    return true;
                };

                let not_ok = function()
                {
                    return false;
                };

                result = condition.call(this, data, ok, not_ok);
            }
            else if (this.isRegExp(condition) && data.match)
            {
                result = data.match(condition);
            }
            else if (this.isNumber(condition))
            {
                result = (condition === data);
            }
        }

        return result;
    };

    this.callbacks =
    {
        otherwiseCallback: function()
        {
            let msg = this.data.errors.throwsMessage || ('Item #' + this.data.errors.faulty + ' wasn\'t valid');
            let err = new Error(msg);

            if (this.data.errors.throws)
            {
                throw err;
            }
            else if (this.data.callbacks.otherwise && self.isFunction(this.data.callbacks.otherwise) && !this.data.callbacks.called.otherwise)
            {
                this.data.callbacks.otherwise.call(this, err, this.data.errors.faulty);

                this.data.callbacks.called.otherwise = true;

                // Delete the callback to prevent double calls:
                delete this.data.callbacks.otherwise;
            }
        },

        validCallback: function()
        {
            if (this.data.callbacks.valid && self.isFunction(this.data.callbacks.valid) && !this.data.callbacks.called.valid)
            {
                this.data.callbacks.valid.call(this);

                this.data.callbacks.called.valid = true;

                // Delete the callback to prevent double calls:
                delete this.data.callbacks.valid;
            }
        },

        otherwiseOrValid: function(otherwiseCb, validCb)
        {
            otherwiseCb = otherwiseCb || self.callbacks.otherwiseCallback;
            validCb     = validCb     || self.callbacks.validCallback;

            if (this.data.errors.found)
            {
                otherwiseCb.call(this);
            }
            else
            {
                validCb.call(this);
            }
        }
    };
};


module.exports = new Utils();
