_.mixin({
	    // Retrieve the keys and values of an object's properties.
	    kv:function (obj) {
		return _.zip(_.keys(obj),_.values(obj));}});

_.mixin({
	    //converts an array of pairs into an objcet
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
		return  _(obj).chain()
		    .kv()
		    .filter(function(kv){return _.contains(keys,_.first(kv));})
		    .toObject()
		    .value();
	    }});

_.mixin({
	    //create an object without the keys in the selected keys array arg
	    removeKeys:function (obj,keys){
		return _(obj).chain()
		    .kv()
		    .reject(function(kv){return _.contains(keys,_.first(kv));})
		    .toObject()
		    .value();
	    }});


// unEscape a string for HTML interpolation.
/*
 *   _.escape = function(string) {
 return (''+string)
 .replace(/&(?!\w+;|#\d+;|#x[\da-f]+;)/gi, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#x27;')
 .replace(/\//g,'&#x2F;');
 };
 * */
_.mixin({
	    unEscape : function(string) {
		return (''+string)
		    .replace(/&lt;/g,    '<')
		    .replace(/&gt;/g,    '>')
		    .replace(/&quot;/g,  '"')
		    .replace(/&#x27;/g,  "'")
		    .replace(/&#x2F;/g,  '\/')
		    .replace(/&amp;/g,   '&');
	    }});
