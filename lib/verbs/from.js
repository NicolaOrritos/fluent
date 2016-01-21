
'use strict';

let Fluent = require('./fluent');
let utils  = require('../utils');


/**
# "From" Verb

## Example Usage
Here is an example of the _from_ verb used to select from an array values matching some given criteria.
Let's say we want to select items with a property named "prop1", with a value (strictly) equal to "val1":
``` js
let f = require('f.luent');

// ...

f.from(array)
.where({prop1: 'val1'})
.then(function(item, stop)
{
 console.log('item: %s', JSON.stringify(item));

 stop(); // eventually decide to stop processing results
})
.otherwise(function(err)
{
 console.log(err);
});

```

We may want the results returned as an array:
``` js
let result = f.from(array).where({prop1: 'val1'}).all();

// matching => [{prop1: val1, pos: 'first'}, {prop1: val1, pos: 'third'},
{prop1: val1, pos: 'fourth'}]
```

Or we would like to get all indexes of the '4' number from a numeric array, like this:
``` js
let matching = f.from([4, 4, 4, 4, 5, 3, 2, 1, 0, null, 5, 7, 5, 9])
.where(4)
.all();

// matching => [0, 1, 2, 3]
```

## "From" Verb Components
### Selecting The Verb
Basically, every _From_ verb starts with the `from(...)` call, like this: `f.from(...)` (given that "f" is an instance of the "f.luent" module).
The from verb works on arrays, hence an array must be passed to it, like this:
``` js
f.from([4, 1, 5, 9]);
```
It returns a `FromVerbObject` instance.

### "Where" Clause
After feeding our data to f.luent the _"where(...)"_ clause is applied, containing criteria to filter the data of the given array.
Now your code starts to look like this: `f.from(...).where(...)`.

### Picking Results
Finally, the way results are returned can be chosen, by either using one of the following:
- the _"all()"_ clause returns an array of the items matching the given criteria
- the _"first()"_ clause returns the first matching item
- the _"last()"_ clause returns the last matching item
- the _"then()"_ clause makes possible iterating the results, like this:
``` js
f.from(array)
.where({prop1: val1})
.then(function(item, stop)
{
 console.log('item: %s', JSON.stringify(item));

 stop(); // eventually decide to stop iterating the results
})
```
*/

// Avoid picking the "runWhere" function as documentation header

let runWhere = function()
{
    for (let a=0; a<this.data.values.length; a++)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            if (utils.isNumber(this.data.condition))
            {
                // Push the index of the array instead of the value:
                this.data.found.push(a);
            }
            else
            {
                this.data.found.push(this.data.values[a]);
            }
        }
    }

    this.data.errors.found = (this.data.found.length === 0);

    // Enable "chaining" of data, too:
    this.data.values = this.data.found;
};

let runWhere_first = function()
{
    let result;

    let found = false;

    for (let a=0; a<this.data.values.length && !found; a++)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            if (utils.isNumber(this.data.condition))
            {
                // Return the index of the array instead of the value:
                result = a;
            }
            else
            {
                result = this.data.values[a];
            }

            found = true;
        }
    }

    this.data.errors.found = (found === false);

    // No "chaining" of data, here

    return result;
};

let runWhere_last = function()
{
    let result;

    let found = false;

    for (let a=this.data.values.length - 1; a>0 && !found; a--)
    {
        if (utils.holds(this.data.condition, this.data.values[a]))
        {
            if (utils.isNumber(this.data.condition))
            {
                // Return the index of the array instead of the value:
                result = a;
            }
            else
            {
                result = this.data.values[a];
            }

            found = true;
        }
    }

    this.data.errors.found = (found === false);

    // No "chaining" of data, here

    return result;
};


/**
 * Reference
 * =========
 */

/**
 * Creates a new _From_ verb instance, initialized with an array
 *
 * @param {Array} args Takes an array that will be stored into this _From_ verb instance for later processing.
 */
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
                let stop = false;

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

                return this;
            }
            else
            {
                // Simply return the items found:
                runWhere.call(this);

                let matching = [];

                if (this.data.found.length)
                {
                    matching = this.data.found;
                }

                return matching;
            }
        };

        this.first = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                let result = runWhere_first.call(this);

                if (result)
                {
                    cb.call(this, result);
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }

                return this;
            }
            else
            {
                // Simply return the item found:
                return runWhere_first.call(this);
            }
        };

        this.last = function(cb)
        {
            if (cb && utils.isFunction(cb))
            {
                let result = runWhere_last.call(this);

                if (result)
                {
                    cb.call(this, result);
                }
                else if (this.data.callbacks.otherwise && !this.data.errors.empty)
                {
                    this.data.callbacks.otherwise.call(this, new Error('Nothing found'));
                }

                return this;
            }
            else
            {
                // Simply return the item found:
                return runWhere_last.call(this);
            }
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

FromVerbObject.internal = function(args)
{
    return new FromVerbObject(args);
};


module.exports = FromVerbObject;
