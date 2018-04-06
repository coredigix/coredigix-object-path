function objSeek(input, cb, childKey){
	assert(typeof input === 'object' && input !== null, 'Illegal arguments');
	assert(typeof cb === 'function', 'cb must be function');
	assert(childKey === undefined || typeof childKey === 'string', 'childKey must be string');

	// node metadata
	var nodeMap		= new WeakMap(),
		avoidCycle	= new WeakSet();
	var currentNodeMeta;
	// iteration cb
	var iterationCb = ((nodeKey, node, parentNode) => {
		currentNodeMeta	= nodeMap.get(currentNode);

	});
	// exec seek
	currentNode	= input;
}