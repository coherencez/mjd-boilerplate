'use strict';

const math = require('./math');
const $ = require('jquery');

console.log("math", math);
console.log("add", math.add);
console.log("sum", math.add(5, 10));
console.log("$", $('<button/>'));