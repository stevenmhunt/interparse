var interparse = require('../interparse')

console.log("Ruby/Coffeescript style interpolation.");
(function () {
    var options = { start: "#{", end: "}", params: ["name"] };
    var fn = interparse("my name is #{name}", options);
    var result = fn("Steven");
    console.log(result);
}());

console.log("\"Stash\" style interpolation.");
(function () {
    var options = { start: "{{", end: "}}", params: ["name"] };
    var fn = interparse("my name is {{name}}", options);
    var result = fn("Steven");
    console.log(result);
}());
    
console.log("Underscore style interpolation.");
(function () {
    var options = { start: "<%=", end: "%>", params: ["name"] };
    var fn = interparse("my name is <%= name %>", options);
    var result = fn("Steven");
    console.log(result);
}());