var objUtils	= require('../');

var obj = {
	attr1: {
		attr11 : 'hello',
		attr12	: 'world'
	},

	attr2 : {
		attr21: null,
		attr22: {},
		attr23: function(){},
		attr24: 45,
		attr25:{
			attr251: 'hello'
		}
	}
};

var obj2 = {
	p1: {},
	p2: 154,
	nodes: [
		{
			kk:'ll'
		},
		{
			kk:'ll'
		},
		{
			kk:'ll',
			nodes	:[
				{v:5}
			]
		},
		{
			kk:'ll'
		}
	]
};

objUtils.seek(obj2, meta => {
	console.log('>> key: ', meta.key, ', path: ', meta.path);
}, 'nodes');