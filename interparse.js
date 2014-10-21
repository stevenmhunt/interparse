
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
  var build, compile, extractExp, interparse, isInterpolation, parse, pkg, wrapExp, wrapString,
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
    var add, js, part, _i, _len;
    js = '';
    add = ' + ';
    for (_i = 0, _len = parts.length; _i < _len; _i++) {
      part = parts[_i];
      if (isInterpolation(part, options)) {
        js += add + wrapExp(extractExp(part, options));
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
   * @public
   * @method interparse
   * Main function for interparse
   * @param {string} expression An expression containing interpolated values.
   * @param {object} options An object containig interpolation options.
   * @param {optional} values An array which contains values to interpolate with.
   * @return {?} A function if no values are provided, otherwise a result string.
   */

  interparse = function(expression, options, values) {
    var fn, js, parts;
    options = options || {};
    options.start = options.start || '{{';
    options.end = options.end || '}}';
    options.params = options.params || ['i'];
    parts = parse(expression, options);
    js = build(parts, options);
    fn = compile(js, options.params);
    if (values != null) {
      return fn.apply(null, values);
    } else {
      return fn;
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

//# sourceMappingURL=data:application/json;base64,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dCI6WyIjIyNcbiAgICBJbnRlcnBhcnNlIHYwLjEuMFxuICAgIFdyaXR0ZW4gYnkgU3RldmVuIEh1bnRcbiAgICBNSVQgTGljZW5zZVxuIyMjXG5cbiMjIypcbiAqIENvcmUgY29kZWJhc2UgZm9yIHRoZSBpbnRlcnBhcnNlIHBhY2thZ2UuXG4gKlxuICogQG1vZHVsZSBJbnRlcnBhcnNlXG4gKiBAY2xhc3MgSW50ZXJwYXJzZVxuICMjI1xuXG5wa2cgPSBcImludGVycGFyc2VcIlxuXG4jIyMqXG4gKiBAcHJpdmF0ZVxuICogQG1ldGhvZCBwYXJzZVxuICogR2l2ZW4gYW4gaW50ZXJwb2xhdGlvbiBleHByZXNzaW9uLCByZXR1cm5zIHRoZSBjb25zdGl0dWVudCBwYXJ0cy5cbiAqIEBwYXJhbSB7c3RyaW5nfSBleHByZXNzaW9uIEFuIGV4cHJlc3Npb24gdG8gcGFyc2UuXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBBbiBvYmplY3QgY29udGFpbmluZyBpbnRlcnBvbGF0aW9uIG9wdGlvbnMuXG4gKiBAcmV0dXJuIHthcnJheX0gQSBjb2xsZWN0aW9uIG9mIGV4cHJlc3Npb24gcGFydHMuXG4gIyMjXG5wYXJzZSA9IChleHByZXNzaW9uLCBvcHRpb25zKSAtPlxuICAgIGluZGV4ID0gMFxuICAgIHBhcnRzID0gW11cbiAgICBcbiAgICAjIGFzIGxvbmcgYXMgdGhlcmUgaXMgc3RyaW5nIGxlZnQgdG8gZXZhbHVhdGUuXG4gICAgd2hpbGUgaW5kZXggPCBleHByZXNzaW9uLmxlbmd0aFxuICAgICAgICBleHBTdGFydCA9IGV4cHJlc3Npb24uaW5kZXhPZiBvcHRpb25zLnN0YXJ0LCBpbmRleFxuICAgICAgICBcbiAgICAgICAgIyBhcmUgdGhlcmUgYW55IGludGVycG9sYXRpb25zIGxlZnQ/XG4gICAgICAgIGlmIGV4cFN0YXJ0ID4gLTFcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgIyBpcyB0aGVyZSBhbnl0aGluZyBiZWZvcmUgdGhlIGludGVycG9sYXRpb24/IGRvbid0IGZvcmdldCBhYm91dCBpdCFcbiAgICAgICAgICAgIGlmIGV4cFN0YXJ0ID4gMFxuICAgICAgICAgICAgICAgIHBhcnRzLnB1c2ggZXhwcmVzc2lvbi5zdWJzdHJpbmcoaW5kZXgsIGV4cFN0YXJ0KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBuZXh0U3RhcnQgPSBleHBTdGFydCArIG9wdGlvbnMuc3RhcnQubGVuZ3RoXG4gICAgICAgICAgICAjIGFkZCB0aGUgaW50ZXJwb2xhdGlvbiB0byBwYXJ0c1xuICAgICAgICAgICAgZXhwRW5kID0gZXhwcmVzc2lvbi5pbmRleE9mIG9wdGlvbnMuZW5kLCBuZXh0U3RhcnRcbiAgICAgICAgICAgIGV4cEVuZCArPSBvcHRpb25zLmVuZC5sZW5ndGhcbiAgICAgICAgICAgIHBhcnRzLnB1c2ggZXhwcmVzc2lvbi5zdWJzdHJpbmcgZXhwU3RhcnQsIGV4cEVuZFxuICAgICAgICAgICAgaW5kZXggPSBleHBFbmRcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBpZiB3ZSdyZSBhbGwgZG9uZSwgcHVzaCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIGludG8gcGFydHMuXG4gICAgICAgICAgICBwYXJ0cy5wdXNoIGV4cHJlc3Npb24uc3Vic3RyaW5nIGluZGV4XG4gICAgICAgICAgICBicmVha1xuICAgIHBhcnRzXG5cbiMjIypcbiAqIEBwcml2YXRlXG4gKiBAbWV0aG9kIGlzSW50ZXJwb2xhdGlvblxuICogR2l2ZW4gYW4gZXhwcmVzc2lvbiBwYXJ0LCBkZXRlcm1pbmVzIGlmIGl0IGlzIGFuIGludGVycG9sYXRpb24gb3Igbm90LlxuICogQHBhcmFtIHtzdHJpbmd9IGV4cFBhcnQgQW4gZXhwcmVzc2lvbiBwYXJ0LlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbiBvcHRpb25zLlxuICogQHJldHVybiB7Ym9vbH0gV2hldGhlciBvciBub3QgdGhlIGV4cHJlc3Npb24gcGFydCBpcyBhbiBpbnRlcnBvbGF0aW9uLlxuICMjI1xuaXNJbnRlcnBvbGF0aW9uID0gKGV4cFBhcnQsIG9wdGlvbnMpIC0+XG4gICAgaXNTdGFydCA9IGV4cFBhcnQuaW5kZXhPZihvcHRpb25zLnN0YXJ0KSA9PSAwXG4gICAgaXNFbmQgPSBleHBQYXJ0LmluZGV4T2Yob3B0aW9ucy5lbmQpID09IGV4cFBhcnQubGVuZ3RoIC0gb3B0aW9ucy5lbmQubGVuZ3RoXG4gICAgXG4gICAgaXNTdGFydCBhbmQgaXNFbmRcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgZXh0cmFjdEV4cFxuICogR2l2ZW4gYW4gaW50ZXJwb2xhdGlvbiwgZXh0cmFjdHMgdGhlIGV4cHJlc3Npb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gaW50ZXJwb2xhdGlvbiBUaGUgaW50ZXJwb2xhdGlvbiBleHByZXNzaW9uLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pbmcgaW50ZXJwb2xhdGlvbiBvcHRpb25zLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgZXh0cmFjdGVkIGludGVycG9sYXRpb24gZXhwcmVzc2lvbi5cbiAjIyNcbmV4dHJhY3RFeHAgPSAoaW50ZXJwb2xhdGlvbiwgb3B0aW9ucykgLT5cbiAgICBzdGFydCA9IG9wdGlvbnMuc3RhcnQubGVuZ3RoXG4gICAgZW5kID0gaW50ZXJwb2xhdGlvbi5sZW5ndGggLSBvcHRpb25zLmVuZC5sZW5ndGhcbiAgICBpbnRlcnBvbGF0aW9uLnN1YnN0cmluZyhzdGFydCwgZW5kKS50cmltKClcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2Qgd3JhcEV4cFxuICogR2l2ZW4gYW4gZXhwcmVzc2lvbiwgd3JhcHMgaXQgYXBwcm9wcmlhdGVseSBmb3IgdGhlIEpTIHNuaXBwZXQuXG4gKiBAcGFyYW0ge3N0cmluZ30gZXhwIFRoZSBleHByZXNzaW9uIHRvIHdyYXAuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGEgd3JhcHBlZCBleHByZXNzaW9uLlxuICMjI1xud3JhcEV4cCA9IChleHApIC0+XG4gICAgcmV0dXJuICcoJyArIGV4cCArICcpJ1xuICAgIFxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2Qgd3JhcFN0cmluZ1xuICogR2l2ZW4gYSBzdHJpbmcgdmFsdWUsIHdyYXBzIGl0IGFwcHJvcHJpYXRlbHkgZm9yIHRoZSBKUyBzbmlwcGV0LlxuICogQHBhcmFtIHtzdHJpbmd9IGV4cCBUaGUgc3RyaW5nIHZhbHVlIHRvIHdyYXAuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGEgd3JhcHBlZCBzdHJpbmcgdmFsdWUuXG4gIyMjXG53cmFwU3RyaW5nID0gKHN0cikgLT5cbiAgICByZXR1cm4gJ1wiJyArIHN0ciArICdcIidcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgYnVpbGRcbiAqIEdpdmVuIGEgcGFyc2VkIGxpc3Qgb2YgZXhwcmVzc2lvbiBwYXJ0cywgY3JlYXRlcyBhIEpTIHNuaXBwZXQuXG4gKiBAcGFyYW0ge2FycmF5fSBwYXJ0cyBBIGxpc3Qgb2YgZXhwcmVzc2lvbiBwYXJ0cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIEFuIG9iamVjdCBjb250YWluaW5nIGludGVycG9sYXRpb24gb3B0aW9ucy5cbiAqIEByZXR1cm4ge3N0cmluZ30gYW4gZXF1aXZhbGVudCBKYXZhU2NyaXB0IHNuaXBwZXQuXG4gIyMjXG5idWlsZCA9IChwYXJ0cywgb3B0aW9ucykgLT5cbiAgICBqcyA9ICcnXG4gICAgYWRkID0gJyArICdcbiAgICBmb3IgcGFydCBpbiBwYXJ0c1xuICAgICAgICBpZiBpc0ludGVycG9sYXRpb24gcGFydCwgb3B0aW9uc1xuICAgICAgICAgICAganMgKz0gYWRkICsgd3JhcEV4cCBleHRyYWN0RXhwIHBhcnQsIG9wdGlvbnNcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAganMgKz0gYWRkICsgd3JhcFN0cmluZyBwYXJ0XG4gICAgICAgICAgICBcbiAgICBpZiBqcy5sZW5ndGggPj0gYWRkLmxlbmd0aFxuICAgICAgICBqcy5zdWJzdHJpbmcgYWRkLmxlbmd0aFxuICAgIGVsc2UgJydcblxuIyMjKlxuICogQHByaXZhdGVcbiAqIEBtZXRob2QgY29tcGlsZVxuICogR2l2ZW4gYSBKUyBzbmlwcGV0IGFuZCBwYXJhbWV0ZXIgbmFtZXMsIGNvbXBpbGVzIGEgSlMgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30ganMgQSBKYXZhU2NyaXB0IHNuaXBwZXQgdG8gdXNlLlxuICogQHBhcmFtIHthcnJheX0gcGFyYW1zIEEgbGlzdCBvZiB2YXJpYWJsZSBuYW1lcyB0byB1c2UgZm9yIHBhcmFtZXRlcnMuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gQSBjb21waWxlZCBKYXZhU2NyaXB0IGZ1bmN0aW9uLlxuICMjI1xuY29tcGlsZSA9IChqcywgcGFyYW1zKSAtPlxuICAgIG5ldyBGdW5jdGlvbihwYXJhbXMuLi4sICdyZXR1cm4gJyArIGpzICsgJzsnKVxuXG4jIyMqXG4gKiBAcHVibGljXG4gKiBAbWV0aG9kIGludGVycGFyc2VcbiAqIE1haW4gZnVuY3Rpb24gZm9yIGludGVycGFyc2VcbiAqIEBwYXJhbSB7c3RyaW5nfSBleHByZXNzaW9uIEFuIGV4cHJlc3Npb24gY29udGFpbmluZyBpbnRlcnBvbGF0ZWQgdmFsdWVzLlxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgQW4gb2JqZWN0IGNvbnRhaW5pZyBpbnRlcnBvbGF0aW9uIG9wdGlvbnMuXG4gKiBAcGFyYW0ge29wdGlvbmFsfSB2YWx1ZXMgQW4gYXJyYXkgd2hpY2ggY29udGFpbnMgdmFsdWVzIHRvIGludGVycG9sYXRlIHdpdGguXG4gKiBAcmV0dXJuIHs/fSBBIGZ1bmN0aW9uIGlmIG5vIHZhbHVlcyBhcmUgcHJvdmlkZWQsIG90aGVyd2lzZSBhIHJlc3VsdCBzdHJpbmcuXG4gIyMjXG5pbnRlcnBhcnNlID0gKGV4cHJlc3Npb24sIG9wdGlvbnMsIHZhbHVlcykgLT5cbiAgICBcbiAgICAjIHNldHVwIGRlZmF1bHQgb3B0aW9ucyB2YWx1ZXMgaWYgcmVxdWlyZWQuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgb3Ige31cbiAgICBvcHRpb25zLnN0YXJ0ID0gb3B0aW9ucy5zdGFydCBvciAne3snXG4gICAgb3B0aW9ucy5lbmQgPSBvcHRpb25zLmVuZCBvciAnfX0nXG4gICAgb3B0aW9ucy5wYXJhbXMgPSBvcHRpb25zLnBhcmFtcyBvciBbJ2knXVxuICAgIFxuICAgICMgcGFyc2UgdGhlIGV4cHJlc3Npb24uXG4gICAgcGFydHMgPSBwYXJzZSBleHByZXNzaW9uLCBvcHRpb25zXG4gICAgXG4gICAgIyBidWlsZCB0aGUganMgc25pcHBldC5cbiAgICBqcyA9IGJ1aWxkIHBhcnRzLCBvcHRpb25zXG4gICAgXG4gICAgIyBjb21waWxlIHRoZSBmdW5jdGlvbi5cbiAgICBmbiA9IGNvbXBpbGUganMsIG9wdGlvbnMucGFyYW1zXG5cbiAgICAjIGN1cnJ5OiBpZiB3ZSBoYXZlIHZhbHVlcywgcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uLlxuICAgIGlmIHZhbHVlcz9cbiAgICAgICAgZm4gdmFsdWVzLi4uXG4gICAgIyBvdGhlcndpc2UgcmV0dXJuIHRoZSBmdW5jdGlvbiBmb3IgbGF0ZXIgdXNlLlxuICAgIGVsc2VcbiAgICAgICAgZm5cblxuIyByZWdpc3RlciB0aGUgbW9kdWxlIHdpdGggd2hpY2hldmVyIG1vZHVsZSBzeXN0ZW0gaXMgYXZhaWxhYmxlLlxuZG8gKCkgLT5cbiAgICAjIGNoZWNrIGZvciBDb21tb25KU1xuICAgIGlmIG1vZHVsZT8gYW5kIG1vZHVsZS5leHBvcnRzP1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGludGVycGFyc2VcbiAgICAjIGNoZWNrIGZvciBBTURcbiAgICBlbHNlIGlmIHR5cGVvZiByZXF1aXJlPy5zcGVjaWZpZWQgPT0gXCJmdW5jdGlvblwiIGFuZCByZXF1aXJlLnNwZWNpZmllZChwa2cpXG4gICAgICAgIGRlZmluZSBwa2csIFtdLCAoKSAtPiBpbnRlcnBhcnNlXG4gICAgIyBjaGVjayBmb3IgYnJvd3NlciBnbG9iYWxcbiAgICBlbHNlIGlmIHdpbmRvdz9cbiAgICAgICAgd2luZG93LmludGVycGFyc2UgPSBpbnRlcnBhcnNlXG4gICAgIyB3aGVyZSBhbSBJIGV4YWN0bHk/XG4gICAgZWxzZVxuICAgICAgICBpbnRlcnBhcnNlIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9