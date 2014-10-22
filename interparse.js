
/*
    Interparse v0.1.0
    Written by Steven Hunt
    MIT License
 */


/**
 * Core codebase for the interparse package.
 *
 * @module Interparse
 * @class Interparse
 */

(function() {
  var build, compile, extractExp, interparse, isInterpolation, parse, pkg, processExp, processValues, wrapExp, wrapString,
    __slice = [].slice;

  pkg = "interparse";


  /**
   * @private
   * @method parse
   * Given an interpolation expression, returns the constituent parts.
   * @param {string} expression An expression to parse.
   * @param {object} options An object containing interpolation options.
   * @return {array} A collection of expression parts.
   */

  parse = function(expression, options) {
    var expEnd, expStart, index, nextStart, parts;
    index = 0;
    parts = [];
    while (index < expression.length) {
      expStart = expression.indexOf(options.start, index);
      if (expStart > -1) {
        if (expStart > 0) {
          parts.push(expression.substring(index, expStart));
        }
        nextStart = expStart + options.start.length;
        expEnd = expression.indexOf(options.end, nextStart);
        if (expEnd === -1) {
          expEnd = expression.length - options.end.length;
        }
        expEnd += options.end.length;
        parts.push(expression.substring(expStart, expEnd));
        index = expEnd;
      } else {
        parts.push(expression.substring(index));
        break;
      }
    }
    return parts;
  };


  /**
   * @private
   * @method isInterpolation
   * Given an expression part, determines if it is an interpolation or not.
   * @param {string} expPart An expression part.
   * @param {object} options An object containing interpolation options.
   * @return {bool} Whether or not the expression part is an interpolation.
   */

  isInterpolation = function(expPart, options) {
    var isEnd, isStart;
    isStart = expPart.indexOf(options.start) === 0;
    isEnd = expPart.indexOf(options.end) === expPart.length - options.end.length;
    return isStart && isEnd;
  };


  /**
   * @private
   * @method extractExp
   * Given an interpolation, extracts the expression.
   * @param {string} interpolation The interpolation expression.
   * @param {object} options An object containing interpolation options.
   * @return {string} The extracted interpolation expression.
   */

  extractExp = function(interpolation, options) {
    var end, start;
    start = options.start.length;
    end = interpolation.length - options.end.length;
    return interpolation.substring(start, end).trim();
  };


  /**
   * @private
   * @method wrapExp
   * Given an expression, wraps it appropriately for the JS snippet.
   * @param {string} exp The expression to wrap.
   * @return {string} a wrapped expression.
   */

  wrapExp = function(exp) {
    return '(' + exp + ')';
  };


  /**
   * @private
   * @method wrapString
   * Given a string value, wraps it appropriately for the JS snippet.
   * @param {string} exp The string value to wrap.
   * @return {string} a wrapped string value.
   */

  wrapString = function(str) {
    return '"' + str + '"';
  };


  /**
   * @private
   * @method build
   * Given a parsed list of expression parts, creates a JS snippet.
   * @param {array} parts A list of expression parts.
   * @param {object} options An object containing interpolation options.
   * @return {string} an equivalent JavaScript snippet.
   */

  build = function(parts, options) {
    var add, exp, js, part, _i, _len;
    js = '';
    add = ' + ';
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      if (isInterpolation(part, options)) {
        exp = extractExp(part, options);
        js += add + wrapExp(exp);
        processExp(exp, options);
      } else {
        js += add + wrapString(part);
      }
    }
    if (js.length >= add.length) {
      return js.substring(add.length);
    } else {
      return '';
    }
  };


  /**
   * @private
   * @method processExp
   * Given an expression and options, alter the parameter list.
   * @param {string} exp The expression to parse.
   * @param {object} options An object containing interpolation options.
   * @return {null}
   */

  processExp = function(exp, options) {
    var match, result;
    if (options.params == null) {
      options.params = [];
    }
    result = exp.split('.')[0].split('[')[0].split('(')[0];
    match = /^[a-z0-9]+$/i.test(result);
    if (match && options.params.indexOf(result === -1)) {
      return options.params.push(result);
    }
  };


  /**
   * @private
   * @method compile
   * Given a JS snippet and parameter names, compiles a JS function.
   * @param {string} js A JavaScript snippet to use.
   * @param {array} params A list of variable names to use for parameters.
   * @return {function} A compiled JavaScript function.
   */

  compile = function(js, params) {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Function, __slice.call(params).concat(['return ' + js + ';']), function(){});
  };


  /**
   * @private
   * @method processValues
   * Given a user-provided value, ensures that it is formatted for the function.
   * @param {object} values An object, string, or array to process.
   * @param {object} options An object containing interpolation options.
   * @return {array} values The values array to pass to the compiled function.
   */

  processValues = function(values, options) {
    var key, param, result, val, _i, _len, _ref;
    if (Array.isArray(values)) {
      return values;
    } else if (typeof values === 'string') {
      return [values];
    } else {
      result = [];
      _ref = options.params;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        for (key in values) {
          val = values[key];
          if (key === param) {
            result.push(val);
          }
        }
      }
      return result;
    }
  };


  /**
   * @public
   * @method interparse
   * Main function for interparse
   * @param {object} options An object containig interpolation options.
   * @param {string} expression An expression containing interpolated values.
   * @param {optional} values An array which contains values to interpolate with.
   * @return {misc} A function if no values are provided, otherwise a string.
   */

  interparse = function(options, expression, values) {
    var parseWithOptions, vals, _ref;
    if (typeof options === 'string' && typeof expression !== 'string') {
      _ref = [expression, options], options = _ref[0], expression = _ref[1];
    }
    if (typeof options === 'string') {
      vals = options.split('<value>');
      options = {
        start: vals[0],
        end: vals[1]
      };
    }
    options = options || {};
    options.start = options.start || '{{';
    options.end = options.end || '}}';
    options.params = options.params || [];
    parseWithOptions = function(expression, values) {
      var fn, fnWrapper, js, parts;
      parts = parse(expression, options);
      js = build(parts, options);
      fn = compile(js, options.params);
      fnWrapper = function(values) {
        return fn.apply(null, processValues(values, options));
      };
      if (values != null) {
        return fnWrapper(values);
      } else {
        return fnWrapper;
      }
    };
    if (arguments.length === 1) {
      return parseWithOptions;
    } else {
      return parseWithOptions(expression, values);
    }
  };

  (function() {
    if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
      return module.exports = interparse;
    } else if (typeof (typeof require !== "undefined" && require !== null ? require.specified : void 0) === "function" && require.specified(pkg)) {
      return define(pkg, [], function() {
        return interparse;
      });
    } else if (typeof window !== "undefined" && window !== null) {
      return window.interparse = interparse;
    } else {
      return interparse;
    }
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,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MC4xLjBcbiAgICBXcml0dGVuIGJ5IFN0ZXZlbiBIdW50XG4gICAgTUlUIExpY2Vuc2VcbiMjI1xuXG4jIyMqXG4gKiBDb3JlIGNvZGViYXNlIGZvciB0aGUgaW50ZXJwYXJzZSBwYWNrYWdlLlxuICpcbiAqIEBtb2R1bGUgSW50ZXJwYXJzZVxuICogQGNsYXNzIEludGVycGFyc2VcbiAjIyNcblxucGtnID0gXCJpbnRlcnBhcnNlXCJcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgcGFyc2VcbiAqIEdpdmVuIGFuIGludGVycG9sYXRpb24gZXhwcmVzc2lvbiwgcmV0dXJucyB0aGUgY29uc3RpdHVlbnQgcGFydHMuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXhwcmVzc2lvbiBBbiBleHByZXNzaW9uIHRvIHBhcnNlLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbiBvcHRpb25zLlxuICogQHJldHVybiB7YXJyYXl9IEEgY29sbGVjdGlvbiBvZiBleHByZXNzaW9uIHBhcnRzLlxuICMjI1xucGFyc2UgPSAoZXhwcmVzc2lvbiwgb3B0aW9ucykgLT5cbiAgICBpbmRleCA9IDBcbiAgICBwYXJ0cyA9IFtdXG4gICAgXG4gICAgIyBhcyBsb25nIGFzIHRoZXJlIGlzIHN0cmluZyBsZWZ0IHRvIGV2YWx1YXRlLlxuICAgIHdoaWxlIGluZGV4IDwgZXhwcmVzc2lvbi5sZW5ndGhcbiAgICAgICAgZXhwU3RhcnQgPSBleHByZXNzaW9uLmluZGV4T2Ygb3B0aW9ucy5zdGFydCwgaW5kZXhcbiAgICAgICAgXG4gICAgICAgICMgYXJlIHRoZXJlIGFueSBpbnRlcnBvbGF0aW9ucyBsZWZ0P1xuICAgICAgICBpZiBleHBTdGFydCA+IC0xXG4gICAgICAgICAgICBcbiAgICAgICAgICAgICMgaXMgdGhlcmUgYW55dGhpbmcgYmVmb3JlIHRoZSBpbnRlcnBvbGF0aW9uPyBkb24ndCBmb3JnZXQgYWJvdXQgaXQhXG4gICAgICAgICAgICBpZiBleHBTdGFydCA+IDBcbiAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoIGV4cHJlc3Npb24uc3Vic3RyaW5nKGluZGV4LCBleHBTdGFydClcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV4dFN0YXJ0ID0gZXhwU3RhcnQgKyBvcHRpb25zLnN0YXJ0Lmxlbmd0aFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAjIGFkZCB0aGUgaW50ZXJwb2xhdGlvbiB0byBwYXJ0c1xuICAgICAgICAgICAgZXhwRW5kID0gZXhwcmVzc2lvbi5pbmRleE9mIG9wdGlvbnMuZW5kLCBuZXh0U3RhcnRcbiAgICAgICAgICAgIGlmIGV4cEVuZCA9PSAtMVxuICAgICAgICAgICAgICAgIGV4cEVuZCA9IGV4cHJlc3Npb24ubGVuZ3RoIC0gb3B0aW9ucy5lbmQubGVuZ3RoXG4gICAgICAgICAgICBleHBFbmQgKz0gb3B0aW9ucy5lbmQubGVuZ3RoXG4gICAgICAgICAgICBwYXJ0cy5wdXNoIGV4cHJlc3Npb24uc3Vic3RyaW5nIGV4cFN0YXJ0LCBleHBFbmRcbiAgICAgICAgICAgIGluZGV4ID0gZXhwRW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICMgaWYgd2UncmUgYWxsIGRvbmUsIHB1c2ggdGhlIHJlc3Qgb2YgdGhlIHN0cmluZyBpbnRvIHBhcnRzLlxuICAgICAgICAgICAgcGFydHMucHVzaCBleHByZXNzaW9uLnN1YnN0cmluZyBpbmRleFxuICAgICAgICAgICAgYnJlYWtcbiAgICBwYXJ0c1xuXG4jIyMqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBpc0ludGVycG9sYXRpb25cbiAqIEdpdmVuIGFuIGV4cHJlc3Npb24gcGFydCwgZGV0ZXJtaW5lcyBpZiBpdCBpcyBhbiBpbnRlcnBvbGF0aW9uIG9yIG5vdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHBQYXJ0IEFuIGV4cHJlc3Npb24gcGFydC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIGludGVycG9sYXRpb24gb3B0aW9ucy5cbiAqIEByZXR1cm4ge2Jvb2x9IFdoZXRoZXIgb3Igbm90IHRoZSBleHByZXNzaW9uIHBhcnQgaXMgYW4gaW50ZXJwb2xhdGlvbi5cbiAjIyNcbmlzSW50ZXJwb2xhdGlvbiA9IChleHBQYXJ0LCBvcHRpb25zKSAtPlxuICAgIGlzU3RhcnQgPSBleHBQYXJ0LmluZGV4T2Yob3B0aW9ucy5zdGFydCkgPT0gMFxuICAgIGlzRW5kID0gZXhwUGFydC5pbmRleE9mKG9wdGlvbnMuZW5kKSA9PSBleHBQYXJ0Lmxlbmd0aCAtIG9wdGlvbnMuZW5kLmxlbmd0aFxuICAgIFxuICAgIGlzU3RhcnQgYW5kIGlzRW5kXG5cbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGV4dHJhY3RFeHBcbiAqIEdpdmVuIGFuIGludGVycG9sYXRpb24sIGV4dHJhY3RzIHRoZSBleHByZXNzaW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGludGVycG9sYXRpb24gVGhlIGludGVycG9sYXRpb24gZXhwcmVzc2lvbi5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIGludGVycG9sYXRpb24gb3B0aW9ucy5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGV4dHJhY3RlZCBpbnRlcnBvbGF0aW9uIGV4cHJlc3Npb24uXG4gIyMjXG5leHRyYWN0RXhwID0gKGludGVycG9sYXRpb24sIG9wdGlvbnMpIC0+XG4gICAgc3RhcnQgPSBvcHRpb25zLnN0YXJ0Lmxlbmd0aFxuICAgIGVuZCA9IGludGVycG9sYXRpb24ubGVuZ3RoIC0gb3B0aW9ucy5lbmQubGVuZ3RoXG4gICAgaW50ZXJwb2xhdGlvbi5zdWJzdHJpbmcoc3RhcnQsIGVuZCkudHJpbSgpXG5cbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIHdyYXBFeHBcbiAqIEdpdmVuIGFuIGV4cHJlc3Npb24sIHdyYXBzIGl0IGFwcHJvcHJpYXRlbHkgZm9yIHRoZSBKUyBzbmlwcGV0LlxuICogQHBhcmFtIHtzdHJpbmd9IGV4cCBUaGUgZXhwcmVzc2lvbiB0byB3cmFwLlxuICogQHJldHVybiB7c3RyaW5nfSBhIHdyYXBwZWQgZXhwcmVzc2lvbi5cbiAjIyNcbndyYXBFeHAgPSAoZXhwKSAtPlxuICAgIHJldHVybiAnKCcgKyBleHAgKyAnKSdcbiAgICBcbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIHdyYXBTdHJpbmdcbiAqIEdpdmVuIGEgc3RyaW5nIHZhbHVlLCB3cmFwcyBpdCBhcHByb3ByaWF0ZWx5IGZvciB0aGUgSlMgc25pcHBldC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHAgVGhlIHN0cmluZyB2YWx1ZSB0byB3cmFwLlxuICogQHJldHVybiB7c3RyaW5nfSBhIHdyYXBwZWQgc3RyaW5nIHZhbHVlLlxuICMjI1xud3JhcFN0cmluZyA9IChzdHIpIC0+XG4gICAgcmV0dXJuICdcIicgKyBzdHIgKyAnXCInXG5cbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGJ1aWxkXG4gKiBHaXZlbiBhIHBhcnNlZCBsaXN0IG9mIGV4cHJlc3Npb24gcGFydHMsIGNyZWF0ZXMgYSBKUyBzbmlwcGV0LlxuICogQHBhcmFtIHthcnJheX0gcGFydHMgQSBsaXN0IG9mIGV4cHJlc3Npb24gcGFydHMuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBBbiBvYmplY3QgY29udGFpbmluZyBpbnRlcnBvbGF0aW9uIG9wdGlvbnMuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGFuIGVxdWl2YWxlbnQgSmF2YVNjcmlwdCBzbmlwcGV0LlxuICMjI1xuYnVpbGQgPSAocGFydHMsIG9wdGlvbnMpIC0+XG4gICAganMgPSAnJ1xuICAgIGFkZCA9ICcgKyAnXG4gICAgZm9yIHBhcnQgaW4gcGFydHNcbiAgICAgICAgaWYgaXNJbnRlcnBvbGF0aW9uIHBhcnQsIG9wdGlvbnNcbiAgICAgICAgICAgIGV4cCA9IGV4dHJhY3RFeHAgcGFydCwgb3B0aW9uc1xuICAgICAgICAgICAganMgKz0gYWRkICsgd3JhcEV4cCBleHBcbiAgICAgICAgICAgIHByb2Nlc3NFeHAgZXhwLCBvcHRpb25zXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGpzICs9IGFkZCArIHdyYXBTdHJpbmcgcGFydFxuICAgICAgICAgICAgXG4gICAgaWYganMubGVuZ3RoID49IGFkZC5sZW5ndGhcbiAgICAgICAganMuc3Vic3RyaW5nIGFkZC5sZW5ndGhcbiAgICBlbHNlICcnXG5cbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIHByb2Nlc3NFeHBcbiAqIEdpdmVuIGFuIGV4cHJlc3Npb24gYW5kIG9wdGlvbnMsIGFsdGVyIHRoZSBwYXJhbWV0ZXIgbGlzdC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHAgVGhlIGV4cHJlc3Npb24gdG8gcGFyc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBBbiBvYmplY3QgY29udGFpbmluZyBpbnRlcnBvbGF0aW9uIG9wdGlvbnMuXG4gKiBAcmV0dXJuIHtudWxsfVxuICMjI1xucHJvY2Vzc0V4cCA9IChleHAsIG9wdGlvbnMpIC0+XG4gICAgXG4gICAgIyBtYWtlIHN1cmUgdGhlcmUncyBhIHBhcmFtcyBsaXN0LlxuICAgIGlmIG5vdCBvcHRpb25zLnBhcmFtcz9cbiAgICAgICAgb3B0aW9ucy5wYXJhbXMgPSBbXVxuICAgIFxuICAgICMgYWRkIHN1cHBvcnQgZm9yIGNoaWxkIHByb3BlcnR5IGFuZCBhcnJheSBzZWxlY3Rpb24uXG4gICAgcmVzdWx0ID0gZXhwXG4gICAgICAgIC5zcGxpdCgnLicpWzBdXG4gICAgICAgIC5zcGxpdCgnWycpWzBdXG4gICAgICAgIC5zcGxpdCgnKCcpWzBdXG4gICAgXG4gICAgIyBzZWUgaWYgdGhlIGV4cHJlc3Npb24gaXMgYSB2YXJpYWJsZSBuYW1lXG4gICAgbWF0Y2ggPSAvXlthLXowLTldKyQvaS50ZXN0IHJlc3VsdFxuICAgIFxuICAgICMgYWRkIGl0IHRvIHRoZSBsaXN0IGlmIGl0J3MgYSBtYXRjaCBhbmQgaXQncyBub3QgYWxyZWFkeSB0aGVyZS5cbiAgICBpZiBtYXRjaCBhbmQgb3B0aW9ucy5wYXJhbXMuaW5kZXhPZiByZXN1bHQgPT0gLTFcbiAgICAgICAgb3B0aW9ucy5wYXJhbXMucHVzaCByZXN1bHRcbiAgICBcbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGNvbXBpbGVcbiAqIEdpdmVuIGEgSlMgc25pcHBldCBhbmQgcGFyYW1ldGVyIG5hbWVzLCBjb21waWxlcyBhIEpTIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IGpzIEEgSmF2YVNjcmlwdCBzbmlwcGV0IHRvIHVzZS5cbiAqIEBwYXJhbSB7YXJyYXl9IHBhcmFtcyBBIGxpc3Qgb2YgdmFyaWFibGUgbmFtZXMgdG8gdXNlIGZvciBwYXJhbWV0ZXJzLlxuICogQHJldHVybiB7ZnVuY3Rpb259IEEgY29tcGlsZWQgSmF2YVNjcmlwdCBmdW5jdGlvbi5cbiAjIyNcbmNvbXBpbGUgPSAoanMsIHBhcmFtcykgLT5cbiAgICBuZXcgRnVuY3Rpb24ocGFyYW1zLi4uLCAncmV0dXJuICcgKyBqcyArICc7JylcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgcHJvY2Vzc1ZhbHVlc1xuICogR2l2ZW4gYSB1c2VyLXByb3ZpZGVkIHZhbHVlLCBlbnN1cmVzIHRoYXQgaXQgaXMgZm9ybWF0dGVkIGZvciB0aGUgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge29iamVjdH0gdmFsdWVzIEFuIG9iamVjdCwgc3RyaW5nLCBvciBhcnJheSB0byBwcm9jZXNzLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbiBvcHRpb25zLlxuICogQHJldHVybiB7YXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIGFycmF5IHRvIHBhc3MgdG8gdGhlIGNvbXBpbGVkIGZ1bmN0aW9uLlxuICMjI1xucHJvY2Vzc1ZhbHVlcyA9ICh2YWx1ZXMsIG9wdGlvbnMpIC0+XG4gICAgaWYgQXJyYXkuaXNBcnJheSB2YWx1ZXNcbiAgICAgICAgdmFsdWVzXG4gICAgZWxzZSBpZiB0eXBlb2YgdmFsdWVzID09ICdzdHJpbmcnXG4gICAgICAgIFt2YWx1ZXNdXG4gICAgZWxzZVxuICAgICAgICByZXN1bHQgPSBbXVxuICAgICAgICBmb3IgcGFyYW0gaW4gb3B0aW9ucy5wYXJhbXNcbiAgICAgICAgICAgIGZvciBrZXksIHZhbCBvZiB2YWx1ZXNcbiAgICAgICAgICAgICAgICBpZiBrZXkgPT0gcGFyYW1cbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2ggdmFsXG4gICAgICAgIHJlc3VsdFxuXG4jIyMqXG4gKiBAcHVibGljXG4gKiBAbWV0aG9kIGludGVycGFyc2VcbiAqIE1haW4gZnVuY3Rpb24gZm9yIGludGVycGFyc2VcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaWcgaW50ZXJwb2xhdGlvbiBvcHRpb25zLlxuICogQHBhcmFtIHtzdHJpbmd9IGV4cHJlc3Npb24gQW4gZXhwcmVzc2lvbiBjb250YWluaW5nIGludGVycG9sYXRlZCB2YWx1ZXMuXG4gKiBAcGFyYW0ge29wdGlvbmFsfSB2YWx1ZXMgQW4gYXJyYXkgd2hpY2ggY29udGFpbnMgdmFsdWVzIHRvIGludGVycG9sYXRlIHdpdGguXG4gKiBAcmV0dXJuIHttaXNjfSBBIGZ1bmN0aW9uIGlmIG5vIHZhbHVlcyBhcmUgcHJvdmlkZWQsIG90aGVyd2lzZSBhIHN0cmluZy5cbiAjIyNcbmludGVycGFyc2UgPSAob3B0aW9ucywgZXhwcmVzc2lvbiwgdmFsdWVzKSAtPlxuICAgIFxuICAgICMgaGFuZGxlIGxlZ2FjeSBwYXJhbWV0ZXJzLlxuICAgIGlmIHR5cGVvZiBvcHRpb25zID09ICdzdHJpbmcnIGFuZCB0eXBlb2YgZXhwcmVzc2lvbiAhPSAnc3RyaW5nJ1xuICAgICAgICBbb3B0aW9ucywgZXhwcmVzc2lvbl0gPSBbZXhwcmVzc2lvbiwgb3B0aW9uc11cbiAgICBcbiAgICAjIGlmIG9wdGlvbnMgaXMgYSBzdHJpbmcsIHBhcnNlIGl0IGZvciB2YWx1ZXMuXG4gICAgaWYgdHlwZW9mIG9wdGlvbnMgPT0gJ3N0cmluZydcbiAgICAgICAgdmFscyA9IG9wdGlvbnMuc3BsaXQgJzx2YWx1ZT4nXG4gICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgICAgc3RhcnQ6IHZhbHNbMF1cbiAgICAgICAgICAgIGVuZDogdmFsc1sxXVxuICAgICAgICBcbiAgICAjIHNldHVwIGRlZmF1bHQgb3B0aW9ucyB2YWx1ZXMgaWYgcmVxdWlyZWQuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgb3Ige31cbiAgICBvcHRpb25zLnN0YXJ0ID0gb3B0aW9ucy5zdGFydCBvciAne3snXG4gICAgb3B0aW9ucy5lbmQgPSBvcHRpb25zLmVuZCBvciAnfX0nXG4gICAgb3B0aW9ucy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyBvciBbXVxuICAgIFxuICAgICMgYSBsYW1iZGEgd2hpY2ggY2FuIGNvbXBsZXRlIHRoZSBpbnRlcnBvbGF0aW9uIHdpdGggdGhlIGdpdmVuIG9wdGlvbnMuXG4gICAgcGFyc2VXaXRoT3B0aW9ucyA9IChleHByZXNzaW9uLCB2YWx1ZXMpIC0+XG5cbiAgICAgICAgIyBwYXJzZSB0aGUgZXhwcmVzc2lvbi5cbiAgICAgICAgcGFydHMgPSBwYXJzZSBleHByZXNzaW9uLCBvcHRpb25zXG4gICAgICAgIFxuICAgICAgICAjIGJ1aWxkIHRoZSBqcyBzbmlwcGV0LlxuICAgICAgICBqcyA9IGJ1aWxkIHBhcnRzLCBvcHRpb25zXG4gICAgICAgIFxuICAgICAgICAjIGNvbXBpbGUgdGhlIGZ1bmN0aW9uLlxuICAgICAgICBmbiA9IGNvbXBpbGUganMsIG9wdGlvbnMucGFyYW1zXG4gICAgXG4gICAgICAgICMgd3JhcCB0aGUgY29tcGlsZWQgZnVuY3Rpb24gdG8gaGFuZGxlIHByb2Nlc3Npbmcgb2YgdmFsdWVzLlxuICAgICAgICBmbldyYXBwZXIgPSAodmFsdWVzKSAtPlxuICAgICAgICAgICAgZm4gcHJvY2Vzc1ZhbHVlcyh2YWx1ZXMsIG9wdGlvbnMpLi4uXG4gICAgXG4gICAgICAgICMgY3Vycnk6IGlmIHdlIGhhdmUgdmFsdWVzLCByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAgIGlmIHZhbHVlcz9cbiAgICAgICAgICAgIGZuV3JhcHBlciB2YWx1ZXNcbiAgICAgICAgIyBvdGhlcndpc2UgcmV0dXJuIHRoZSBmdW5jdGlvbiBmb3IgbGF0ZXIgdXNlLlxuICAgICAgICBlbHNlXG4gICAgICAgICAgICBmbldyYXBwZXJcbiAgICBcbiAgICAjIGlmIHRoZXJlIGlzIG9ubHkgb25lIGFyZ3VtZW50LCByZXR1cm4gdGhlIGZ1bmN0aW9uIHdpdGhvdXQgY2FsbGluZyBpdC5cbiAgICBpZiBhcmd1bWVudHMubGVuZ3RoID09IDFcbiAgICAgICAgcGFyc2VXaXRoT3B0aW9uc1xuICAgICMgb3RoZXJ3aXNlLCBhY3R1YWxseSBydW4gdGhlIHBhcnNlLlxuICAgIGVsc2VcbiAgICAgICAgcGFyc2VXaXRoT3B0aW9ucyBleHByZXNzaW9uLCB2YWx1ZXNcblxuIyByZWdpc3RlciB0aGUgbW9kdWxlIHdpdGggd2hpY2hldmVyIG1vZHVsZSBzeXN0ZW0gaXMgYXZhaWxhYmxlLlxuZG8gKCkgLT5cbiAgICAjIGNoZWNrIGZvciBDb21tb25KU1xuICAgIGlmIG1vZHVsZT8gYW5kIG1vZHVsZS5leHBvcnRzP1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGludGVycGFyc2VcbiAgICAjIGNoZWNrIGZvciBBTURcbiAgICBlbHNlIGlmIHR5cGVvZiByZXF1aXJlPy5zcGVjaWZpZWQgPT0gXCJmdW5jdGlvblwiIGFuZCByZXF1aXJlLnNwZWNpZmllZChwa2cpXG4gICAgICAgIGRlZmluZSBwa2csIFtdLCAoKSAtPiBpbnRlcnBhcnNlXG4gICAgIyBjaGVjayBmb3IgYnJvd3NlciBnbG9iYWxcbiAgICBlbHNlIGlmIHdpbmRvdz9cbiAgICAgICAgd2luZG93LmludGVycGFyc2UgPSBpbnRlcnBhcnNlXG4gICAgIyB3aGVyZSBhbSBJIGV4YWN0bHk/XG4gICAgZWxzZVxuICAgICAgICBpbnRlcnBhcnNlIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9