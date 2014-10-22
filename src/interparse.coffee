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
            if expEnd == -1
                expEnd = expression.length - options.end.length
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
            exp = extractExp part, options
            js += add + wrapExp exp
            processExp exp, options
        else
            js += add + wrapString part
            
    if js.length >= add.length
        js.substring add.length
    else ''

###*
 * @private
 * @method processExp
 * Given an expression and options, alter the parameter list.
 * @param {string} exp The expression to parse.
 * @param {object} options An object containing interpolation options.
 * @return {null}
 ###
processExp = (exp, options) ->
    
    # make sure there's a params list.
    if not options.params?
        options.params = []
    
    # add support for child property and array selection.
    result = exp
        .split('.')[0]
        .split('[')[0]
        .split('(')[0]
    
    # see if the expression is a variable name
    match = /^[a-z0-9]+$/i.test result
    
    # add it to the list if it's a match and it's not already there.
    if match and options.params.indexOf result == -1
        options.params.push result
    
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
 * @private
 * @method processValues
 * Given a user-provided value, ensures that it is formatted for the function.
 * @param {object} values An object, string, or array to process.
 * @param {object} options An object containing interpolation options.
 * @return {array} values The values array to pass to the compiled function.
 ###
processValues = (values, options) ->
    if Array.isArray values
        values
    else if typeof values == 'string'
        [values]
    else
        result = []
        for param in options.params
            for key, val of values
                if key == param
                    result.push val
        result

###*
 * @public
 * @method interparse
 * Main function for interparse
 * @param {object} options An object containig interpolation options.
 * @param {string} expression An expression containing interpolated values.
 * @param {optional} values An array which contains values to interpolate with.
 * @return {misc} A function if no values are provided, otherwise a string.
 ###
interparse = (options, expression, values) ->
    
    # handle legacy parameters.
    if typeof options == 'string' and typeof expression != 'string'
        [options, expression] = [expression, options]
    
    # if options is a string, parse it for values.
    if typeof options == 'string'
        vals = options.split '<value>'
        options =
            start: vals[0]
            end: vals[1]
        
    # setup default options values if required.
    options = options or {}
    options.start = options.start or '{{'
    options.end = options.end or '}}'
    options.params = options.params or []
    
    # a lambda which can complete the interpolation with the given options.
    parseWithOptions = (expression, values) ->

        # parse the expression.
        parts = parse expression, options
        
        # build the js snippet.
        js = build parts, options
        
        # compile the function.
        fn = compile js, options.params
    
        # wrap the compiled function to handle processing of values.
        fnWrapper = (values) ->
            fn processValues(values, options)...
    
        # curry: if we have values, return the result of the function.
        if values?
            fnWrapper values
        # otherwise return the function for later use.
        else
            fnWrapper
    
    # if there is only one argument, return the function without calling it.
    if arguments.length == 1
        parseWithOptions
    # otherwise, actually run the parse.
    else
        parseWithOptions expression, values

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