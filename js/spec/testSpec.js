'use strict';
var math = require('../math'),
		bar = math.bar;

describe('foo', function () {
	it('should have a bar function', function () {
		expect(bar).toBeDefined();
	});
});