"use strict"

var makeTree = require("../rbtree.js")
var tape = require("tape")
var util = require("util")
var iota = require("iota-array")

var COLORS = [ "r", "b", "bb" ]

function printTree(tree) {
  if(!tree) {
    return []
  }
  return [ COLORS[tree._color], tree.key, printTree(tree.left), printTree(tree.right) ]
}

function print(t) {
  console.log(util.inspect(printTree(t.root), {depth:12}))
}

//Ensures the red black axioms are satisfied by tree
function checkTree(tree, t) {
  if(!tree.root) {
    return
  }
  t.equals(tree.root._color, 1, "root is black")
  function checkNode(node) {
    if(!node) {
      return [1, 0]
    }
    if(node._color === 0) {
      t.assert(!node.left || node.left._color === 1, "children of red node must be black")
      t.assert(!node.right || node.right._color === 1, "children of red node must be black")
    } else {
      t.equals(node._color, 1, "node color must be red or black")
    }
    if(node.left) {
      t.assert(tree._compare(node.left.key, node.key) <= 0, "left tree order invariant")
    }
    if(node.right) {
      t.assert(tree._compare(node.right.key, node.key) >= 0, "right tree order invariant")
    }
    var cl = checkNode(node.left)
    var cr = checkNode(node.right)
    t.equals(cl[0], cr[0], "number of black nodes along all paths to root must be constant")
    t.equals(cl[1] + cr[1] + 1, node._count, "item count consistency")
    return [cl[0] + node._color,  cl[1] + cr[1] + 1]
  }
  var r = checkNode(tree.root)
  t.equals(r[1], tree.size, "tree size")
  //console.log(util.inspect(printTree(tree.root), {depth:10}))
}

tape("insert()", function(t) {
  var t1 = makeTree()
  
  var u = t1
  var arr = []
  for(var i=20; i>=0; --i) {
    var x = i
    var next = u.insert(x, true)
    checkTree(u, t)
    checkTree(next, t)
    t.equals(u.size, arr.length)
    arr.push(x)
    u = next
  }
  for(var i=-20; i<0; ++i) {
    var x = i
    var next = u.insert(x, true)
    checkTree(u, t)
    checkTree(next, t)
    arr.sort(function(a,b) { return a-b })
    var ptr = 0
    u.foreach(-Infinity, Infinity, function(k,v) {
      t.equals(k, arr[ptr++])
    })
    t.equals(ptr, arr.length)
    arr.push(x)
    u = next
  }

  var start = u.begin
  for(var i=-20, j=0; j<=40; ++i, ++j) {
    t.equals(u.at(j).key, i, "checking at()")
    t.equals(start.key, i, "checking iter")
    t.equals(start.index, j, "checking index")
    t.assert(start.valid, "checking valid")
    if(j < 40) {
      t.assert(start.hasNext, "hasNext()")
    } else {
      t.assert(!start.hasNext, "eof hasNext()")
    }
    start.next()
  }
  t.assert(!start.valid, "invalid eof iterator")
  t.assert(!start.hasNext, "hasNext() at eof fail")
  t.equals(start.index, 41, "eof index")

  t.end()
})



tape("keys and values", function(t) {

  var original_keys = [ "potato", "sock", "foot", "apple", "newspaper", "gameboy" ]
  var original_values = [ 42, 10, false, "!!!", {}, null ]

  var u = makeTree()
  for(var i=0; i<original_keys.length; ++i) {
    u = u.insert(original_keys[i], original_values[i])
  }

  var zipped = iota(6).map(function(i) {
    return [ original_keys[i], original_values[i] ]
  })

  zipped.sort(function(a,b) {
    if(a[0] < b[0]) { return -1 }
    if(a[0] > b[0]) { return 1 }
    return 0
  })

  var keys = zipped.map(function(v) { return v[0] })
  var values = zipped.map(function(v) { return v[1] })

  t.same(u.keys, keys)
  t.same(u.values, values)

  t.end()
})

tape("bounds searching", function(t) {

  var arr = [0, 1, 1, 1, 1, 2, 3, 4, 5, 6, 6 ]

  var u = arr.reduce(function(u, k, v) {
    return u.insert(k, v)
  }, makeTree())

  t.equals(u.ge(3).index, 6, "ge simple")
  t.equals(u.ge(0.9).index, 1, "ge run start")
  t.equals(u.ge(1).index, 1, "ge run mid")
  t.equals(u.ge(1.1).index, 5, "ge run end")
  t.equals(u.ge(0).index, 0, "ge first")
  t.equals(u.ge(6).index, 9, "ge last")
  t.equals(u.ge(100).valid, false, "ge big")
  t.equals(u.ge(-1).index, 0, "ge small")

  t.equals(u.gt(3).index, 7, "gt simple")
  t.equals(u.gt(0.9).index, 1, "gt run start")
  t.equals(u.gt(1).index, 5, "gt run mid")
  t.equals(u.gt(1.1).index, 5, "gt run end")
  t.equals(u.gt(0).index, 1, "gt first")
  t.equals(u.gt(6).valid, false, "gt last")
  t.equals(u.gt(100).valid, false, "gt big")
  t.equals(u.gt(-1).index, 0, "ge small")

  t.equals(u.le(3).index, 6, "le simple")
  t.equals(u.le(0.9).index, 0, "le run start")
  t.equals(u.le(1).index, 4, "le run mid")
  t.equals(u.le(1.1).index, 4, "le run end")
  t.equals(u.le(0).index, 0, "le first")
  t.equals(u.le(6).index, 10, "le last")
  t.equals(u.le(100).index, 10, "le big")
  t.equals(u.le(-1).valid, false, "le small")
  
  t.equals(u.lt(3).index, 5, "lt simple")
  t.equals(u.lt(0.9).index, 0, "lt run start")
  t.equals(u.lt(1).index, 0, "lt run mid")
  t.equals(u.lt(1.1).index, 4, "lt run end")
  t.equals(u.lt(0).valid, false, "lt first")
  t.equals(u.lt(6).index, 8, "lt last")
  t.equals(u.lt(100).index, 10, "lt big")
  t.equals(u.lt(-1).valid, false, "lt small")
  
  t.end()
})

tape("remove()", function(t) {

  var sz = [1, 2,  10, 20, 23, 31, 32, 33]
  for(var n=0; n<sz.length; ++n) {
    var c = sz[n]
    var u = iota(c).reduce(function(u, k, v) {
      return u.insert(k, v)
    }, makeTree())
    for(var i=0; i<c; ++i) {
      checkTree(u.remove(i), t)
    }
  }

  t.end()
})

tape("update()", function(t) {


  t.end()
})

