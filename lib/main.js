
'use strict';

const utils               = require('./utils');
const helpers             = require('./helpers');
const FromVerbObject      = require('./verbs/from');
const CheckVerbObject     = require('./verbs/check');
const BundleVerbObject    = require('./verbs/bundle');
const ProtectVerbObject   = require('./verbs/protect');
const ConstrainVerbObject = require('./verbs/constrain');
const SanitizeVerbObject  = require('./verbs/sanitize');


module.exports =
{
    /* NO short-circuit evaluation here
     */
    check: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return CheckVerbObject.internal(args);
    },

    /* Short-circuit evaluation here
     */
    notnull: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return CheckVerbObject.internal(args, utils.CONDITIONS.NOT_NULL);
    },

    from: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return FromVerbObject.internal(args);
    },

    bundle: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return BundleVerbObject.internal(args);
    },

    constrain: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return ConstrainVerbObject.internal(args);
    },

    protect: function()
    {
        const args = Array.prototype.slice.call(arguments);

        return ProtectVerbObject.internal(args);
    },

    sanitize: function()
    {
        return SanitizeVerbObject.internal();
    },

    $: helpers
};
