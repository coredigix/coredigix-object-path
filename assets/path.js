/**
 * Go Through object
 *
 * $$.path(
 * 		input	: obj, // object to go through
 * 		path	: '.a.b.c' | ['a', 'b', 'c'],
 * 		children: 'childrenKey' | ['childrenK1', ...],
 * 		template: obj or array, // default to {}
 * 		upsert	: true | false, // create path if not exists, implicitly true if template is set
 * 		value	: ..., // if exists, set this value as last element in the path
 * );
 *
 * path examples:
 * 		'a.b.c.d'
 * 		'a.0.4.78c.ll'
 * 		'key.ke\\.y2.key3'	// we can escape period with .
 * 		'vv..lll'			// .. or empty key means look at all kies
 * 		'key1.key11,key12,key1n.cc.dd' // we can chose multiple keys of same level by separate them with commas
 *
 * 		['a', 'b', 'c', 'd']
 * 		['a', 0, 4, '78c', 'll']
 * 		['key', 'ke.y2', 'key3']
 * 		['v', '', 'lll']
 * 		[key1, ['key11','key12','key1n'], 'cc', 'dd']
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
		children= options.children,
		template= options.template,
		upsert	= options.template,
		value	= options.value;
	// path
	if(typeof path === 'string')
		path	= strUtils.split(path, '.').map(e => strUtils.split(e, ','));
}