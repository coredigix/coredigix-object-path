objUtils	= require('../');

obj = {
	attr1: {
		attr11 : 'hello',
		attr12	: 'world'
	}
};


var a = objUtils.path({
	input	: obj,
	path	: 'a.attr1.attr11',
	childkey:'nodes',
	template: {
		nodes: []
	}
});

console.log('found>>', a.resolved)
console.log('value>>', a.value)
console.log('path>>', a.path)

a.build();

a.value="hello khalid";

console.log('found>>', a.resolved)
console.log('path>>', a.path)
console.log('value>>', a.value)

console.log('obj>> ', obj)