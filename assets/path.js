/**
 * Go Through object
 *
 * $$.path(
 * 		input	: obj, // object to go through
 * 		path	: 'a.b.c' | ['a', 'b', 'c'],
 * 		childkey: 'childrenKey' | ['childrenK1', ...],
 * 		template: obj or array, // default to {}
 * 		upsert	: true | false, // create path if not exists, implicitly true if template is set
 * );
 *
 * @return {
 *       get found	: true if the path exists
 *       get exists	: alias to .found
 *       
 *       get value	: objectValue,// first found value
 *       set value	: set value to first found object
 *
 * 		 get values	: list of found values, case of multiple possible values
 * 		 set values : set value to multiple possible values
 *         
 *       get isCreated	: true|false // if the object is created by this api
 *       create()	// create the path if not created
 *
 * 		// if path do not exists, get the subPath that exists
 *       currentPath 		: current path (=path if upsert or created)
 *       get currentValue	: max found object
 *       set currentValue
 * }
 *
 * path examples:
 * 		'a.b.c.d'
 * 		'a.0.4.78c.ll'
 * 		'key.ke\\.y2.key3'	// we can escape period with .
 *
 * 		['a', 'b', 'c', 'd']
 * 		['a', 0, 4, '78c', 'll']
 * 		['key', 'ke.y2', 'key3']
 *
 * $$.hasPath(inputObj, path)
 */

function objPath(options){
	// control
	assert(arguments.length === 1, 'Needs exactly one argument.');
	assert(options.hasOwnProperty('input'), 'options.input required');
	assert(options.hasOwnProperty('path'), 'options.path required');
	// vars
	var input	= options.input,
		path	= options.path,
		childkey= options.childkey || null,
		template= options.template || null,
		upsert	= options.upsert || template != null;
	// path
	if(typeof path === 'string')
		path	= strUtils.split(path, '.');
	else if(
		Array.isArray(path)
		&& path.every(ele => typeof ele === 'string' || typeof ele === 'number')
	){}
	else throw new Error('uncorrect path.');

	var currentNode		= input,
		parentNode		= null,
		parentObj		= null,
		attrKey,
		tmpValue,
		pos				= 0,
		len				= path.length,
		resolved;
	// path
	function seekPath(){
		// chilkey and template
			if(
				childkey !== null
				&& upsert === true
				&& !(
					options.template
					&& options.template.hasOwnProperty(childkey)
				)
			)
				throw new Error('When "childkey" and "template" or "upsert" are set, "childkey" is required inside "template"');
		for(; pos < len; ++pos){
			attrKey		= path[pos];
			parentNode	= currentNode;

			// get the parentObj
			if(childkey === null)
				parentObj	= parentNode;
			else {
				if(!parentNode[childkey]){
					if(upsert === true)
						parentNode[childkey] = (template === null? {} : objUtils.deepClone(template[childkey]));
					else break;
				}
				parentObj	= parentNode[childkey];
			}
			// get the next child
			if(Array.isArray(parentObj)){
				if(isNaN(attrKey))
					throw new Error('Illegal attribute "' + attrKey +'" for an array');
				if(typeof attrKey === 'string')
					attrKey	= parseInt(attrKey);
				if(attrKey < 0){
					attrKey	+= parentObj.length;
					if(attrKey < 0) throw new Error('Array out of bound');
				}
				else if(attrKey > parentObj.length && upsert === false)
					break;
			}
			// else if(parentObj.hasOwnProperty(attrKey) === false){
			// 	break;
			// }
			// create child if not exists
			if(parentObj[attrKey])
				currentNode	= parentObj[attrKey]
			else if(upsert === true)
				currentNode	= parentObj[attrKey] = (template === null ? {} : objUtils.deepClone(template));
			else break;
		}
		resolved	= pos >= path.length;
	}
	// get the maximum accessible path
	seekPath();
	// result
	var result	= {
		build	: function(){
			upsert	= true;
			return seekPath();
		},
		get value(){ return currentNode },
		set value(vl){
			if(resolved) parentObj[attrKey]	= vl;
			else throw new Error('Path not resolved');
		},

		get resolved(){ return resolved },
		get exists(){ return resolved },

		get path(){ return resolved ? path : path.slice(0, pos); }
	};
	return result;
}
