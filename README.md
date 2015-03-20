# fluent
Fluent Javascript Flows

Fluent is my personal attempt at simplifying and making more readable Javascript control flow, by using methods and chaining.


## Installation
[Coming soon...]


## Usage
``` js
var fluent = require('f.luent');

// ...

fluent.from(array)
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
