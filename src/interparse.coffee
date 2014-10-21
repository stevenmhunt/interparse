###
    Interparse v0.1.0
    Written by Steven Hunt
    MIT License
###

###*
 * Core codebase for the interparse package.
 *
 * @module Interparse
 * @class Interparse
 ###

pkg = "interparse"

###*
 * @private
 * @method parse
 * Given an interpolation expression, returns the constituent parts.
 * @param {string} expression An expression to parse.
 * @param {object} options An object containing interpolation options.
 * @return {array} A collection of expression parts.
 ###
parse = (expression, options) ->
    index = 0
    parts = []
    
    # as long as there is string left to evaluate.
    while index < expression.length
        expStart = expression.indexOf options.start, index
        
        # are there any interpolations left?
        if expStart > -1
            
            # is there anything before the interpolation? don't forget about it!
            if expStart > 0
                parts.push expression.substring(index, expStart)
            
            nextStart = expStart + options.start.length
            # add the interpolation to parts
            expEnd = expression.indexOf options.end, nextStart
            expEnd += options.end.length
            parts.push expression.substring expStart, expEnd
            index = expEnd
        else
            # if we're all done, push the rest of the string into parts.
            parts.push expression.substring index
            break
    parts

###*
 * @private
 * @method isInterpolation
 * Given an expression part, determines if it is an interpolation or not.
 * @param {string} expPart An expression part.
 * @param {object} options An object containing interpolation options.
 * @return {bool} Whether or not the expression part is an interpolation.
 ###
isInterpolation = (expPart, options) ->
    isStart = expPart.indexOf(options.start) == 0
    isEnd = expPart.indexOf(options.end) == expPart.length - options.end.length
    
    isStart and isEnd

###*
 * @private
 * @method extractExp
 * Given an interpolation, extracts the expression.
 * @param {string} interpolation The interpolation expression.
 * @param {object} options An object containing interpolation options.
 * @return {string} The extracted interpolation expression.
 ###
extractExp = (interpolation, options) ->
    start = options.start.length
    end = interpolation.length - options.end.length
    interpolation.substring(start, end).trim()

###*
 * @private
 * @method wrapExp
 * Given an expression, wraps it appropriately for the JS snippet.
 * @param {string} exp The expression to wrap.
 * @return {string} a wrapped expression.
 ###
wrapExp = (exp) ->
    return '(' + exp + ')'
    
###*
 * @private
 * @method wrapString
 * Given a string value, wraps it appropriately for the JS snippet.
 * @param {string} exp The string value to wrap.
 * @return {string} a wrapped string value.
 ###
wrapString = (str) ->
    return '"' + str + '"'

###*
 * @private
 * @method build
 * Given a parsed list of expression parts, creates a JS snippet.
 * @param {array} parts A list of expression parts.
 * @param {object} options An object containing interpolation options.
 * @return {string} an equivalent JavaScript snippet.
 ###
build = (parts, options) ->
    js = ''
    add = ' + '
    for part in parts
        if isInterpolation part, options
            js += add + wrapExp extractExp part, options
        else
            js += add + wrapString part
            
    if js.length >= add.length
        js.substring add.length
    else ''

###*
 * @private
 * @method compile
 * Given a JS snippet and parameter names, compiles a JS function.
 * @param {string} js A JavaScript snippet to use.
 * @param {array} params A list of variable names to use for parameters.
 * @return {function} A compiled JavaScript function.
 ###
compile = (js, params) ->
    new Function(params..., 'return ' + js + ';')

###*
 * @public
 * @method interparse
 * Main function for interparse
 * @param {string} expression An expression containing interpolated values.
 * @param {object} options An object containig interpolation options.
 * @param {optional} values An array which contains values to interpolate with.
 * @return {?} A function if no values are provided, otherwise a result string.
 ###
interparse = (expression, options, values) ->
    
    # setup default options values if required.
    options = options or {}
    options.start = options.start or '{{'
    options.end = options.end or '}}'
    options.params = options.params or ['i']
    
    # parse the expression.
    parts = parse expression, options
    
    # build the js snippet.
    js = build parts, options
    
    # compile the function.
    fn = compile js, options.params

    # curry: if we have values, return the result of the function.
    if values?
        fn values...
    # otherwise return the function for later use.
    else
        fn

# register the module with whichever module system is available.
do () ->
    # check for CommonJS
    if module? and module.exports?
        module.exports = interparse
    # check for AMD
    else if typeof require?.specified == "function" and require.specified(pkg)
        define pkg, [], () -> interparse
    # check for browser global
    else if window?
        window.interparse = interparse
    # where am I exactly?
    else
        interparse