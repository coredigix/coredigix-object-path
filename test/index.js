objUtils	= require('../');

obj = {
	attr1: {
		attr11 : 'hello',
		attr12	: 'world'
	}
};


var a = objUtils.path({
	input	: obj,
	path	: 'a.attr1.attr11'
});

console.log('found>>', a.resolved)
console.log('value>>', a.value)

a.build();

console.log('found>>', a.resolved)
console.log('value>>', a.value)