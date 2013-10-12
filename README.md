functional-red-black-tree
=========================
A purely functional red-black tree data structure.  

Functional data structures allow for non-destructive updates.  So if you insert an element into the tree, it returns a new tree with the inserted element rather than destructively update the existing tree in place.  Doing this requires using extra memory, and if one were naive it could cost as much as reallocating the entire tree.  Instead, this data structure saves some memory by recycling references to previously allocated subtrees.  This requires using only O(log(n)) additional memory per copy instead of O(n) which a full copy would require.

Some advantages of this is that it is possible to apply insertions and removals to the tree while still iterating over previous versions of the tree.  Functional and persistent data structures can also be useful in many geometric algorithms like point location within triangulations or ray queries.

NOT YET FINISHED

# Install

    npm install functional-red-black-tree

# Example

```javascript
//Load the library
var createTree = require("functional-red-black-tree")

//Create a tree
var t1 = createTree()

//Insert some items into the tree
var t2 = t1.insert(1, "foo")
var t3 = t2.insert(2, "bar")

//Remove something
var t4 = t3.remove(1)
```

# API

```javascript
var createTree = require("functional-red-black-tree")
```

## Tree methods

### `var tree = createTree([compare])`
Creates an empty functional tree

* `compare` is an optional comparison function, same semantics as array.sort()

**Returns** An empty tree ordered by `compare`

### `tree.root`
Returns the root node of the tree

### `tree.get(key)`
Retrieves the value associated to the given key

* `key` is the key of the item to look up

**Returns** The value of the first node associated to `key`

### `tree.find(key)`
Returns an iterator pointing to the first item in the tree with `key`, otherwise `null`.

### `tree.insert(key, value)`
Creates a new tree with the new pair inserted.

* `key` is the key of the item to insert
* `value` is the value of the item to insert

**Returns** A new tree with `key` and `value` inserted

### `tree.remove(key)`
Removes the first item with `key` in the tree

* `key` is the key of the item to remove

**Returns** A new tree with the given item removed if it exists

### `tree.leastLower(key)`
Find the first item in the tree whose key is `>= key`

* `key` is the key to search for

**Returns** An iterator at the given element.

### `tree.greatestLower(key)`
Finds the first item in the tree whose key is `> key`

* `key` is the key to search for

**Returns** An iterator at the given element

### `tree.leastUpper(key)`
Finds the last item in the tree whose key is `< key`

* `key` is the key to search for

**Returns** An iterator at the given element

### `tree.greatestUpper(key)`
Finds the last item in the tree whose key is `<= key`

* `key` is the key to search for

**Returns** An iterator at the given element

### `tree.at(position)`
Finds an iterator starting at the given element

* `position` is the index at which the iterator gets created

**Returns** An iterator starting at position

### `tree.begin`
An iterator pointing to the first element in the tree

### `tree.end`
An iterator pointing to the last element in the tree

## Node properties
Each node of the tree has the following properties:

### `node.key`
The key associated to the node

### `node.value`
The value associated to the node

### `node.left`
The left subtree of the node

### `node.right`
The right subtree of the node

## Iterator methods

### `iter.key`
The key of the item referenced by the iterator

### `iter.value`
The value of the item referenced by the iterator

### `iter.node`
The value of the node at the iterator's current position.  `null` is iterator is node valid.

### `iter.tree`
The tree associated to the iterator

### `iter.index`
Returns the position of this iterator in the sequence.

### `iter.valid`
Checks if the iterator is valid

### `iter.clone()`
Makes a copy of the iterator

### `iter.remove()`
Removes the item at the position of the iterator

**Returns** A new binary search tree with `iter`'s item removed

### `iter.next()`
Advances the iterator to the next position

### `iter.prev()`
Moves the iterator backward one element

### `iter.hasNext`
If true, then the iterator is not at the end of the sequence

### `iter.hasPrev`
If true, then the iterator is not at the beginning of the sequence

# Credits
(c) 2013 Mikola Lysenko. MIT License