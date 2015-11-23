#!/usr/bin/env node

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
    throw new Error('Test failed. Not recognized error in parameter.');
})
.otherwise(function(err)
{
    console.log('Everything\'s OK. %s', err);
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

fluent.notnull(obj, obj.array)
.otherwise(function(err)
{
    console.log('%s', err);
})
.then(function()
{
    console.log('Everything\'s OK');
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.notnull(obj, null)
.otherwise(function()
{
    console.log('Everything\'s OK');
})
.then(function()
{
    console.log('Test failed. One parameter was null');
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

fluent.from([])
.where({prop1: val1})
.then(function()
{
    throw new Error('Should have been empty');
})
.otherwise(function(err)
{
    throw new Error('Should have been recognized as empty. Raised an error instead. ' + err);
})
.empty(function()
{
    console.log('Everything\'s OK');
});

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.from([])
.where({prop1: val1})
.then(function()
{
    throw new Error('Should have been empty');
})
.empty(function()
{
    console.log('Everything\'s OK');
})
.otherwise(function(err)
{
    throw new Error('Should have been recognized as empty. Raised an error instead. ' + err);
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

var matching = fluent.from(obj.array)
.where({prop1: val1})
.all();

if (matching && matching.length === 3)
{
    console.log('Everything\'s OK. (Matching: "%s")', JSON.stringify(matching));
}
else
{
    throw new Error('"All + Where" combination gave up. Faulty value returned: ' + JSON.stringify(matching));
}

console.log('-------');
console.log('TEST #%s', testCount++);

var matching = fluent.from([4, 4, 4, 4, 5, 3, 2, 1, 0, null, 5, 7, 5, 9])
.where(4)
.all();

if (matching && matching.length === 4 && matching[0] === 0 && matching[1] === 1 && matching[2] === 2 && matching[3] === 3)
{
    console.log('Everything\'s OK. (Matching: "%s")', JSON.stringify(matching));
}
else
{
    throw new Error('"All + Where" combination for simple arrays gave up. Faulty value returned: ' + JSON.stringify(matching));
}

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

console.log('-------');
console.log('TEST #%s', testCount++);

var arr = [1, 2];

fluent.constrain(arr).array().throws()
.valid(function()
{
    console.log('Everything\'s OK');
});

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe(arg1, arg2, arg3)
{
    fluent.constrain(arg1, arg2, arg3).notnull()
    .valid(function()
    {
        console.log('Everything\'s OK');
    })
    .otherwise(function(err)
    {
        console.log('%s', err);
    });
}

callMeMaybe('boooh', '', {});

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe1bis(arg1, arg2, arg3)
{
    fluent.constrain([arg1, arg2, arg3]).notnull()
    .valid(function()
    {
        console.log('Everything\'s OK');
    })
    .otherwise(function(err)
    {
        console.log('%s', err);
    });
}

callMeMaybe1bis('boooh', '', {});

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe2(arg1, arg2, arg3)
{
    fluent.constrain(arg1, arg2, arg3).notnull()
    .throws()
    .valid(function()
    {
        console.log('Everything\'s OK');
    });
}

// callMeMaybe2('boooh');  // This one throws
callMeMaybe2(0, 1, 2);  // This one doesn't throw

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe3(arg1, arg2)
{
    fluent.constrain(arg1, arg2).objects()
    .throws()
    .valid(function()
    {
        console.log('Everything\'s OK');
    });
}

callMeMaybe3(obj, {});

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe4(arg1, arg2, arg3)
{
    fluent.constrain(arg1, arg2).objects()
    .constrain(arg3).notnull()
    .throws()
    .valid(function()
    {
        console.log('Everything\'s OK');
    });
}

callMeMaybe4(obj, {}, '');

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe5(arg1, arg2, arg3)
{
    fluent.constrain(arg1, arg2).strings()
    .constrain(arg3).number()
    .throws()
    .valid(function()
    {
        console.log('Everything\'s OK');
    });
}

callMeMaybe5('', 'hello world', 42);

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe6(arg1)
{
    fluent.constrain(arg1).string()
    .valid(function()
    {
        throw new Error('Shouldn\'t have validated');
    })
    .otherwise(function(err)
    {
        console.log('Everything\'s OK (1). %s', err);
    });

    try
    {
        fluent.constrain(arg1).string().throws('Bad boy');
    }
    catch(err)
    {
        if (err.message === 'Bad boy')
        {
            console.log('Everything\'s OK (2). %s', err);
        }
        else
        {
            throw new Error('Throws didn\'t took custom message');
        }
    }
}

callMeMaybe6(42);

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe7(arg1, arg2)
{
    fluent.constrain(arg1, arg2).arrays()
    .throws()
    .valid(function()
    {
        console.log('Everything\'s OK');
    });
}

callMeMaybe7([], [1, 2, 3]);

console.log('-------');
console.log('TEST #%s', testCount++);

function callMeMaybe8(arg1, arg2)
{
    fluent.constrain(arg1, arg2).arrays()
    .valid(function()
    {
        throw new Error('Should not have validated. Arg1: "' + arg1 + '", arg2: "' + arg2 + '"');
    })
    .otherwise(function(err)
    {
        console.log('Everything\'s OK. %s', err);
    });
}

callMeMaybe8('Ain\'t no array', [1, 2, 3]);


console.log('-------');
console.log('TEST #%s', testCount++);

var called = false;

fluent.protect(function()
{
    console.log('Everything\'s OK.');

    called = true;
})
.catch(function(err)
{
    throw new Error('Test failed. ' + err);
});

if (!called)
{
    throw new Error('Test failed. Function wasn\'t called.');
}

console.log('-------');
console.log('TEST #%s', testCount++);

var result = fluent.protect(function(param1, param2)
{
    if (   param1 === 'param1'
        && param2 === 'param2')
    {
        console.log('Got parameters right');

        return param1 + param2;
    }
    else
    {
        throw new Error('Test failed. Parameters mismatch: ' + param1 + ', ' + param2);
    }
})
.pass('param1', 'param2')
.catch(function(err)
{
    throw new Error('Test failed. ' + err);
})
.return();

if (result === 'param1param2')
{
    console.log('Everything\'s OK');
}
else
{
    throw new Error('Test failed. Result mismatch: ' + result);
}

console.log('-------');
console.log('TEST #%s', testCount++);

fluent.protect(function(param1, param2)
{
    throw new Error('Test failed. Shouldn\'t have entered here. Parameters were: ' + param1 + ', ' + param2);
})
.pass('param1', undefined)
.catch(function(err)
{
    console.log('Everything\'s OK. ' + err);
});

console.log('-------');
console.log('TEST #%s', testCount++);

var result = fluent.protect(function(param1, param2)
{
    throw new Error('Test failed. Shouldn\'t have entered here. Parameters were: ' + param1 + ', ' + param2);
})
.pass('param1', undefined)
.catch(function(err)
{
    console.log('Everything\'s OK (1). ' + err);
})
.return();

if (result === undefined || result === null)
{
    console.log('Everything\'s OK (2)');
}
else
{
    throw new Error('Test failed. Result mismatch: ' + result);
}
