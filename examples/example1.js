var interparse = require('../interparse')

console.log("Ruby/Coffeescript style interpolation.");
(function () {
    var options = { start: "#{", end: "}" };
    var fn = interparse(options, "my name is #{name}");
    var result = fn(["Steven"]);
    console.log(result);
}());

console.log("\"Stash\" style interpolation.");
(function () {
    var options = { start: "{{", end: "}}" };
    var fn = interparse(options, "my name is {{name}}");
    var result = fn(["Steven"]);
    console.log(result);
}());
    
console.log("Underscore style interpolation.");
(function () {
    var options = { start: "<%=", end: "%>" };
    var fn = interparse(options, "my name is <%= name %>");
    var result = fn(["Steven"]);
    console.log(result);
}());

console.log("Interpolation with a string.");
(function () {
    var options = { start: "<%=", end: "%>" };
    var fn = interparse(options, "my name is <%= name %>");
    var result = fn("Steven");
    console.log(result);
}());

console.log("Interpolation with an object.");
(function () {
    var options = { start: "<%=", end: "%>" };
    var fn = interparse(options, "my name is <%= name %>");
    var result = fn({
        name: "Steven"
    });
    console.log(result);
}());

console.log("Multiple interpolation with an object.");
(function () {
    var options = { start: "<%=", end: "%>" };
    var fn = interparse(options, "my name is <%=firstName%> <%=lastName%>");
    var result = fn({
        lastName: "Smith",
        firstName: "John"
    });
    console.log(result);
}());

console.log("Fast options format.");
(function () {
    var fn = interparse("my name is <%=firstName%> <%=lastName%>", "<%=<value>%>");
    var result = fn({
        lastName: "Smith",
        firstName: "John"
    });
    console.log(result);
}());

console.log("No end tag");
(function () {
    var fn = interparse("<%=<value>%>", "my name is <%=firstName%> <%=lastName");
    var result = fn({
        lastName: "Smith",
        firstName: "John"
    });
    console.log(result);
}());

console.log("Multiple end tags");
(function () {
    var fn = interparse("<%=<value>%>", "my name is <%=firstName%> <%=lastName%>%>");
    var result = fn({
        lastName: "Smith",
        firstName: "John"
    });
    console.log(result);
}());

console.log("Iterations");
(function () {
    var options = "<%=<value>%>";
    var fn = interparse(options, "List of things: <%= items.join(', ') %>");
    var result = fn({
        items: ["item 1", "item 2", "item 3"]
    });
    console.log(result);
}());
