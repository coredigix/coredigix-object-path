/** is plein object */

function isPlainObj(obj){
	return typeof obj === 'object'
			&& obj.__proto__ === Object.prototype;
}

/** isEmpty */
function isEmpty(obj){
	if(Reflect.has(obj, 'length'))
		return obj.length === 0;
	else {
		for(var i in obj)
			return false;
		return true;
	}
}
