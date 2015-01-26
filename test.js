#!/usr/bin/node

'use strict';

var fluent = require('./lib/fluent.js');


// Some example data:
var val1 = 'val1';

var obj = {};

obj.array = [
    {prop1: val1, pos: 'first'},
    {prop1: null},
    {prop1: val1, pos: 'third'},
    {prop1: val1, pos: 'fourth'}
];

var result;


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


fluent.check(obj).and(obj.array).and(undefined).notnull()
.then(function()
{
    console.log('Everything\'s OK');
})
.otherwise(function(err)
{
    console.log(err);
});

fluent.check(null).and(undefined).null()
.then(function()
{
    console.log('Everything\'s OK');
})
.otherwise(function(err)
{
    console.log(err);
});


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

fluent.from(obj.array)
.where({prop1: val1})
.then(function(item, stop)
{
    console.log('item: %s', JSON.stringify(item));

    // stop(); // eventually decide not to
})
.otherwise(function(err)
{
    console.log(err);
});

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


/* fluent.from(obj.array)
.where({prop1: val1})
.then(function(item, stop)
{
    result = item.value;

    stop(); // eventually decide to
})
.otherwise(function(err)
{
    console.log(err);
});

fluent.check(obj).and(obj.array).notnull()
.then(fluent.from(obj.array)
      .where(function(item, index, ok, not_ok)
      {
          if (item.prop1 === val1)
          {
              ok();
          }
          else
          {
              not_ok();
          }
      })
      .then(function(item, next, stop)
      {
          result = item.value;
    
          next();
          // or
          stop();
      }))
.catch(function(err)
{
    console.log('%s', err);
}); */


