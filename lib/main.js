
'use strict';

var CheckVerbObject  = require('./verbs/check');
var FromVerbObject   = require('./verbs/from');
var BundleVerbObject = require('./verbs/bundle');


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
    },
    
    bundle: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new BundleVerbObject(args);
    }
};
