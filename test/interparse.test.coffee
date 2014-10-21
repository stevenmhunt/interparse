
interparse = require '../interparse'

exports['Coffeescript style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is #{name}'

    options =
        start: '#{'
        end: '}'
        params: ['name']

    values = ['John']    

    # act
    result = interparse exp, options, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()

exports['"Stash" style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is {{name}}'

    options =
        start: '{{'
        end: '}}'
        params: ['name']

    values = ['John']    

    # act
    result = interparse exp, options, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()
    
exports['Underscore style interpolation'] = (test) ->
    
    # arrange
    exp = 'Hello my name is <%= name %>'

    options =
        start: '<%='
        end: '%>'
        params: ['name']

    values = ['John']    

    # act
    result = interparse exp, options, values
    
    # assert
    test.equals "Hello my name is John", result
    test.done()