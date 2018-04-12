/**
 * execute a callBack function on all tree nodes without using a recursive function
 * usefull when the operation on each node do not depends on the result on the child nodes
 * (could depends on parents results or not)
 * @param {Object} input tree object
 * @param {function} cb the callback to execute on each node
 *                      when cb returns false: skip the process
 *                      when cb returns -1	: exclude this node from compiled version
 *                      when cb returns -2	: exclude subtree
 *                      when cb returns -3	: exclude node & do not fetch subtree
 * @param {String|undefined} childKey usefull when the tree has mode2, see modes in examples
 *
 * Mode1:
 * =================
 * in this mode, the tree has the next form
 * input= {
 * 		attr1 : {
 * 			attr11: ...
 * 			attr12: ...
 * 		},
 * 		attr2 : [
 * 			'value21',
 * 			{
 * 				attr211: ...
 * 			}
 * 		]
 * }
 * in this case, each attribute is a node
 *
 * Mode2:
 * ========================
 * in this case, the tree has this form
 * {
 * 		attr1: {
 * 			property11: ...
 * 			property12:
 * 			children: [
 * 				{},
 * 				'',
 * 				{
 * 					children: {}
 * 				}
 * 			]
 * 		},
 * 		attr2 : {
 * 			property21 : ...
 * 			property22 : ...
 * 			children : {
 * 				key1: {},
 * 				key2: 'value',
 * 				key3: {
 * 					children: {}
 * 				}
 * 			}
 * 		}
 * }
 * in this mode, each node has properties, nodes are foldred inside the property "children"
 * so in this case we specify "childkey" to "children"
 *
 *
 * if cb is undefined, the function steel will returns a compiled version of the tree,
 * the returned object has those utilities
 * {
 * 		
 * }
 */

function _objSeek(input, cb, childKey){
	var nodeMap, avoidCycle, iterationCb, inputMeta, parentNode, parentNodeMeta, childNodes, nodeMeta, i, len;

	assert(typeof input === 'object' && input !== null, 'Illegal arguments');
	assert(typeof cb === 'function', 'cb must be function');
	assert(childKey === undefined || typeof childKey === 'string', 'childKey must be string');

	// compile version
	var compileArr = [];
	var avoidNode, avoidSubtree, cbResult;
	// iteration cb
	var iterationCb = (key => {
		node	= childNodes[key];
		nodeMeta	= {
			key			: key,
			node		: node,
			parent		: parentNode,
			parentMeta	: parentNodeMeta,
			path		: partialPath.concat(i)
		};
		// callBack
		if(cb !== undefined){
			cbResult = cb(nodeMeta);
			if(cbResult === false)
				throw 'skiped';
			avoidNode	= cbResult === -1 || cbResult === -3;
			avoidSubtree= cbResult === -2 || cbResult === -3;
		}
		else{
			avoidNode	= false;
			avoidSubtree= false;
		}
		// store in compiled array
		if(avoidNode === false)
			compileArr.push(nodeMeta);
		// not plain object
		if(typeof node !== 'object' || node === null){}
		// cycle
		else if(avoidCycle.has(node))
			nodeMeta.cycle	= true;
		// new
		else{
			avoidCycle.add(node); // avoid cyclic
			// set as the next for the prev
			if(avoidSubtree === false){
				nodeMap.get(lastNode).next	= nodeMeta; // set as next to prev
				// save currentNode metadata
				nodeMap.set(node, nodeMeta);
				lastNode	= node;
			}
		}
	});
	// compile and execute
	try{
		lastNode		= input;
		inputMeta	=  {
			path	: [],
			key		: null,
			node	: lastNode
		};
		// exec cb on the root obj
		if(cb !== undefined && cb(inputMeta) === false) throw 'skiped';
		// node metadata
		nodeMap			= new WeakMap();
		avoidCycle		= new WeakSet();
		nodeMap.set(input, inputMeta);
		avoidCycle.add(input);
		parentNodeMeta	= inputMeta;
		compileArr.push(inputMeta);
		rootLoop: do {
			parentNode	= parentNodeMeta.node;
			partialPath	= parentNodeMeta.path;
			if(childKey === undefined){ // form 1
				// partialPath	= parentNodeMeta.path;
				childNodes	= parentNode;
			} else { // form 2
				if(Reflect.has(parentNode, childKey) === false)
					continue;
				childNodes	= parentNode[childKey];
				// partialPath	= parentNodeMeta.path.concat(childKey);
			}
			// get child nodes
			if(Array.isArray(childNodes)){
				for(i=0, len = childNodes.length; i < len; ++i)
					iterationCb(i);
			} else {
				for(i in childNodes)
					iterationCb(i);
			}
		} while((parentNodeMeta = parentNodeMeta.next) !== undefined);
	} catch (err) {
		if(err === 'skiped')
			compileArr = false;
		else throw err;
	}
	// return compiled version of the tree
	return compileArr;
}