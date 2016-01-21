
'use strict';

let utils               = require('./utils');
let helpers             = require('./helpers');
let FromVerbObject      = require('./verbs/from');
let CheckVerbObject     = require('./verbs/check');
let BundleVerbObject    = require('./verbs/bundle');
let ProtectVerbObject   = require('./verbs/protect');
let ConstrainVerbObject = require('./verbs/constrain');


var fluent = function()
{
    /* NO short-circuit evaluation here
     */
    this.check = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return CheckVerbObject.internal(args);
    };

    /* Short-circuit evaluation here
     */
    this.notnull = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return CheckVerbObject.internal(args, utils.CONDITIONS.NOT_NULL);
    };

    this.from = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return FromVerbObject.internal(args);
    };

    this.bundle = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return BundleVerbObject.internal(args);
    };

    this.constrain = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return ConstrainVerbObject.internal(args);
    };

    this.protect = function()
    {
        let args = Array.prototype.slice.call(arguments);

        return ProtectVerbObject.internal(args);
    };

    this.$ = helpers;
};


module.exports = new fluent();
