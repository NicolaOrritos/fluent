
'use strict';

var utils               = require('./utils');
var helpers             = require('./helpers');
var FromVerbObject      = require('./verbs/from');
var CheckVerbObject     = require('./verbs/check');
var BundleVerbObject    = require('./verbs/bundle');
var ProtectVerbObject   = require('./verbs/protect');
var ConstrainVerbObject = require('./verbs/constrain');


var fluent = function()
{
    /* NO short-circuit evaluation here
     */
    this.check = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return CheckVerbObject.internal(args);
    };
    
    /* Short-circuit evaluation here
     */
    this.notnull = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return CheckVerbObject.internal(args, utils.CONDITIONS.NOT_NULL);
    };
    
    this.from = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return FromVerbObject.internal(args);
    };
    
    this.bundle = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return BundleVerbObject.internal(args);
    };
    
    this.constrain = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return ConstrainVerbObject.internal(args);
    };
    
    this.protect = function()
    {
        var args = Array.prototype.slice.call(arguments);
        
        return ProtectVerbObject.internal(args);
    };
    
    this.$ = helpers;
};


module.exports = new fluent();
