"use strict"

var makeTree = require("../rbtree.js")

var t1 = makeTree()
var t2 = t1.insert(3, "foo")
var t3 = t2.insert(2, "bar")
var t4 = t3.insert(1, "baz")


var u1 = t2.insert(1, "p")
var u2 = u1.insert(10, "q")

var iter = t4.leastLower(0)
console.log(iter.key, iter.value)