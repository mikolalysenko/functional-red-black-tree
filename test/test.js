"use strict"

var makeTree = require("../rbtree.js")
var tape = require("tape")
var util = require("util")

function printTree(tree) {
  if(!tree) {
    return []
  }
  return [ tree._color ? "b":"r", tree.key, printTree(tree.left), printTree(tree.right) ]
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

tape(function(t) {
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
    u = next
    arr.push(x)
  }


  t.end()
})
