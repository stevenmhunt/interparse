Interparse JS
=============

[![Build Status](https://travis-ci.org/stevenmhunt/interparse.svg)](https://travis-ci.org/stevenmhunt/interparse)

## What is it?
A toolkit for implementing string interpolation in your application. The resultant expression is compiled into a function for simple reuse.

## API Documentation

    interparse(options [, expression] [, values])

#### Options

*Using JSON Format*

- _start_: The starting delimiter for interpolated values.
- _end_: The ending delimiter for interpolated values.
- _params_: (Optional) A list of top level variable names used in the expression. The 
parser will attempt to auto-detect required names. For example, `{{name}}` would
be detected as a named parameter "name" if you're using a "stash" format.

*Using String Format*

You can also specify options with a string in the following format:
`<start><value><end>`

For example, for Ruby/CoffeeScript style interpolation:
`#{<value>}`

#### Expression (optional)
A string value containing a mix of plain string data and interpolated values.

#### Values (optional)
An array or objects containing values representing the top level variable names provided earlier.
You can also provide a string if there is only one named parameter in the interpolation.

#### Possible Return Values
- If _options_ and _values is not provided: a function with the following format:
      interparseWithOptions(expression[, values])
This function is capable of compiling expressions as well as running them using
the options provided in the original call to `interparse()`. Possible use cases for
this function include if you have a single interpolation format and multiple expressions,
but you don't want to pass your options object around.


- If _values_ is not provided: a compiled function that will produce the given interpolated string's output when provided with the required parameters. Example:
      var fn = interparse(options, expression);
      var result = fn(model);
- If all three parameters are provided: the result of the interpolation with the given parameters.
      var result = interparse(options, expression, model);

## How to use
#### In Node.js
    var interparse = require('interparse');
#### In a browser
    <script type="text/javascript" src="interparse.js"></script>
    
Interparse supports CommonJS, AMD, and the _window_ object out the box.
## Examples

#### Ruby/CoffeeScript Style
    var fn = interparse("#{<value>}", "my name is #{name}");
    var result = fn(["Steven"]);
    
#### "Stash" Style
    var fn = interparse("{{<value>}}", "my name is {{name}}");
    var result = fn("Steven");
    
#### Underscore Style
    var fn = interparse("<%=<value>%>", "my name is <%= name %>");
    var result = fn({ name: "Steven" });

For more examples, take a look at the /examples folder or inspect the unit tests.