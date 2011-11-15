_.mixin({
	    //Retrieve the keys and values of an object's properties.
	    //{key: val, key1: val1...} -> [[key,val],[key1,val1]...]
	    kv:function (obj) {
		if(typeof obj !== 'object'){return null;}
		return _.zip(_.keys(obj),_.values(obj));}});

_.mixin({
	    //converts an array of pairs into an objcet
	    //[[key,val],[key1,val1]...] -> {key: val, key1: val1...}
	    toObject:function(pairs){
		return pairs.reduce(function(total,cur){
					var key = _.first(cur),
					val = _.last(cur);
					total[key] = val;
					return total;
				    },{});}});

_.mixin({
	    //create an object with only the keys in the selected keys array arg
	    selectKeys:function (obj,keys){
		return _.toObject(_.kv(obj)
		    .filter(function(kv){return _.contains(keys,_.first(kv));}));
	    }});