var _ = require("./underscore");
_.mixin({
	    /* Retrieve the keys and values of an object's properties.
	     {a:'a',b:'b'} -> [[a,'a'],[b,'b']]
	     */
	    pairs:function (obj) {
		return _.map(obj,function(val,key){
				 return [key,val];
			     });}});

_.mixin({
	    /*converts an array of pairs into an objcet
	     * [[a,'a'],[b,'b']] ->  {a:'a',b:'b'}
	     */
	    toObject:function(pairs){
		return _(pairs).reduce(function(total,cur){
					   var key = _.first(cur),
					   val = _.last(cur);
					   total[key] = val;
					   return total;
				       },{});}});

_.mixin({
	    /*create an object with only the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {a:'a'}
	     */
	    selectKeys:function (obj,keys){
		return  _(obj).filter$(function(val,key){return _.contains(keys,key);});
	    },
	    selectKeys_F:function (keys){
		return function(obj){
		    return  _.selectKeys(obj,keys);
		};
	    },
	    selectKeysIf:function (obj,keys,filterFn){
		return  _(obj).filter$(
		    function(val,key){
			return _.contains(keys,key) && filterFn(val);
		    });
	    }
	});


_.mixin({
	    /*create an object without the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {b:'b'}
	     */
	    removeKeys:function (obj,keys){
		return _.filter$(obj,function(val,key){return !_.contains(keys,key);});
	    }});

// unEscape a string for HTML interpolation.
_.mixin({
	    //this function is in underscore.string
	    unEscape : function(string) {
		return (''+string)
		    .replace(/&lt;/g,    '<')
		    .replace(/&gt;/g,    '>')
		    .replace(/&quot;/g,  '"')
		    .replace(/&#x27;/g,  "'")
		    .replace(/&#x2F;/g,  '\/')
		    .replace(/&amp;/g,   '&');
	    }});

_.mixin({isNotEmpty:function (obj){
	     return !_.isEmpty(obj);
	 },
	 isLastEmpty:function (array){
	     return _.isEmpty(_.last(array));
	 },
	 isFirstEmpty:function (array){
	     return _.isEmpty(_.first(array));
	 },
	 isFirstNotEmpty:function (array){
	     return !_.isEmpty(_.first(array));
	 },
	 isLastNotEmpty:function (array){
	     return !_.isEmpty(_.last(array));
	 },
	 second:function (array){
	     return _.first(_.rest(array));
	 },
	 isDefined:function(obj){
	     return !_.isUndefined(obj);
	 }
	});


_.mixin({renameKeys:function (toEdit,fieldMap){
	     if(_.isArray(fieldMap)){
		 var fMap = _.chain(fieldMap).flatten().partition(2).toObject(fieldMap).value();
	     }
	     else{
		 var fMap = fieldMap;
	     }
	     return _.map$(toEdit,function(val,key){
			       if(_.isDefined(fMap[key])){
				   return [fMap[key],val];
			       }
			       else return [key,val];
			   });
	 },
	 renameKeys_F:function (fieldMap){
	     return function(toEdit){
		 return _.renameKeys(toEdit,fieldMap);
	     };
	 },
	 mapRenameKeys:function (list,fieldMap){
	     return _.map(list,_.renameKeys_F(fieldMap));    
	 }
});

_.mixin({merge:function (objArray){
	     //merges all of the objects in an array into one object
	     //probably can be done via apply.extend([...])
	     return _.reduce(objArray,function(sum,cur){return _.extend(sum,cur);},{});
	 },
	 mapMerge:function(lists){
	     return _.map(lists,_.merge);
	 },
	 zipMerge:function (){
	     return _.map(_.zip.apply(null,arguments),
                          function(zipped){return _.merge(zipped);});
	 }});

_.mixin({extend_r:function (obj1,obj2){
	     //recursive extend
	     function mergeRecursive(obj1, obj2) {
		 for (var p in obj2) {
		     if (_.isObject(obj2[p])) {
			 obj1[p] = mergeRecursive(obj1[p], obj2[p]);
		     } else {
			 obj1[p] = obj2[p];
		     }
		 }
		 return obj1;
	     }
	     return mergeRecursive(obj1, obj2);
	 }
	});



//TODO: add walk to lib, or make an underscore_walk lib
_.mixin({
	    /*applies a function over the values of an object*/
	    applyToValues:function(obj,fn,recursive){
		function identity(o){
		    return o;
		};

		//the transformer needs to take in 1 args
		//it needs to return the transformed obj. noop = return first arg;
		//refer to tests
		function walk(o,pretran,posttran){
		    //transforms data in a js object via a walk function
		    o = pretran(o);
		    var ret = o;
		    if(typeof o == 'object'){
			for(var prop in o){
			    if(o.hasOwnProperty(prop)){
				var val = o[prop];
				var transformedVal = posttran(walk(val,pretran,posttran));
				var walked = {};
				walked[prop] = transformedVal;
				_.extend(ret,walked);
			    }
			} 
		    }  
		    return ret;
		};

		var pre_walk = function(o,trans){
		    return walk(o,trans,identity);
		};

		if(recursive){
		    return pre_walk(obj,fn);
		}
		else{
		    return _.map$(obj,function(val,key){return [key,fn(val)];});
		}
	    }});

_.mixin({
	    partition:function(arr,size){
		function partition_helper(arr,size){
		    if(_.size(arr) <= size){return [arr];}
		    return [_.first(arr,size)].concat(partition_helper(_.rest(arr,size),size));
		}
		return partition_helper(arr,size);
	    }});

_.mixin({
	    peek:function(arr,index){
		return arr[index];
	    }});

_.mixin({
	    groupBy_F:function(iterator){
		return function(list){
		    return _.groupBy(list,iterator);
		};
	    }});
_.mixin({
	    //fn({a:1,b:2,c:3},['a','b'],'field') -> {field:{a:1,b:2},c:3}
	    nest:function(obj,selectedKeysList,newFieldName){
		var o = {};
		o[newFieldName] = _.selectKeys(obj,selectedKeysList);
		return _.extend(_.removeKeys(obj,selectedKeysList),o);
	    },
	    nest_F:function(selectedKeysList,newFieldName){
		return function(obj){
		    return _.nest(obj,selectedKeysList,newFieldName);
		};
	    },
	    mapNest:function (list,selectedKeysList,newFieldName){
		return _.map(list,_.nest_F(selectedKeysList,newFieldName));    
	    }
	});

_.mixin({
	    //fn({a:1},{a:1}) -> {a:2}
	    //make recursive
	    //fn({a:{b:1},c:1},{a:{b:1},c:1}) -> {a:{b:2},c:2}
	    addPropertiesTogether:function(addTo,addFrom){
		function addPropertiesTogether_helper(addTo,addFrom){
		    var addToClone = _.clone(addTo);
		    for (var prop in addFrom) {
			if(!_.isUndefined(addToClone[prop])){
			    if(_.isNumber(addFrom[prop])){
				addToClone[prop] += addFrom[prop];
				continue;
			    }
			    else if(_.isObject(addFrom[prop])){
				addToClone[prop] = addPropertiesTogether_helper(addToClone[prop],addFrom[prop]);
				continue;
			    }
			}
			addToClone[prop] = addFrom[prop];
		    }
		    return addToClone;
		}
		return addPropertiesTogether_helper(addTo,addFrom);
	    }});

_.mixin({
	    log:function(logText){
		return function(obj){
		    console.log(logText);
		    console.log(obj);
		    return obj;
		};
	    }
	});

_.mixin({
	    //_.filter$({a:1,b:2},function(val,key){return key == 'a'}) -> {a: 1}
	    //_.filter$([1,2],function(val){return val == 1}) -> [1]
	    filter$:function(obj,iterator){
		if(_.isObject(obj)){
		    function iteratorWrapper(value, index, list){
			//in this case the value would look like ['a',1]
			//index would look like 0
			//we want the value to look like '1' and index to look like 'a'
			return iterator(_.second(value), _.first(value), list);
		    }
		    return _(obj)
			.chain()
			.pairs()
			.filter(iteratorWrapper)
			.toObject()
			.value();
		}
		else if(_.isArray(obj)){
		    return _.filter(obj,iterator);
		}
		else{
		    return obj;
		}
	    }
	});

_.mixin({
	    //_.map$({a:1,b:2},function(val,key){return [key,val] }) -> {a:1,b:2}
	    // _.map$([{a:1},{b:2}],function(val,key){return val }) -> [{a:1},{b:2}]
	    map$:function(obj,iterator){
		if(_.isObject(obj)){
		    return _(_.map(obj,iterator)).toObject();
		}
		else if(_.isArray(obj)){
		    return _.map(obj,iterator);
		}
		else{
		    return obj;
		}
	    }
	});

_.mixin({
	    compress:function(list,filterFn){
		function compressor(compareFn){
		    //this filters sorted lists by comparing the elements that are adjacent to each other
		    return function(list,cur){
			if(_.isEmpty(list)){return [cur];}
			else if(compareFn(cur, _.last(list))){
			    return list;
			}
			else{
			    return list.concat(cur);
			}
		    };
		}
		return _.reduce(list,compressor(filterFn),[]);
	    }
	});
