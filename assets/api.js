
const objUtils	= {
	path		: objPath,

	seek		: _objSeek,

	clone		: function(obj){ return cloner.shallow.copy(obj); },
	deepClone	: function(obj){ return cloner.deep.copy(obj); },
	merge		: function(){ return cloner.shallow.merge.apply(cloner.shallow, arguments); },
	deepMerge	: function(){ return cloner.deep.merge.apply(cloner.deep, arguments); },

	isPlainObj	: isPlainObj,
	isEmpty		: isEmpty
};

//=require cloner.js
//=require path.js
//=require checks.js
//=require seeker.js

