Interparse JS
=============

[![Build Status](https://travis-ci.org/stevenmhunt/interparse.svg)](https://travis-ci.org/stevenmhunt/interparse)

## What is it?
A toolkit for implementing string interpolation in your application. The resultant expression is compiled into a function for simple reuse.

## API Documentation

    interparse(expression, options [, values])

#### Expression
A string value containing a mix of plain string data and interpolated values.

#### Options
- _start_: The starting delimiter for interpolated values.
- _end_: The ending delimiter for interpolated values.
- _params_: A list of top level variable names used in the expression.

#### Values (optional)
An array of values representing the top level variable names provided earlier.

#### Possible Return Values
- If _values_ is null: a compiled function that will produce the given interpolated string's output when provided with the required parameters. Example:
      var fn = interparse(expression, options);
      var result = fn(model);
- If _values_ is not null: the result of the interpolation with the given parameters.
      var result = interparse(expression, options, model);

## How to use
#### In Node.js
    var interparse = require('interparse');
#### In a browser
    <script type="text/javascript" src="interparse.js"></script>
    
Interparse supports CommonJS, AMD, and the _window_ object out the box.
## Examples

#### Ruby/CoffeeScript Style
    var options = { start: "#{", end: "}", params: ["name"] };
    var fn = interparse("my name is #{name}", options);
    var result = fn("Steven");
    
#### "Stash" Style
    var options = { start: "{{", end: "}}", params: ["name"] };
    var fn = interparse("my name is {{name}}", options);
    var result = fn("Steven");
    
#### Underscore Style
    var options = { start: "<%=", end: "%>", params: ["name"] };
    var fn = interparse("my name is <%= name %>", options);
    var result = fn("Steven");
