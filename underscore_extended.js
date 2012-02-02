var _ = require("./underscore");

_.mixin({
	    /* Retrieve the keys and values of an object's properties.
	     {a:'a',b:'b'} -> [[a,'a'],[b,'b']]
	     */
	    isObj:function (obj) {
		return _.isObject(obj) && !_.isArray(obj);
	    }
	});

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
	    selectKeys:function (obj){
		var keys = _.flatten(_.rest(arguments)); //do flatten because of older array notation, in which we can get an array in an array.
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
	    removeKeys:function (obj){
		var keys = _.flatten(_.rest(arguments)); //do flatten because of older array notation, in which we can get an array in an array.
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


_.mixin({renameKeys:function (toEdit){
	     //TODO: extract this function for converting args into object
	     var fieldMap = _.flatten(_.rest(arguments));
	     function transformArrayIntoFieldMap(arr){
		 return _.chain(arr).partition(2).toObject().value();
	     }

	     var mergedFields = _.merge(fieldMap);

	     if(_.isObj(mergedFields)){
		 var fMap = mergedFields;
	     }
	     else if (_.isArray(mergedFields)){
		 var fMap = transformArrayIntoFieldMap(mergedFields);
	     }
	     else{
		 return toEdit;	 
	     }
	     return _.map$(toEdit,
			   function(val,key){
			       if(_.isDefined(fMap[key])){
				   return [fMap[key],val];
			       }
			       else return [key,val];
			   });
	 },
	 mapRenameKeys:function (list){
	     var nameChanges = _.rest(arguments);
	     return _.map(list,
			  function(item){
			      return _.renameKeys.apply(null,[item,nameChanges]);
			  });    
	 }
	});

_.mixin({merge:function (objArray){
	     //merges all of the objects in an array into one object
	     //probably can be done via apply.extend([...])
	     if(_.every(objArray,_.isObj)){
		 return _.reduce(objArray,function(sum,cur){return _.extend(sum,cur);},{});
	     }
	     else{
		 return objArray;
	     }
	 },
	 mapMerge:function(lists){
	     return _.map(lists,_.merge);
	 },
	 zipMerge:function (){
	     return _.map(_.zip.apply(null,arguments),
                          function(zipped){return _.merge(zipped);});
	 }});

//recursive _.extend
//designed to work stand alone in couchdb
_.mixin({
	    extend_r:function(extendTo,extendFrom){
		function isObject(obj) {
		    return obj === Object(obj) && !(obj instanceof Array);
		};
		function mergeRecursive(extendTo, extendFrom) {
		    for (var p in extendFrom) {
			if (isObject(extendFrom[p])) {
			    extendTo[p] = mergeRecursive({}, extendFrom[p]);
			} else {
			    extendTo[p] = extendFrom[p];
			}
		    }
		    return extendTo;
		}
		return mergeRecursive(extendTo, extendFrom);
	    }
	});

//recursive _.defaults
//designed to work stand alone in couchdb
_.mixin({
	    fill:function(fillIn,fillFrom){
		function isObject(obj) {
		    return obj === Object(obj) && !(obj instanceof Array);
		};
		function mergeRecursive(fillIn, fillFrom) {
		    for (var p in fillFrom) {
			if (isObject(fillFrom[p])) {
			    if(fillIn[p] === undefined){
				fillIn[p] = mergeRecursive({}, fillFrom[p]);
			    }
			    else{
				fillIn[p] = mergeRecursive(fillIn[p], fillFrom[p]);
			    }
			} 
			else if(fillIn[p] === undefined){
			    fillIn[p] = fillFrom[p];
			}
		    }
		    return fillIn;
		}
		return mergeRecursive(fillIn, fillFrom);
	    }
	});



//FIXME: remove this (at least the walk part)
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
		if(_.isArray(obj)){
		    return _.filter(obj,iterator);
		}
		else if(_.isObject(obj)){
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
		else{
		    return obj;
		}
	    }
	});

_.mixin({
	    //_.map$({a:1,b:2},function(val,key){return [key,val] }) -> {a:1,b:2}
	    // _.map$([{a:1},{b:2}],function(val,key){return val }) -> [{a:1},{b:2}]
	    map$:function(obj,iterator){
		if(_.isArray(obj)){
		    return _.map(obj,iterator);
		}
		else if(_.isObject(obj)){
		    return _(_.map(obj,iterator)).toObject();
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


_.mixin({
	    join:function(list,listToJoin,field){
		var lists = list.concat(listToJoin);
		var fieldsToJoinOn = _.chain(list).pluck(field).map(function(o){return o.toString();}).value();
		return _.chain(lists)
		    .groupBy(field)
		    .filter(function(val,key){
				return _.contains(fieldsToJoinOn,key);	 
			    })
		    .mapMerge()
		    .flatten()
		    .value();
	    }
	});

//like join, but works on a primative array and an obj array
//not like join in that anything that isn't in both arrays is removed
_.mixin({
	    matchTo:function(primativeList,listToMatchOn,field){
		var matchingFields = _.chain(listToMatchOn).pluck(field).intersection(primativeList).value();
		return _.filter(listToMatchOn,function(item){return _.contains(matchingFields,item[field]);});
	    }
	});


_.mixin({
	    has_F:function(field){
		return function(obj){
		    return _.has(obj,field);
		};
	    },
	    filterHas:function(list,field){
		return _.filter(list,_.has_F(field));
	    }
	});

_.mixin({
	    either:function(){
		return _.chain(arguments).compact().first().value();
	    }
	});

