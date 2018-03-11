/**
 * seek inside object without recursive function
 * @param {Object} obj object to seek trough
 * @param {function} cb function to call on each node
 *        path : Array
 *        node
 *        key
 *        parent
 * @param {String} childKey optional, if set, so the seconde form
 *
 * Trees could have two forms:
 * {
 * 	a : {
 * 		a1 : value
 * 		a2 : value
 * 	}
 * }
 *
 * or
 * {
 * 	a : {
 * 		nodes : [
 * 		  {},
 * 		  {}
 * 		]
 * 	}
 * }
 */

function _objSeek(obj, cb, childKey = null){
	assert(typeof obj === 'object' && obj !== null, 'incorrect input object');
	assert(typeof cb === 'function', 'cb must be function');
	assert(childKey === null || typeof childKey === 'string', 'childKey must be string');

	return childKey === null ? _objSeekMode1(obj, cb) : _objSeekMode2(obj, cb, childKey);
}

function _objSeekMode1(obj, cb){
	var nodeMap		= new WeakMap(),
		avoidCycle	= new WeakSet(),

		currentNode		= obj,
		currentNodeMeta	= {
			path	: [],
			key		: null,
			node	: currentNode
		},

		childNodes,
		childName,
		childNode,
		childNodeMeta, // childNode metadata
		childCount,

		lastNode	= currentNode;
	// call for current obj
	if(cb(currentNodeMeta) === false) return false;
	nodeMap.set(currentNode, currentNodeMeta);
	// go through childs
	do {
		// get child nodes
		if(Array.isArray(currentNode)){
			childNodes	= null;
			childCount	= currentNode.length;
		} else {
			childNodes	= Reflect.ownKeys(currentNode);
			childCount	= childNodes.length;
		}

		// iterate inside childNodes
		for (var i = 0; i < childCount; ++i) {
			childName	=( childNodes === null ? i : childNodes[i]);
			childNode	= currentNode[childName];
			// last node metadata
			currentNodeMeta		= nodeMap.get(currentNode);
			// child meta data
			childNodeMeta	= {
				key			: childName,
				node		: childNode,
				parent		: currentNode,
				parentMeta	: currentNodeMeta,
				path		: currentNodeMeta.path.concat(childName)
			};
			// not plain object
			if(typeof childNode !== 'object' || childNode === null){}
			// cycle
			else if(avoidCycle.has(childNode))
				childNodeMeta.cycle	= true;
			// new
			else {
				avoidCycle.add(childNode); // avoid cyclic
				// set as the next for the prev
				nodeMap.get(lastNode).next	= childNode; // set as next to prev
				// save currentNode metadata
				nodeMap.set(childNode, childNodeMeta);
				lastNode	= childNode;
			}
			// call fx
			if(cb(childNodeMeta) === false) return false;
		}
		// go to next node
		currentNodeMeta= nodeMap.get(currentNode);
		currentNode	= currentNodeMeta && currentNodeMeta.next;
	} while(currentNode);
}

function _objSeekMode2(obj, cb, childKey){
	const EMPTY_ARRAY	= {length: 0}; // do not make this global to avoid some user mistakes

	var nodeMap		= new WeakMap(),
		avoidCycle	= new WeakSet(),

		currentNode		= obj,
		currentNodeMeta	= {
			path	: [],
			key		: null,
			node	: currentNode
		},

		childNodes,
		childIndex,
		childNode,
		childNodeMeta, // childNode metadata

		lastNode	= currentNode;
	// call for current obj
	if(cb(currentNodeMeta) === false) return false;
	nodeMap.set(lastNode, currentNodeMeta);
	// go through childs
	do {
		// get child nodes
		childNodes	= currentNode[childKey];
		if(!childNodes)
			childNodes	= EMPTY_ARRAY;
		else if(!Array.isArray(childNodes))
			childNodes	= [childNodes];

		// iterate inside childNodes
		for (var childIndex = 0, len = childNodes.length; childIndex < len; ++childIndex) {
			childNode	= childNodes[childIndex];
			// last node metadata
			currentNodeMeta		= nodeMap.get(currentNode);
			// child meta data
			childNodeMeta	= {
				key			: childIndex,
				node		: childNode,
				parent		: currentNode,
				parentMeta	: currentNodeMeta,
				path		: currentNodeMeta.path.concat(childKey, childIndex)
			};
			// not plain object
			if(typeof childNode !== 'object' || childNode === null){}
			// cycle
			else if(avoidCycle.has(childNode))
				childNodeMeta.cycle	= true;
			// new
			else {
				avoidCycle.add(childNode); // avoid cyclic
				// set as the next for the prev
				nodeMap.get(lastNode).next	= childNode; // set as next to prev
				// save currentNode metadata
				nodeMap.set(childNode, childNodeMeta);
				lastNode	= childNode;
			}
			// call fx
			if(cb(childNodeMeta) === false) return false;
		}
		// go to next node
		currentNodeMeta= nodeMap.get(currentNode);
		currentNode	= currentNodeMeta && currentNodeMeta.next;
	} while(currentNode);
}