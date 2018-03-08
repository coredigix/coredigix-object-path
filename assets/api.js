//=require cloner.js
//=require path.js

const objUtils	= {
	path		: objPath,

	clone		: function(obj){ return cloner.shallow.copy(obj); },
	deepClone	: function(obj){ return cloner.deep.copy(obj); },
	merge		: function(){ return cloner.shallow.merge.apply(cloner.shallow, arguments); },
	deepMerge	: function(){ return cloner.deep.merge.apply(cloner.deep, arguments); }
};