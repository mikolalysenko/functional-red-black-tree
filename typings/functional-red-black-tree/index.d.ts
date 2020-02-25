// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-classes-per-file */

declare module 'functional-red-black-tree' {
  /**
   * Each node of the tree
   *
   * @class Node
   * @template K
   * @template V
   */
  class Node<K, V> {
    /**
     * The key associated to the node
     *
     * @type {K}
     * @memberof Node
     */
    key: K;
    /**
     * The value associated to the node
     *
     * @type {V}
     * @memberof Node
     */
    value: V;
    /**
     * The left subtree of the node
     *
     * @type {Node<K, V>}
     * @memberof Node
     */
    left: Node<K, V>;
    /**
     * The right subtree of the node
     *
     * @type {Node<K, V>}
     * @memberof Node
     */
    right: Node<K, V>;
  }
  /**
   * Red Black Tree
   *
   * @class Tree
   * @template K
   * @template V
   */
  class Tree<K, V> {
    /**
     * A sorted array of all the keys in the tree
     *
     * @type {K[]}
     * @memberof Tree
     */
    keys: K[];
    /**
     * An array array of all the values in the tree
     *
     * @type {V[]}
     * @memberof Tree
     */
    values: V[];
    /**
     * The number of items in the tree
     *
     * @type {number}
     * @memberof Tree
     */
    length: number;
    /**
     * Retrieves the value associated to the given key
     *
     * @param {K} key is the key of the item to look up
     * @returns {Node<K, V>} The value of the first node associated to key
     * @memberof Tree
     */
    get(key: K): Node<K, V>;
    /**
     * Creates a new tree with the new pair inserted.
     *
     * @param {K} key is the key of the item to insert
     * @param {V} value  is the value of the item to insert
     * @returns {Tree<K, V>} A new tree with key and value inserted
     * @memberof Tree
     */
    insert(key: K, value: V): Tree<K, V>;
    /**
     * Removes the first item with key in the tree
     *
     * @param {K} key is the key of the item to remove
     * @returns {Tree<K, V>} A new tree with the given item removed if it exists
     * @memberof Tree
     */
    remove(key: K): Tree<K, V>;
    /**
     * Returns an iterator pointing to the first item in the tree with key, otherwise null.
     *
     * @param {K} key
     * @returns {Iterator<K, V>}
     * @memberof Tree
     */
    find(key: K): Iterator<K, V>;
    /**
     * Find the first item in the tree whose key is >= key
     *
     * @param {K} key is the key to search for
     * @returns {Iterator<K, V>} An iterator at the given element.
     * @memberof Tree
     */
    ge(key: K): Iterator<K, V>;
    /**
     * Finds the first item in the tree whose key is > key
     *
     * @param {K} key is the key to search for
     * @returns {Iterator<K, V>} An iterator at the given element
     * @memberof Tree
     */
    gt(key: K): Iterator<K, V>;
    /**
     * Finds the last item in the tree whose key is < key
     *
     * @param {K} key is the key to search for
     * @returns {Iterator<K, V>} An iterator at the given element
     * @memberof Tree
     */
    lt(key: K): Iterator<K, V>;
    /**
     * Finds the last item in the tree whose key is <= key
     *
     * @param {K} key is the key to search for
     * @returns {Iterator<K, V>} An iterator at the given element
     * @memberof Tree
     */
    le(key: K): Iterator<K, V>;
    /**
     * Finds an iterator starting at the given element
     *
     * @param {number} position is the index at which the iterator gets created
     * @returns {Iterator<K, V>} An iterator starting at position
     * @memberof Tree
     */
    at(position: number): Iterator<K, V>;
    /**
     * An iterator pointing to the first element in the tree
     *
     * @type {Iterator<K, V>}
     * @memberof Tree
     */
    begin: Iterator<K, V>;
    /**
     * An iterator pointing to the last element in the tree
     *
     * @type {Iterator<K, V>}
     * @memberof Tree
     */
    end: Iterator<K, V>;
    /**
     * Walks a visitor function over the nodes of the tree in order.
     *
     * @param {(key: K, value: V, lo?: number, hi?: number) => void} visitor is a callback that gets executed on each node. If a truthy value is returned from the visitor, then iteration is stopped. lo is an optional start of the range to visit (inclusive). hi is an optional end of the range to visit (non-inclusive).
     * @returns {V} The last value returned by the callback
     * @memberof Tree
     */
    forEach(visitor: (key: K, value: V, lo?: number, hi?: number) => void): V;
    /**
     * Returns the root node of the tree
     *
     * @type {Iterator<K, V>}
     * @memberof Tree
     */
    root: Iterator<K, V>;
  }
  /**
   * Each node of the tree
   *
   * @class Iterator
   * @template K
   * @template V
   */
  class Iterator<K, V> {
    /**
     * The key of the item referenced by the iterator
     *
     * @type {K}
     * @memberof Iterator
     */
    key: K;
    /**
     * The value of the item referenced by the iterator
     *
     * @type {V}
     * @memberof Iterator
     */
    value: V;
    /**
     * The value of the node at the iterator's current position. null is iterator is node valid.
     *
     * @type {Node<K, V>}
     * @memberof Iterator
     */
    node: Node<K, V>;
    /**
     * The tree associated to the iterator
     *
     * @type {Tree<K, V>}
     * @memberof Iterator
     */
    tree: Tree<K, V>;
    /**
     * Returns the position of this iterator in the sequence.
     *
     * @type {Number}
     * @memberof Iterator
     */
    index: Number;
    /**
     * Checks if the iterator is valid
     *
     * @type {boolean}
     * @memberof Iterator
     */
    valid: boolean;
    /**
     * Makes a copy of the iterator
     *
     * @returns {Iterator<K, V>}
     * @memberof Iterator
     */
    clone(): Iterator<K, V>;
    /**
     * Removes the item at the position of the iterator
     *
     * @returns {Tree<K, V>}  A new binary search tree with iter's item removed
     * @memberof Iterator
     */
    remove(): Tree<K, V>;
    /**
     * Updates the value of the node in the tree at this iterator
     *
     * @param {V} value
     * @returns {Tree<K, V>} A new binary search tree with the corresponding node updated
     * @memberof Iterator
     */
    update(value: V): Tree<K, V>;
    /**
     * Advances the iterator to the next position
     *
     * @returns {undefined}
     * @memberof Iterator
     */
    next(): undefined;
    /**
     * Moves the iterator backward one element
     *
     * @returns {undefined}
     * @memberof Iterator
     */
    prev(): undefined;
    /**
     * If true, then the iterator is not at the end of the sequence
     *
     * @type {boolean}
     * @memberof Iterator
     */
    hasNext: boolean;
    /**
     * If true, then the iterator is not at the beginning of the sequence
     *
     * @type {boolean}
     * @memberof Iterator
     */
    hasPrev: boolean;
  }

  /**
   * Creates an empty functional tree
   *
   * @template K
   * @template V
   * @returns {Tree<K, V>}
   */
  function createRBTree<K, V>(compare?: (a: any, b: any) => number): Tree<K, V>;

  export = createRBTree;
}
