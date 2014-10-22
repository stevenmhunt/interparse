
interparse = require '../interparse'

###
 A basic test for coffeescript style interpolation.
###
exports['Coffeescript style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is #{name}'

    options =
        start: '#{'
        end: '}'

    values = ['John']    

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()

###
 A basic test for mustache/handlebars style interpolation.
###
exports['"Stash" style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
###
 A basic test for underscore style interpolation.
###
exports['Underscore style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is <%= name %>'

    options =
        start: '<%='
        end: '%>'

    values = ['John']    

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
###
 A basic test for three parameter variant.
###
exports['Three parameter test'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()

###
 A basic test for two parameter variant.
###
exports['Two parameter test'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    fn = interparse options, exp
    result = fn values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()

###
 A basic test for two parameter variant.
###
exports['Two parameter test, legacy parameters'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    fn = interparse exp, options
    result = fn values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
    
###
 A basic test for one parameter variant, followed by a two parameter call.
###
exports['One parameter test, followed with a two parameter call'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    fn = interparse options
    result = fn exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
###
 A basic test for one parameter variant, followed by two one parameter calls.
###
exports['One parameter test, followed with two one parameter calls'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = ['John']    

    # act
    fn = interparse options
    fn2 = fn exp
    result = fn2 values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
###
 Alternate values format: string.
###
exports['Interpolation with a string'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = 'John'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
    
###
 Alternate values format: object.
###
exports['Interpolation with an object'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'

    values = 
        name: 'John'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
###
 Alternate values format: object, multiple values.
###
exports['Multiple interpolation with an object'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{firstName}} {{lastName}}'

    options =
        start: '{{'
        end: '}}'

    values = 
        firstName: 'John'
        lastName: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()
    
###
 Options string format.
###
exports['Multiple interpolation with options string'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{firstName}} {{lastName}}'
    options = '{{<value>}}'

    values = 
        firstName: 'John'
        lastName: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()
    
###
 Missing the close tag on an interpolated value.
###
exports['Missing close tag'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{firstName}} {{lastName'
    options = '{{<value>}}'

    values = 
        firstName: 'John'
        lastName: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John {{lastName", result
    test.done()
    ###
 Missing the close tag on an interpolated value.
###
exports['Missing close tag'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{firstName}} {{lastName'
    options = '{{<value>}}'

    values = 
        firstName: 'John'
        lastName: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John {{lastName", result
    test.done()

###
 Multiple close tags on an interpolated value.
###
exports['Multiple close tags'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{firstName}} {{lastName}}}}'
    options = '{{<value>}}'

    values = 
        firstName: 'John'
        lastName: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith}}", result
    test.done()

###
 Interpolation of child values.
###
exports['Interpolation of child property values'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name.first}} {{name.last}}'
    options = '{{<value>}}'

    values = 
        name:
            first: 'John'
            last: 'Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()
    
###
 Interpolation of child values.
###
exports['Interpolation of child array values'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name[0]}} {{name[1]}}'
    options = '{{<value>}}'

    values = 
        name: ['John', 'Smith']

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()
    
###
 Interpolation of array join.
###
exports['Interpolation of array join'] = (test) ->
    
    # arrange
    exp = "Hello my name is {{ name.join(' ') }}"
    options = '{{<value>}}'

    values = 
        name: ['John', 'Smith']

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()
    
###
 Interpolation of a function.
###
exports['Interpolation of a function'] = (test) ->
    
    # arrange
    exp = "Hello my name is {{ printName() }}"
    options = '{{<value>}}'

    values = 
        printName: () -> 'John Smith'

    # act
    result = interparse options, exp, values
    
    # assert
    test.equals "Hello my name is John Smith", result
    test.done()