#!/usr/bin/node

'use strict';

var fluent = require('./lib/main.js');


// Some example data:
var val1 = 'val1';

var obj = {};

obj.array = [
    {prop1: val1, pos: 'first'},
    {prop1: null},
    {prop1: val1, pos: 'third'},
    {prop1: val1, pos: 'fourth'}
];

var testCount = 1;


/* if (obj && obj.array)
{
    for (var item in obj.array)
    {
        if (item.prop1 === val1)
        {
            result = item.value;
        }
    }
} */

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.check(obj).and(obj.array).and(undefined).notnull()
.then(function()
{
    console.log('Everything\'s OK');
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.check(null).and(undefined).null()
.then(function()
{
    console.log('Everything\'s OK');
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.then(function(item, stop)
{
    console.log('item: %s', JSON.stringify(item));

    stop(); // eventually decide to
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.otherwise(function(err)
{
    console.log(err);
})
.then(function(item, stop)
{
    console.log('item: %s', JSON.stringify(item));

    stop(); // eventually decide to
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.then(function(item /*, stop */)
{
    console.log('item: %s', JSON.stringify(item));

    // stop(); // eventually decide not to
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.all(function(all)
{
    console.log('items: %s', JSON.stringify(all));
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.first(function(item)
{
    console.log('first: %s', JSON.stringify(item));
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from(obj.array)
.where({prop1: val1})
.last(function(item)
{
    console.log('last: %s', JSON.stringify(item));
})
.otherwise(function(err)
{
    console.log(err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.check(obj).and(obj.array).notnull()
.then(fluent.from(obj.array)
      .where(function(item, ok, not_ok)
      {
          if (item.prop1 === val1)
          {
              return ok();
          }
          else
          {
              return not_ok();
          }
      })
      .then(function(item, stop)
      {
          console.log('item: %s', JSON.stringify(item));
    
          stop();
      })
      .otherwise(function(err)
      {
          console.log('%s', err);
      }))
.otherwise(function(err)
{
    console.log('%s', err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.bundle(obj, 'hola', [], [1])
.then(function(result)
{
    console.log('result: %s', JSON.stringify(result));
})
.otherwise(function(err)
{
    console.log('%s', err);
});


