
'use strict';

var utils               = require('./utils');
var helpers             = require('./helpers');
var FromVerbObject      = require('./verbs/from');
var CheckVerbObject     = require('./verbs/check');
var BundleVerbObject    = require('./verbs/bundle');
var ProtectVerbObject   = require('./verbs/protect');
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
    
    protect: function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return new ProtectVerbObject(args);
    },
    
    $: helpers
};
