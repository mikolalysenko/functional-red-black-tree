import createTree from "../src/rbtree"

var t = createTree<number, number>()

var s = Date.now()
for (var i = 0; i < 100000; ++i) {
	t = t.insert(Math.random(), Math.random())
}
console.log(Date.now() - s)
