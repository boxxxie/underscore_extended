var _ = require("./underscore");
require("./underscore_extended");

function _test(fnName){
    return function(){
	var input = arguments;
	return function(output){
	    return function(testText){
		var result = _[fnName].apply(null,input);
		if(_.isEqual(result,output)){
		    console.log("Passed: " + fnName + ": " + testText);
		}
		else{
		    console.log("Failed: " + fnName + ": " + testText);
		    console.log("input");
		    console.log(input);
		    console.log("expected output:");
		    console.log(output);
		    console.log("returned:");
		    console.log(result);
		}
	    };
	};
    };
};

var pairs = _test("pairs"),
toObject = _test("toObject"),
selectKeys = _test("selectKeys"),
selectKeysIf = _test("selectKeysIf"),
removeKeys = _test("removeKeys"),
unEscape = _test("unEscape"),
isNotEmpty = _test("isNotEmpty"),
isLastEmpty = _test("isLastEmpty"),
renameKeys = _test("renameKeys"),
mapRenameKeys = _test("mapRenameKeys"),
merge = _test("merge"),
mapMerge = _test("mapMerge"),
zipMerge = _test("zipMerge"),
partition = _test("partition"),
nest = _test("nest"),
filter$ = _test("filter$"),
map$ = _test("map$"),
compress = _test("compress"),
join = _test("join"),
replace = _test("replace"),
matchTo = _test("matchTo"),
extend_r = _test("extend_r"),
fill = _test("fill");

pairs({a:'a',b:'b'})
([['a','a'],['b','b']])
("test with a simple object");

pairs({a:'a',b:{c:'b'}})
([['a','a'],['b',{c:'b'}]])
("test with a nested object");

pairs({a:'a',b:['c','b']})
([['a','a'],['b',['c','b']]])
("test with a nested object with an array in it");

toObject([['a','a'],['b','b']])
({a:'a',b:'b'})
("with an array rep of a simple object");

toObject([['a','a'],['b',{a:'b'}]])
({a:'a',b:{a:'b'}})
("with an array rep of a complex object");

selectKeys({"a":'a',"b":'b'},['a'])
({a:'a'})
("selected 1 key from a 2 key obj");

selectKeys({"a":'a',"b":'b'},['c'])
({})
("selected from an obj that doesn't have them");

selectKeys({a:'a',b:'b',c:4},['c'])
({c:4})
("selected from an obj that has some of them");

selectKeysIf({"a":1,"b":2},['b'], function(val){return val % 2 == 0;})
({b:2})
("selected key if val is even");

removeKeys({"a":1,"b":2},['b'])
({a:1})
("remove a key from a simple object");

removeKeys({"a":1,"b":2,c:[1,2,3]},['b'])
({a:1,c:[1,2,3]})
("remove a key from a complex object");

removeKeys({"a":1,"b":2,c:[1,2,3]},['c'])
({a:1,b:2})
("remove a key from a complex object");

removeKeys({"a":1,"b":2},['c'])
({a:1,b:2})
("remove a key from a simple object that doesn't have the key");
 //----------- different syntax
removeKeys({"a":1,"b":2},'b')
({a:1})
("remove a key from a simple object");

removeKeys({"a":1,"b":2,c:[1,2,3]},'b')
({a:1,c:[1,2,3]})
("remove a key from a complex object");

removeKeys({"a":1,"b":2,c:[1,2,3]},'c')
({a:1,b:2})
("remove a key from a complex object");

removeKeys({"a":1,"b":2},'c')
({a:1,b:2})
("remove a key from a simple object that doesn't have the key");

removeKeys({"a":1,"b":2},'a','b')
({})
("remove all keys");

var testEscapeStr = "\<>\/&''";
unEscape(_.escape(testEscapeStr))
(testEscapeStr)
("testing all the escape characters");

isNotEmpty([])
(false)
("testing empty array");

isNotEmpty({})
(false)
("testing empty obj");

isNotEmpty([1])
(true)
("testing non-empty array");

isNotEmpty({a:1})
(true)
("testing non-empty obj");

isLastEmpty([1,1,1,[]])
(true)
("with last el being empty array");

isLastEmpty([1,1,1,{}])
(true)
("with last el being empty obj");

isLastEmpty([1,1,1,undefined])
(true)
("with last el being undefined");

renameKeys({a:'b',c:'d'},{a:'ba'})
({ba:'b',c:'d'})
("rename keys in simple obj");

renameKeys({a:'b',c:'d'},[{a:'ba'}])
({ba:'b',c:'d'})
("rename keys in simple obj, different args");

renameKeys({a:'b',c:'d'},[{a:'ba'},{c:'na'}])
({ba:'b',na:'d'})
("rename keys in simple obj, different args");

renameKeys({a:'b',c:'d'},{a:'ba'},{c:'na'})
({ba:'b',na:'d'})
("rename keys in simple obj, different args");

renameKeys({a:'b',c:'d'},{a:'c', c:'a'})
({c:'b',a:'d'})
("swapping key names!");

renameKeys({a:'b',c:'d'},['a','c','c','a'])
({c:'b',a:'d'})
("swapping key names! but with an array as the keymap input");

renameKeys({a:'b',c:'d'},'a','c','c','a')
({c:'b',a:'d'})
("swapping key names! but with an array as the keymap input");

renameKeys({a:'b',c:'d'},[['a','c'],['c','a']])
({c:'b',a:'d'})
("swapping key names! but with a pair array as the keymap input");

//----------------------------------------------map rename

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],{a:'ba'})
([{ba:'b',c:'d'},{ba:'b',c:'d'}])
("rename keys in simple obj");

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],{a:'c', c:'a'})
([{c:'b',a:'d'},{c:'b',a:'d'}])
("swapping key names!");

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],['a','c','c','a'])
([{c:'b',a:'d'},{c:'b',a:'d'}])
("swapping key names! but with an array as the keymap input");

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],'a','c','c','a')
([{c:'b',a:'d'},{c:'b',a:'d'}])
("swapping key names! but with an array as the keymap input");

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],[['a','c'],['c','a']])
([{c:'b',a:'d'},{c:'b',a:'d'}])
("swapping key names! but with a pair array as the keymap input");

mapRenameKeys([{a:'b',c:'d'},{a:'b',c:'d'}],{'a':'c'},{'c':'a'})
([{c:'b',a:'d'},{c:'b',a:'d'}])
("swapping key names! but with a vargs objs as the keymap input");

//--------------------------------------------------

merge([{a:1},{a:2},{a:3}])
({a:3})
("all objs in array have same keys, last val is expected output");

merge([{a:1},{b:2},{c:3}])
({a:1,b:2,c:3})
("all objs in array have have different keys");

merge([1,2,3])
([1,2,3])
("arrays has things that aren't objects");

merge([[1],[2],[3]])
([[1],[2],[3]])
("arrays has things that aren't objects");

mapMerge([[{a:1},{b:2},{c:3}],[{a:1},{a:2},{a:3}]])
([{a:1,b:2,c:3},{a:3}])
("previous merge input and output but in a list together");

zipMerge([{b:2}],[{a:1}])
([{a:1,b:2}])
("2 arrays of objects composed into an array of one object");

zipMerge([{b:2},{c:4}],[{a:1},{f:1}])
([{a:1,b:2},{c:4,f:1}])
("2 arrays of objects composed into an array of objects");

partition([1,1,1,1,1,1,1,1],2)
([[1,1],[1,1],[1,1],[1,1]])
("partition an array of 8 by 2");

partition([1,1,1,1,1,1,1,1,1],2)
([[1,1],[1,1],[1,1],[1,1],[1]])
("partition an array of 9 by 2");

partition([],2)
([[]])
("partition an array of 0  by 2"); // should return an array of an array as to not break functions dealing with partition

nest({a:1,b:2,c:3},['a','b'],'field')
({field:{a:1,b:2},c:3})
("nest 2 keys in a simple object");

nest({a:1,b:2,c:3},['a','b','c'],'field')
({field:{a:1,b:2,c:3}})
("nest all keys in a simple object");

nest({},['a','b','c'],'field')
({field:{}})
("nest keys in an empty object");

nest({d:1,f:2,g:3},['a','b','c'],'field')
({field:{},d:1,f:2,g:3})
("nest keys in an object where none match");

filter$({a:1,b:2,c:3},function(val){return val == 3;})
({c:3})
("simple obj where filter matches 1 val");

filter$({a:1,b:2,c:3},function(val){return val == 4;})
({})
("simple obj where filter matches 0 vals");

filter$({},function(val){return val == 4;})
({})
("empty obj");

map$({a:1,b:2,c:3},function(val,key){return [key,0];})
({a:0,b:0,c:0})
("transforming all the vals of an object");

map$({a:1,b:2,c:3},function(val,key){return [val,val];}) //this really shouldn't be done
({1:1,2:2,3:3})
("transforming all the keys of an object");

map$({},function(val,key){return [val,val];}) //this really shouldn't be done
({})
("empty object");

compress([1,1,1,1,2,2,3,3,4,5],function(o1,o2){return o1==o2;})
([1,2,3,4,5])
("sorted list of integers using equal operator");


join([{id:1,a:1}],[{id:2,a:2}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, no matches");

join([{id:1,a:1}],[{id:1,a:2}],'id')
([{id:1,a:2}])
("joining two lists on 'id' field, match and replace");

join([{id:1,a:2}],[{id:1,a:1}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, match and replace");

join([{id:1,a:2}],[{id:1,a:1},{id:2,a:3}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, match and replace, and miss match");

join([{id:1,a:2},{id:2,a:1}],[{id:1,a:1},{id:2,a:3}],'id')
([{id:1,a:1},{id:2,a:3}])
("joining two lists on 'id' field, 2 match and replace");

matchTo([2],[{id:1,a:2}],'id')
([])
("matching number array to object array [1],[1], no matches");

matchTo([1],[{id:1,a:2}],'id')
([{id:1,a:2}])
("matching number array to object array [1],[2], matches");

matchTo(["1","2"],[{id:"1",a:2}],'id')
([{id:"1",a:2}])
("matching string array with obj array [2][1], matches");

//------------------ extend recursive -------------------

extend_r({},{a:1})
({a:1})
("non-recursive extend onto an empty object");

extend_r({},{a:{b:1}})
({a:{b:1}})
("recursive extend onto an empty objet");

extend_r({a:1},{a:{b:1}})
({a:{b:1}})
("recursive extend onto a non-empty objet");

extend_r({a:{b:0}},{a:{b:1}})
({a:{b:1}})
("recursive extend onto a non-empty objet");

extend_r({a:{b:0},c:0},{a:{b:1}})
({a:{b:1},c:0})
("recursive extend onto a non-empty objet, leaving 1 field unchanged");

extend_r({a:{b:0},c:0},{})
({a:{b:0},c:0})
("recursive extend onto a non-empty objet, with an empty object");

extend_r({c:0},{a:{b:1}})
({a:{b:1},c:0})
("recursive extend onto a non-empty objet, leaving 1 field unchanged and adding a new top-level field");

//-----------------------fill -------------------------------

fill({},{a:1})
({a:1})
("filling in an empty object with a simple object");

fill({a:1},{a:2})
({a:1})
("simple objects that have property already, no fill");

fill({a:1},{a:2,b:2})
({a:1,b:2})
("simple objects that have property already, but missing one. filled");

fill({a:1},{a:2,b:2})
({a:1,b:2})
("simple objects that have property already, but missing one. filled");

fill({a:{b:1}},{a:2,b:2})
({a:{b:1}, b:2})
("complex objects that have property already. no fill");

fill({a:{b:1},b:3},{a:2,b:2})
({a:{b:1}, b:3})
("complex objects that have property already. no fill");

fill({a:{b:1}},{a:{b:2,c:3}})
({a:{b:1,c:3}})
("complex objects that have property already. nested fill");

console.log("tests finished");