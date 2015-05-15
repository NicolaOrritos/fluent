
'use strict';

var utils = require('./utils');


module.exports =
{
    isNull:     utils.isNull,
    isArray:    utils.isArray,
    isString:   utils.isString,
    isObject:   utils.isObject,
    isNumber:   utils.isNumber,
    isRegExp:   utils.isRegExp,
    isFunction: utils.isFunction,
    
    escapeRegExp: function(string)
    {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    },

    replaceAll: function(find, replace, str)
    {
        var result = str;
        var regex  = new RegExp(this.escapeRegExp(find), 'g');

        if (str.match(regex))
        {
            result = str.replace(regex, replace);
        }

        return result;
    },
    
    notused: function()
    {}
};
