# f.luent
Zero-dependencies Fluent Javascript Control Flow

Fluent is my personal attempt at simplifying and making more readable the control flow of a Javascript program, by only using methods and exploiting chaining whenever it's possible.


## Installation
```Bash
npm install f.luent
```


## Example Usage
``` js
var f = require('f.luent');

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
