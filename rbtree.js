"use strict"

module.exports = createRBTree

var RED   = 0
var BLACK = 1

function RBNode(color, key, value, left, right, count) {
  this._color = color
  this._key = key
  this._value = value
  this._left = left
  this._right = right
  this._count = count
}

function repaint(color, node) {
  return new RBNode(color, node._key, node._value, node._left, node._right, node._count)
}

function recount(node) {
  node._count = 1 + (node._left ? node._left._count : 0) + (node._right ? node._right._count : 0)
}

function RedBlackTree(compare, root) {
  this._compare = compare
  this._root = root
}

var proto = RedBlackTree.prototype

Object.defineProperty(proto, "size", {
  get: function() {
    if(this._root) {
      return this._root._count
    }
    return 0
  }
})

//Insert a new item into the tree
proto.insert = function(key, value) {
  var cmp = this._compare
  //Find point to insert new node at
  var n = this._root
  var n_stack = []
  var d_stack = []
  while(n) {
    var d = cmp(key, n)
    n_stack.push(n)
    d_stack.push(d)
    if(d <= 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  //Rebuild path to leaf node
  n_stack.push(new RBNode(RED, key, value, null, null, 1))
  for(var s=n_stack.length-2; s>=0; --s) {
    var n = n_stack[s]
    if(d_stack[s] <= 0) {
      n_stack[s] = new RBNode(n._color, n._key, n._value, n_stack[s+1], n._right, n._count+1)
    } else {
      n_stack[s] = new RBNode(n._color, n._key, n._value, n._left, n_stack[s+1], n._count+1)
    }
  }
  //Rebalance tree using rotations
  for(var s=n_stack.length-1; s>0; --s) {
    var p = n_stack[s-1]
    if(p._color !== RED) {
      break
    }
    var n = n_stack[s]
    var pp = n_stack[s-2]
    if(pp._left === p) {
      if(p._left === n) {
        var y = pp._right
        if(y && y._color === RED) {
          p._color = BLACK
          pp._right = repaint(BLACK, y)
          pp._color = RED
        } else {
          pp._color = RED
          pp._left = p._right
          p._color = BLACK
          p._right = pp
          n_stack[s-2] = p
          n_stack[s-1] = n
          recount(pp)
          recount(n)
          recount(p)
          break
        }
      } else {
        var y = pp._left
        if(y && y._color === RED) {
          p._color = BLACK
          pp._left = repaint(BLACK, y)
          pp._color = RED
        } else {
          p._right = n._left
          pp._color = RED
          pp._left = n._right
          n._color = BLACK
          n._left = p
          n._right = pp
          n_stack[s-2] = n
          n_stack[s-1] = p
          recount(pp)
          recount(p)
          recount(n)
          break
        }
      }
    } else {
     if(p._right === n) {
        var y = pp._left
        if(y && y._color === RED) {
          p._color = BLACK
          pp._left = repaint(BLACK, y)
          pp._color = RED
        } else {
          pp._color = RED
          pp._right = p._left
          p._color = BLACK
          p._left = pp
          n_stack[s-2] = p
          n_stack[s-1] = n
          recount(pp)
          recount(n)
          recount(p)
          break
        }
      } else {
        var y = pp._right
        if(y && y._color === RED) {
          p._color = BLACK
          pp._right = repaint(BLACK, y)
          pp._color = RED
        } else {
          p._left = n._right
          pp._color = RED
          pp._right = n._left
          n._color = BLACK
          n._right = p
          n._left = pp
          n_stack[s-2] = n
          n_stack[s-1] = p
          recount(pp)
          recount(p)
          recount(n)
          break
        }
      }
    }
  }
  //Return new tree
  n_stack[0]._color = BLACK
  return new RedBlackTree(cmp, n_stack[0])
}

//Visit all nodes within a range
function doVisit(lo, hi, compare, visit, node) {
  if(!node) {
    return
  }
  var l = compare(lo, node._key)
  var h = compare(hi, node._key)
  if(l <= 0) {
    var v = doVisit(lo, hi, compare, visit, node._left)
    if(v) {
      return v
    }
    if(h > 0) {
      v = visit(node._key, node._value)
      if(v) {
        return v
      }
    }
  }
  if(h > 0) {
    var v = doVisit(lo, hi, compare, visit, node._right)
    if(v) {
      return v
    }
  }
  return
}

proto.foreach = function(lo, hi, visit) {
  return doVisit(lo, hi, this._compare, visit, this._root)
}

//First item in list
Object.defineProperty(proto, "begin", {
  get: function() {
    var stack = []
    var n = this._root
    while(n) {
      stack.push(n)
      n = n._left
    }
    return new RedBlackTreeIterator(this, stack)
  }
})

//Last item in list
Object.defineProperty(proto, "end", {
  get: function() {
    var stack = []
    var n = this._root
    while(n) {
      stack.push(n)
      n = n._right
    }
    return new RedBlackTreeIterator(this, stack)
  }
})

//Find the ith item in the tree
proto.at = function(idx) {
  var n = this._root
  var stack = []
  while(n) {
    stack.push(n)
    if(n._left) {
      if(idx < n._left._count) {
        n = n._left
        continue
      }
      idx -= n._left._count
    }
    if(!idx) {
      return new RedBlackTreeIterator(this, stack)
    }
    if(n._right) {
      idx -= 1
      if(idx >= n._right._count) {
        break
      }
      n = n._right
    }
  }
  return new RedBlackTreeIterator(this, [])
}

//Least-lower-bound
proto.leastLower = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  var last_ptr = 0
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d <= 0) {
      last_ptr = stack.length
    }
    if(d <= 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  stack.length = last_ptr
  return new RedBlackTreeIterator(this, stack)
}


//Greatest-lower-bound
proto.greatestLower = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  var last_ptr = 0
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d < 0) {
      last_ptr = stack.length
    }
    if(d < 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  stack.length = last_ptr
  return new RedBlackTreeIterator(this, stack)
}


//Least-upper-bound
proto.leastUpper = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  var last_ptr = 0
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d > 0) {
      last_ptr = stack.length
    }
    if(d <= 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  stack.length = last_ptr
  return new RedBlackTreeIterator(this, stack)
}


//Greatest-upper-bound
proto.greatestUpper = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  var last_ptr = 0
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d >= 0) {
      last_ptr = stack.length
    }
    if(d < 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  stack.length = last_ptr
  return new RedBlackTreeIterator(this, stack)
}

//Finds the item with key if it exists
proto.find = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d === 0) {
      return new RedBlackTreeIterator(this, stack)
    }
    if(d <= 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  return null
}

//Removes item with key from tree
proto.remove = function(key) {
  var iter = this.find(key)
  if(iter) {
    return iter.remove()
  }
  return this
}

//Returns the item at `key`
proto.get = function(key) {
  var cmp = this._compare
  var n = this._root
  var stack = []
  while(n) {
    var d = cmp(key, n._key)
    stack.push(n)
    if(d === 0) {
      return n._value
    }
    if(d <= 0) {
      n = n._left
    } else {
      n = n._right
    }
  }
  return
}

//Iterator for red black tree
function RedBlackTreeIterator(tree, stack) {
  this._tree = tree
  this._stack = stack
}

var iproto = RedBlackTreeIterator.prototype

//Test if iterator is valid
Object.defineProperty(iproto, "valid", {
  get: function() {
    return this._stack.length > 0
  }
})

//Makes a copy of an iterator
iproto.clone = function() {
  return new RedBlackTreeIterator(this._tree, this._stack.slice())
}

//Removes item at iterator from tree
iproto.remove = function() {
  if(this._stack.length === 0) {
    return this._tree
  }
  throw new Error("Not implemented")

  var stack = this._stack
  var nstack = new Array(stack.length)
  
  for(var i=stack.length-2; i>=0; --i) {
    if(stack[i])
  }
}

//Returns key
Object.defineProperty(iproto, "key", {
  get: function() {
    if(this._stack.length > 0) {
      return this._stack[this._stack.length-1]._key
    }
    return
  },
  enumerable: true
})

//Returns value
Object.defineProperty(iproto, "value", {
  get: function() {
    if(this._stack.length > 0) {
      return this._stack[this._stack.length-1]._value
    }
    return
  },
  enumerable: true
})

//Returns the position of this iterator in the sorted list
Object.defineProperty(iproto, "index", {
  get: function() {
    throw new Error("Not implemented")
  },
  enumerable: true
})

//Advances iterator to next element in list
iproto.next = function() {
  var stack = this._stack
  if(stack.length === 0) {
    return
  }
  var n = stack[stack.length-1]
  if(n._right) {
    n = n._right
    while(n) {
      stack.push(n)
      n = n._left
    }
  } else {
    stack.pop()
    while(stack.length > 0 && stack[stack.length-1].right === n) {
      n = stack[stack.length-1]
      stack.pop()
    }
  }
}

//Checks if iterator is at end of tree
Object.defineProperty(iproto, "hasNext", {
  get: function() {
    var stack = this._stack
    if(stack.length === 0) {
      return false
    }
    if(stack[stack.length-1]._right) {
      return true
    }
    for(var s=stack.length-1; s>0; --s) {
      if(stack[s-1]._left === stack[s]) {
        return true
      }
    }
    return false
  }
})

//Moves iterator backward one element
iproto.prev = function() {
  throw new Error("Not implemented")
}


//Checks if iterator is at start of tree
Object.defineProperty(iproto, "hasPrev", {
  get: function() {
    throw new Error("Not implemented")
  }
})

//Default comparison function
function defaultCompare(a, b) {
  if(a < b) {
    return -1
  }
  if(a > b) {
    return 1
  }
  return 0
}

//Build a tree
function createRBTree(compare) {
  return new RedBlackTree(compare || defaultCompare, null)
}