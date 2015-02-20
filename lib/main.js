
'use strict';

var utils               = require('./utils');
var CallVerbObject      = require('./verbs/call');
var FromVerbObject      = require('./verbs/from');
var CheckVerbObject     = require('./verbs/check');
var BundleVerbObject    = require('./verbs/bundle');
var ConstrainVerbObject = require('./verbs/constrain');


module.exports =
{
    /* NO short-circuit evaluation here
     */
    check: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new CheckVerbObject(args);
    },
    
    /* Short-circuit evaluation here
     */
    notnull: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new CheckVerbObject(args, utils.CONDITIONS.NOT_NULL);
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
    },
    
    constrain: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new ConstrainVerbObject(args);
    },
    
    call: function(fn)
    {
        var args = fn ? [fn] : [];
        
        return new CallVerbObject(args);
    }
};
