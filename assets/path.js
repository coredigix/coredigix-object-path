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
		upsert	= options.upsert || !!options.template;
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
	// path
	if(typeof path === 'string')
		path	= strUtils.split(path, '.').map(e => strUtils.split(e, ','));
	else if(!Array.isArray(path)) throw new Error('uncorrect path.');

	var currentNode		= input,
		parentNode		= null,
		parentObj		= null,
		attrKey,
		tmpValue,
		pos,
		len;
	// get the maximum accessible path
	for(pos=0, len = path.length; pos < len, ++pos){
		attrKey		= path[pos];
		parentNode	= currentNode;

		// get the parentObj
		if(childkey === null)
			parentObj	= parentNode;
		else {
			if(!parentNode.hasOwnProperty(childkey))
				break;
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
				if(attrKey < 0) break;
			}
			else if(attrKey > parentObj.length)
				break;
		}
		else if(parentObj.hasOwnProperty(attrKey) === false)
			break;
		currentNode	= parentObj[attrKey];
	}
	// result
	var result	= {
		[PATH_RESOLVED_SYMB]	: indx >= path.length,
		[PATH_PRIVATE]			: {
			path		: path,
			pos			: pos,
			currentNode	: currentNode,
			parentNode	: parentNode,
			parentObj	: parentObj,
			attrKey		: attrKey,
			template	: options.template || {}
		}
	};
	Object.setPrototypeOf(result, PATH_PROTO);

	// upsert
	if(upsert && indx < path.length)
		result.build(); // make the path
	return result;
}

// consts
const	PATH_RESOLVED_SYMB	= Symbol(),
		PATH_PRIVATE		= Symbol();

/** Prototype */
const PATH_PROTO = {
	assertResolved	: function(){
		if(this[PATH_RESOLVED_SYMB] !== true)
			throw new Error('Path not resolved');
	},
	get value(){
		this.assertResolved();
		return this[PATH_PRIVATE].currentNode;
	},
	set value(vl){
		this.assertResolved();
		this[PATH_PRIVATE].parentObj[attrKey]	= value;
	}

	get resolved(){return this[PATH_RESOLVED_SYMB]},
	get exists(){return this[PATH_RESOLVED_SYMB]},

	build	: function(){
		var private	= this[PATH_PRIVATE],
			currentNode	= private.currentNode,
			parentObj	= private.parentObj,
			path		= private.path,
			template	= private.template,
			childkey	= private.childkey,
			attrKey,
			parentNode;
		for(var pos	= private.pos, len = path.length; ++pos){
			attrKey		= path[pos];
			parentNode	= currentNode;

			// get the parentObj
			if(childkey === null)
				parentObj	= parentNode;
			else {
				if(!parentNode.hasOwnProperty(childkey))
					break;
				parentObj	= parentNode[childkey];
			}
		}
	}
};