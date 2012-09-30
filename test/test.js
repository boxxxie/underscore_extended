var _ = require("underscore");
require("../underscore_extended");
//var mocha = require('mocha')();
//var should = require('should');
var prettyjson = require('prettyjson');
var assert = require('assert');
var chai = require('chai');

var expect = chai.expect;

//var describe = mocha.Suite;
//var it = mocha.Test;

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


/**
 * A better way to compare two objects in Javascript
 **/
function getKeys(obj) {
  var keys;
  if(obj.keys) {
    keys = obj.keys();
  } else {
    keys = [];

    for(var k in obj) {
      if(Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
  }

  return keys;
}

/**
 * Create a new object so the keys appear in the provided order.
 * @param {Object} obj The object to be the base for the new object
 * @param {Array} keys The order in which properties of the new object should appear
 **/
function reconstructObject(obj, keys) {
  var result = {};
  for (var i = 0, l = keys.length; i < l; i++) {
    if (Object.prototype.hasOwnProperty.call(obj, keys[i])) {
      result[keys[i]] = obj[keys[i]];
    }
  }

  return result;
}

function assertEquals(obj1,obj2,msg){
  assert.equal(
    prettyjson.render(obj1), 
    prettyjson.render(obj2),
    msg);
}

function assertObjectEqual(a, b, msg) {
  msg = msg || '';
  if( Object.prototype.toString.call( a ) === '[object Array]' && Object.prototype.toString.call( b ) === '[object Array]') {
    // special case: array of objects
    if (a.filter(function(e) { return Object.prototype.toString.call( e ) === '[object Object]' }).length > 0 ||
        b.filter(function(e) { return Object.prototype.toString.call( e ) === '[object Object]' }).length > 0 ){

      if (a.length !== b.length) {
        assertEquals(a,b,msg);
      } else {
        for(var i = 0, l = a.length; i < l; i++) {
          assertObjectEqual(a[i], b[i], msg + '[elements at index ' + i + ' should be equal]');
        }
      }
      // simple array of primitives
    } else {
      assertEquals(a,b,msg);
    }
  } else {
    var orderedA = reconstructObject(a, getKeys(a).sort()),
    orderedB = reconstructObject(b, getKeys(b).sort());
    // compare as strings for diff tolls to show us the difference
    assertEquals(orderedA,orderedB,msg);
  }
}

var //pairs = _test("pairs"),
toObject = _test("toObject"),
selectKeys = _test("selectKeys"),
removeKeys = _test("removeKeys"),
unEscape = _test("unEscape"),
isNotEmpty = _test("isNotEmpty"),
isLastEmpty = _test("isLastEmpty"),
//renameKeys = _test("renameKeys"),
mapRenameKeys = _test("mapRenameKeys"),
merge = _test("merge"),
mapMerge = _test("mapMerge"),
zipMerge = _test("zipMerge"),
partition = _test("partition"),
nest = _test("nest"),
mapNest = _test("mapNest"),
filter$ = _test("filter$"),
map$ = _test("map$"),
compress = _test("compress"),
joinOn = _test("joinOn"),
matchTo = _test("matchTo"),
//extend_r = _test("extend_r"),
fill = _test("fill"),
either = _test("either"),
combine = _test("combine"),
mapCombine = _test("mapCombine"),
splitKeys = _test("splitKeys"),
addPropertiesTogether = _test("addPropertiesTogether"),
add = _test("add"),
subtract = _test("subtract"),
multiply = _test("multiply"),
divide = _test("divide");

describe('_.pairs()', function(){
  it("should convert {a:'a',b:'b'} into [['a','a'],['b','b']]",function(){
    expect(
      _.pairs({a:'a',b:'b'}))
      .eql([['a','a'],['b','b']]);
  })
  it("should convert {a:'a',b:{c:'b'}} into [['a','a'],['b',{c:'b'}]]",function(){
    expect(
      _.pairs({a:'a',b:{c:'b'}}))
      .eql([['a','a'],['b',{c:'b'}]])
  })
  it("should convert {a:'a',b:['c','b']} into [['a','a'],['b',['c','b']]]",function(){
    expect(
      _.pairs({a:'a',b:['c','b']}))
      .eql([['a','a'],['b',['c','b']]])
  })
})

describe("_.toObject()",function(){
  it("should convert ([['a','a'],['b','b']]) into {a:'a',b:'b'}",function(){
    expect(_.toObject([['a','a'],['b','b']]))
      .eql({a:'a',b:'b'})
  });
  it("should convert   ([['a','a'],['b',{a:'b'}]]) into {a:'a',b:{a:'b'}}",function(){
    expect(_.toObject([['a','a'],['b',{a:'b'}]]))
      .eql({a:'a',b:{a:'b'}});
  });
});

describe("_.selectKeys()",function(){
  it("should convert ({'a':'a','b':'b'},['a']) into {a:'a'}",function(){
    expect(_.selectKeys({"a":'a',"b":'b'},['a']))
      .eql({a:'a'});
  });
  it("should convert selectKeys({'a':'a','b':'b'},['c']) into {}",function(){
    expect(_.selectKeys({"a":'a',"b":'b'},['c']))
      .eql({})
  });
});

selectKeys({a:'a',b:'b',c:4},['c'])
({c:4})
("selected from an obj that has some of them");

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

describe("_.renameKeys()",function(){
  it("should convert ({a:'b',c:'d'},{a:'ba'}) into {ba:'b',c:'d'}", function(){
    expect(_.renameKeys({a:'b',c:'d'},{a:'ba'}))
      .eql({ba:'b',c:'d'})
  });
  
  it("should convert ({a:'b',c:'d'},{a:'c', c:'a'}) into {c:'b',a:'d'}",function(){
    expect(_.renameKeys({a:'b',c:'d'},{a:'c', c:'a'}))
      .eql({c:'b',a:'d'})
  });


  it("should convert  ({a:'b',c:'d'},['a','c','c','a']) into  {c:'b',a:'d'}",function(){
    expect(_.renameKeys({a:'b',c:'d'},['a','c','c','a']))
      .eql({c:'b',a:'d'})
  })
  
  it("should convert ({a:'b',c:'d'},'a','c','c','a') into {c:'b',a:'d'}", function(){
    expect(_.renameKeys({a:'b',c:'d'},'a','c','c','a'))
      .eql({c:'b',a:'d'})
  });

  it("should convert ({a:'b',c:'d'},[['a','c'],['c','a']]) into {c:'b',a:'d'}",function(){
    expect(_.renameKeys({a:'b',c:'d'},[['a','c'],['c','a']]))
      .eql({c:'b',a:'d'})
  });
});


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

//--------------------------------------------------

merge([{a:1},{a:2},{a:3}])
({a:3})
("all objs in array have same keys, last val is expected output");

merge([{a:1},{b:2},{c:3}])
({a:1,b:2,c:3})
("all objs in array have have different keys");

mapMerge([
  [{a:1},{b:2},{c:3}],
  [{a:1},{a:2},{a:3}]
])
([
  {a:1,b:2,c:3},
  {a:3}
])
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

//not sure if this should be what happens...
nest({c:1},['a','b'],'field')
({c:1,field:{}})
("nest keys in an empty object, no matches by new field made");

nest({d:1,f:2,g:3},['a','b','c'],'field')
({field:{},d:1,f:2,g:3})
("nest keys in an object where none match");

mapNest([{a:1},{b:1},{c:1}],['a','b'],'field')
([{field:{a:1}},{field:{b:1}},{c:1,field:{}}])
('testing on array of simple objects, last case doesnt nest');

filter$({a:1,b:2,c:3},function(val){return val == 3;})
({c:3})
("simple obj where filter matches 1 val");

filter$({a:1,b:2,c:3},function(val){return val == 4;})
({})
("simple obj where filter matches 0 vals");

filter$({},function(val){return val == 4;})
({})
("empty obj");

map$({a:1,b:2,c:3},function(pair){var key = _.first(pair); var val = _.second(pair);return [key,0];})
({a:0,b:0,c:0})
("transforming all the vals of an object");

map$({a:1,b:2,c:3},function(pair){var key = _.first(pair); var val = _.second(pair);return [val,val];}) //this really shouldn't be done
({1:1,2:2,3:3})
("transforming all the keys of an object");

map$({},function(pair){var key = _.first(pair); var val = _.second(pair);return [val,val];}) //this really shouldn't be done
({})
("empty object");

compress([1,1,1,1,2,2,3,3,4,5],function(o1,o2){return o1==o2;})
([1,2,3,4,5])
("sorted list of integers using equal operator");


joinOn([{id:1,a:1}],[{id:2,a:2}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, no matches");

joinOn([{id:1,a:1}],[{id:1,a:2}],'id')
([{id:1,a:2}])
("joining two lists on 'id' field, match and replace");

joinOn([{id:1,a:2}],[{id:1,a:1}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, match and replace");

joinOn([{id:1,a:2}],[{id:1,a:1},{id:2,a:3}],'id')
([{id:1,a:1}])
("joining two lists on 'id' field, match and replace, and miss match");

joinOn([{id:1,a:2},{id:2,a:1}],[{id:1,a:1},{id:2,a:3}],'id')
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
/*
extend_r({},1)
(1)
("primative to object overwrite");

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

extend_r(
  {_id: "02bb06f0fed1596decf2024a4c025997",
   _rev: "2-27c295b83271e6dcc2dc43df18444177",
   date: "Wed Jan 25 2012 22:24:01 GMT-0500 (EST)",
   price: {selling_price: 2},
   arrayTest:[1],
   description: "invNeww",
   upccode: "01123456"},
  {_id: "02bb06f0fed1596decf2024a4c029a59",
   _rev: "5-484927d67a1be1454431b4143059c87c",
   arrayTest:[2,3],
   date: "Wed Jan 25 2012 22:25:09 GMT-0500 (EST)",
   description: "invNeww",
   apply_taxes: {exemption: false, tax1: true, tax2: true, tax3: true},
   upccode: "01123456"})
({_id: "02bb06f0fed1596decf2024a4c029a59",
  _rev: "5-484927d67a1be1454431b4143059c87c",
  date: "Wed Jan 25 2012 22:25:09 GMT-0500 (EST)",
  arrayTest:[2,3],
  description: "invNeww",
  price: {selling_price: 2},
  apply_taxes: {exemption: false, tax1: true, tax2: true, tax3: true},
  upccode: "01123456"})
("complex real world object filling in a missing field");

extend_r([1,2,3],[4,5,6])
([4,5,6])
('extending onto arrays')

extend_r([1,2,3],[4,5,6,7])
([4,5,6,7])
('extending onto arrays of different sizes')

extend_r([1,2,3,4],[5,6,7])
([5,6,7,4])
('extending onto arrays of different sizes')

extend_r([[1],[2]],[[4],[5]])
([[4],[5]])
('extending onto nested arrays')

extend_r([[1],[2]],[[4],[5],[6]])
([[4],[5],[6]])
('extending onto nested arrays of different sizes')

extend_r([[1],[2,3]],[[4],[5]])
([[4],[5,3]])
('extending onto nested arrays of different sizes')

extend_r(
  {"display":
   {"description":["","",""],
    "color":"255,255,25",
    "is_enabled":false,
    "screen":0,
    "position":0
   },
   "foodItem":{"price":3.49,
	       "has_modifier":true,
	       "apply_taxes":{"exemption":true,
			      "tax1":true,
			      "tax2":true,
			      "tax3":false
			     },
	       "use_scale":false,
	       "print_to_kitchen":true,
	       "duplicate":false
	      }
  },

  {display:{color:"#fffff"}}
)
(
  {"display":
   {"description":["","",""],
    "color":"#fffff",
    "is_enabled":false,
    "screen":0,
    "position":0},
   "foodItem":{"price":3.49,
	       "has_modifier":true,
	       "apply_taxes":{"exemption":true,
			      "tax1":true,
			      "tax2":true,
			      "tax3":false},
	       "use_scale":false,
	       "print_to_kitchen":true,
	       "duplicate":false
              }
  })
("real data merging complicated objects with arrays and uneven nested properties")

*/
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


fill(
  {_id: "02bb06f0fed1596decf2024a4c029a59",
   _rev: "5-484927d67a1be1454431b4143059c87c",
   date: "Wed Jan 25 2012 22:25:09 GMT-0500 (EST)",
   description: "invNeww",
   apply_taxes: {exemption: false, tax1: true, tax2: true, tax3: true},
   upccode: "01123456"},
  {_id: "02bb06f0fed1596decf2024a4c025997",
   _rev: "2-27c295b83271e6dcc2dc43df18444177",
   date: "Wed Jan 25 2012 22:24:01 GMT-0500 (EST)",
   price: {selling_price: 2},
   description: "invNeww",
   upccode: "01123456"})
({_id: "02bb06f0fed1596decf2024a4c029a59",
  _rev: "5-484927d67a1be1454431b4143059c87c",
  date: "Wed Jan 25 2012 22:25:09 GMT-0500 (EST)",
  description: "invNeww",
  price: {selling_price: 2},
  apply_taxes: {exemption: false, tax1: true, tax2: true, tax3: true},
  upccode: "01123456"})
("complex real world object filling in a missing field");

//--------------------------- either -------------------------

either(undefined,undefined,null,0,1)
(1)
("simple list of false vals with the last one being the one returend");

either()
(undefined)
("no args passed in");

either(undefined, undefined)
(undefined)
("null args passed in");

either(3, 1)
(3)
("non-false args passed in, return first");

//------------------- expand ---------------------------

/*
  expand({},'abc')
  ({})
  ("expanding on an empty obj results in an empty list");

  expand({a:1},'a')
  ({a:1})
  ("expanding on a simple obj results in the same object");

  expand({a:{b:1}},'a')
  ({b:1})
  ("expanding on a nested obj results in the field being replaced");

  expand({a:{b:1},c:{e:2}},'a','c')
  ({b:1,e:2})
  ("expanding on a complex obj results in the selected fields being replaced");

  expand({a:{b:1},c:{b:2}},'a','c')
  ({b:2})
  ("conflict keys results in the last values overwritting the first");
*/


//---------------------------------- combine
//---------------------------------- ------------------------------------

describe("_.combine()",function(){
  it("should merge two empty objects into an empty object",function(){
    expect(_.combine({},{}))
      .eql({});         
  }); 
  it("should merge 2 simple objects (with no conflicting keys) into an object with both keys and values preserved",function(){
    expect(_.combine({a:1},{b:2}))
      .eql({a:1,b:2});
  });
  it("should merge n objects (with conflicting keys) into an object with the last key value given preserved",function(){
    expect(_.combine({a:1},{a:3},{a:2}))
      .eql({a:2})
  });
  it("should merge n objects (with conflicting keys) into an object with the last key value given preserved, as well as non-conflicting keys preserved",function(){
    expect(_.combine({a:1},{a:2},{a:3,b:3}))
      .eql({a:3,b:3})
  });
  it("should recursively merge keys/values of the objects given",function(){
    expect(_.combine({a:{b:1}},{a:{b:2}},{a:{b:3},b:3}))
      .eql({a:{b:3},b:3});
  });
  it("should handle very complicated objects", function(){
    var base_obj = {"display":
                {"description":["","",""],
                 "is_enabled":false,
                 "screen":0,
                 "position":0
                },
                "foodItem":{"price":3.49,
		            "has_modifier":true,
		            "apply_taxes":{"exemption":true,
				           "tax1":true,
				           "tax2":true,
				           "tax3":false
			                  },
		            "use_scale":false,
		            "print_to_kitchen":true,
		            "duplicate":false
		           }
               };
    var obj1 = _.clone(base_obj); obj1.display.color ="255,255,25";
    var obj2 = _.clone(base_obj); obj2.display.color = "#fffff";
    var expected_merge = _.clone(base_obj); expected_merge.display.color = "#fffff";
    
    expect(_.combine(obj1,obj2)).eql(expected_merge);
  });
});




mapCombine([{a:1},{a:1}],{a:1})
([{a:1},{a:1}])
("conflict keys overwrite with the last, testing with 1 arg");

mapCombine([{a:1},{a:1}],{a:1},{a:2})
([{a:2},{a:2}])
("conflict keys overwrite with the last, testing with 2 args");

mapCombine([{a:1},{a:1}],{b:1})
([{a:1,b:1},{a:1,b:1}])
("extending an object to other obejects in the array");

mapCombine([{a:1},{a:1}],{b:1,a:2})
([{a:2,b:1},{a:2,b:1}])
("conflict/extending an object to other obejects in the array");

splitKeys({a:1,b:1,c:1},'a')
([{a:1},{b:1,c:1}])
("spliting an object into two");

addPropertiesTogether({a:1},{a:1})
({a:2})
("adding simple 1 element objects together");

add({a:1},{a:1})
({a:2})
("adding simple 1 element objects together");

subtract({a:1,b:{b:2}},{b:{b:1}})
({a:1,b:{b:1}})
("subtracting a nested object");

