var _ = require("./underscore")


_.mixin({
	    //watch out when using these functions in map/filter/reduce
	    partial:function(fn){
		var partialArgs = _.rest(arguments)
		return function(){
		    var completedArgs = _.toArray(arguments)
		    fn.apply(null,[].concat(partialArgs,completedArgs))
		}
	    },
	    //i'm not sure if this is ok, or if it is going to promote bad design
	    //todo: had some problems with mapMerge. do some testing on the below fn
	    reverse_partial:function(fn){
		var partialArgs = _.rest(arguments)
		return function(){
		    var completedArgs = _.toArray(arguments)
		   // console.log("reverse partial args")
		   // console.log(completedArgs)
		  //  console.log([].concat(completedArgs,partialArgs))
		    fn.apply(null,[].concat(completedArgs,partialArgs))
		}
	    }
	})

_.mixin({
	    /*
	     * this is a generic helper function that will allow you to take any function that is applied to
	     * an object, or an array of objects, and make a map out of it
	     * examples below include mapCombine
	     * examples of the uses of the map functions can be seen in the test.js file
	     */
	    mapVargFn:function(transformation){
		return function(list){
		    var user_arguments = _.rest(arguments);
		   // console.log('arguments');
		   // console.log(arguments);
		   // console.log('user_arguments');
		   // console.log(user_arguments);
		    return _.map(list, function(item){
			//	console.log(_([item]).concat(user_arguments))
				return transformation.apply(null,_([item]).concat(user_arguments));
			    });
		};
	    }
	});

_.mixin({
	    //isObject will mix up objects and arrays, this will not.
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
		//do flatten because of older array notation, in which we can get an array in an array.
		var keys = _.flatten(_.rest(arguments));
		return  _.filter$(obj,function(val,key){return _.contains(keys,key);});
	    },

	    /*create an object without the keys in the selected keys array arg
	     * ({a:'a',b:'b'},['a']) -> {b:'b'}
	     */
	    removeKeys:function (obj){
		//do flatten because of older array notation, in which we can get an array in an array.
		var keys = _.flatten(_.rest(arguments));
		return _.filter$(obj,function(val,key){return !_.contains(keys,key);});
	    }
	});

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


_.mixin({renameKeys:function (obj_for_key_renaming){
	     var args = _.rest(arguments);
	     var fieldMap = _.first(args);

	     function transformArrayIntoFieldMap(arr){
		 return _.chain(arr).flatten().partition(2).toObject().value();
	     }

	     if(_.isObj(fieldMap)){
		 var fMap = fieldMap;
	     }
	     else if (_.isArray(args)){
		 var fMap = transformArrayIntoFieldMap(args);
	     }
	     else{
		 return obj_for_key_renaming;
	     }
	     //map$ preserves the object
	     return _.map$(obj_for_key_renaming,
		      function(val,key){
			  var renamed_key = fMap[key];
			  if(_.isDefined(renamed_key)){
			      return [renamed_key,val];
			  }
			  else return [key,val];
		      });
	 }
	});






//FIXME: remove this (at least the walk part)
//_.walk has it's own library, remove this soon
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
	    }
	});

//Generic operators over objects
_.mixin({
	    //fn({a:1},{a:1}) -> {a:2}
	    //make recursive
	    //fn({a:{b:1},c:1},{a:{b:1},c:1}) -> {a:{b:2},c:2}
	    combinePropertiesTogether:function(transformation){
		return function(addTo,addFrom){
		    function addPropertiesTogether_helper(addTo,addFrom){
		//	var addToClone = _.clone(addTo);   //probably do not need to clone here. if so, then dependance on underscore is removed
			var addToClone = addTo;
			for (var prop in addFrom) {
			    if(addToClone[prop] === undefined){
				addToClone[prop] = addFrom[prop];
			    }
			    else if(_.isObj(addFrom[prop])){
				addToClone[prop] = addPropertiesTogether_helper(addToClone[prop],addFrom[prop]);
			    }
			    else{
				addToClone[prop] = transformation(addToClone[prop],addFrom[prop]);
			    }
			}
			return addToClone;
		    }
		    return addPropertiesTogether_helper(addTo,addFrom);
		};
	    }

	});

function numericOperator(op){
    return function (a,b){
	if(_.isNumber(a) || _.isNumber(b)){
	    return op(a,b);
	}
	return b;
    };
}

function add(a,b){ return a + b;}
function subtract(a,b){ return a - b;}
function multiply(a,b){ return a * b;}
function divide(a,b){ return a / b;}

_.mixin({
	    addPropertiesTogether : _.combinePropertiesTogether(numericOperator(add)),
	    add : _.combinePropertiesTogether(numericOperator(add)),
	    subtract : _.combinePropertiesTogether(numericOperator(subtract)),
	    multiply : _.combinePropertiesTogether(numericOperator(multiply)),
	    divide : _.combinePropertiesTogether(numericOperator(divide))
	});

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
	    },
	    removeEmptyKeys : function(obj){
		return filter$(obj,_.isNotEmpty);
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
	    //todo rename to something better
	    //supposed to be like a logical join
	    joinOn:function(list,listToJoin,field){
		var lists = list.concat(listToJoin);
		var fieldsToJoinOn = _.chain(list)
		    .pluck(field)
		    .map(function(o){
			     return o.toString();
			 })
		    .value();
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

//like joinOn, but works on a primative array and an obj array
//not like joinOn in that anything that isn't in both arrays is removed
_.mixin({
	    matchTo:function(primativeList,listToMatchOn,field){
		var matchingFields = _.chain(listToMatchOn)
		    .pluck(field)
		    .intersection(primativeList)
		    .value();
		return _.filter(listToMatchOn,
				function(item){
				    return _.contains(matchingFields,item[field]);});
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
		return _.chain(arguments)
		    .toArray()
		    .compact()
		    .first()
		    .value();
	    }
	});

_.mixin({
	    //depricated, use combine
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
	    },
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

_.mixin({
	    //supposed to be a safe _.extend that is recursive and takes in v-args
	    //use inplace of extend_r
	    combine:function(){
		return _.reduce(_(arguments).toArray(),
				function(returnItem,curItem){
				    return _.extend_r(returnItem,curItem);
				},{});
	    }
	});

_.mixin({merge:function (objArray){
	     return _.combine.apply(null,objArray);
	 },
	 zipMerge:function (){
	     var zippedArgs = _.zip.apply(null,_(arguments).toArray());
	     return _.mapMerge(zippedArgs);
	 }});

_.mixin({
	    mapCombine:_.mapVargFn(_.combine),
	    mapSelectKeys:_.mapVargFn(_.selectKeys),
	    mapRemoveKeys:_.mapVargFn(_.removeKeys),
	    mapRenameKeys:_.mapVargFn(_.renameKeys),
	    mapNest:_.mapVargFn(_.nest),
	    mapMerge:_.mapVargFn(_.merge)
	   // mapMerge:_.reverse_partial(_.map,_.merge)
	});

_.mixin({
	    //applies a list of functions to a set of arguments and outputs all of the results in an array
	    juxtapose:function(){
		var functions = arguments;
		return function(){
		    var args = _.toArray(arguments);
		    return _.map(functions,function(fn){
				     return fn.apply(null,args);
				 });
		};
	    }
	});

_.mixin({
	    splitKeys:_.juxtapose(_.selectKeys,_.removeKeys)
	});

_.mixin({
	    //returns a frequencies object based on the list/iterator
	    frequencies:function(list,iterator){
		return _.chain(list)
		    .groupBy(iterator)
		    .map$(function(val,key){
			      return [key,_.size(val)];
			  })
		    .value();
	    }
	});