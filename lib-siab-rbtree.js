define([], function () {
  "use strict";

  var RED = 0;
  var BLACK = 1;

  function RBNode(color, key, value, left, right, count) {
    this._color = color;
    this.key = key;
    this.value = value;
    this.left = left;
    this.right = right;
    this._count = count;
  }

  function cloneNode(node) {
    return new RBNode(node._color, node.key, node.value, node.left, node.right, node._count);
  }

  function repaint(color, node) {
    return new RBNode(color, node.key, node.value, node.left, node.right, node._count);
  }

  function recount(node) {
    node._count = 1 + (node.left ? node.left._count : 0) + (node.right ? node.right._count : 0);
  }

  function RedBlackTree(compare, root) {
    this._compare = compare;
    this.root = root;
  }

  var proto = RedBlackTree.prototype;

  Object.defineProperty(proto, "keys", {
    get: function () {
      var result;

      result = [];
      this.forEach(function (k, v) {
        result.push(k);
      });
      return result;
    }
  });

  Object.defineProperty(proto, "values", {
    get: function () {
      var result;

      result = [];
      this.forEach(function (k, v) {
        result.push(v);
      });
      return result;
    }
  });

  //Returns the number of nodes in the tree
  Object.defineProperty(proto, "length", {
    get: function () {
      if (this.root) {
        return this.root._count;
      }
      return 0;
    }
  });

  proto.insert = function (key, value) {
    var cmp, n, n_stack, d_stack, d, s, p, pp, y, ppp;

    cmp = this._compare;
    n = this.root;
    n_stack = [];
    d_stack = [];
    while (n) {
      d = cmp(key, n.key);
      n_stack.push(n);
      d_stack.push(d);
      if (d <= 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }

    n_stack.push(new RBNode(RED, key, value, null, null, 1));
    for (s = n_stack.length - 2; s >= 0; --s) {
      n = n_stack[s];
      if (d_stack[s] <= 0) {
        n_stack[s] = new RBNode(n._color, n.key, n.value, n_stack[s + 1], n.right, n._count + 1);
      } else {
        n_stack[s] = new RBNode(n._color, n.key, n.value, n.left, n_stack[s + 1], n._count + 1);
      }
    }

    for (s = n_stack.length - 1; s > 1; --s) {
      p = n_stack[s - 1];
      n = n_stack[s];
      if (p._color === BLACK || n._color === BLACK) {
        break;
      }
      pp = n_stack[s - 2];
      if (pp.left === p) {
        if (p.left === n) {
          y = pp.right;
          if (y && y._color === RED) {
           p._color = BLACK;
            pp.right = repaint(BLACK, y);
            pp._color = RED;
            s -= 1;
          } else {
            pp._color = RED;
            pp.left = p.right;
            p._color = BLACK;
            p.right = pp;
            n_stack[s - 2] = p;
            n_stack[s - 1] = n;
            recount(pp);
            recount(p);
            if (s >= 3) {
              ppp = n_stack[s - 3];
              if (ppp.left === pp) {
                ppp.left = p;
              } else {
                ppp.right = p;
              }
            }
            break;
          }
        } else {
          y = pp.right;
          if (y && y._color === RED) {
            p._color = BLACK;
            pp.right = repaint(BLACK, y);
            pp._color = RED;
            s -= 1;
          } else {
            p.right = n.left;
            pp._color = RED;
            pp.left = n.right;
            n._color = BLACK;
            n.left = p;
            n.right = pp;
            n_stack[s - 2] = n;
            n_stack[s - 1] = p;
            recount(pp);
            recount(p);
            recount(n);
            if (s >= 3) {
              ppp = n_stack[s - 3];
              if (ppp.left === pp) {
                ppp.left = n;
              } else {
                ppp.right = n;
              }
            }
            break;
          }
        }
      } else {
        if (p.right === n) {
          y = pp.left;
          if (y && y._color === RED) {
            p._color = BLACK;
            pp.left = repaint(BLACK, y);
            pp._color = RED;
            s -= 1;
          } else {
            pp._color = RED;
            pp.right = p.left;
            p._color = BLACK;
            p.left = pp;
            n_stack[s - 2] = p;
            n_stack[s - 1] = n;
            recount(pp);
            recount(p);
            if (s >= 3) {
              ppp = n_stack[s - 3];
              if (ppp.right === pp) {
                ppp.right = p;
              } else {
                ppp.left = p;
              }
            }
            break;
          }
        } else {
          y = pp.left;
          if (y && y._color === RED) {
            p._color = BLACK;
            pp.left = repaint(BLACK, y);
            pp._color = RED;
            s -= 1;
          } else {
            p.left = n.right;
            pp._color = RED;
            pp.right = n.left;
            n._color = BLACK;
            n.right = p;
            n.left = pp;
            n_stack[s - 2] = n;
            n_stack[s - 1] = p;
            recount(pp);
            recount(p);
            recount(n);
            if (s >= 3) {
              ppp = n_stack[s - 3];
              if (ppp.right === pp) {
                ppp.right = n;
              } else {
                ppp.left = n;
              }
            }
            break;
          }
        }
      }
    }
    n_stack[0]._color = BLACK;
    return new RedBlackTree(cmp, n_stack[0]);
  };

  function doVisitFull(visit, node) {
    var v;

    if (node.left) {
      v = doVisitFull(visit, node.left);
      if (v) { return v; }
    }
    v = visit(node.key, node.value);
    if (v) { return v; }
    if (node.right) {
      return doVisitFull(visit, node.right);
    }
  }

  function doVisitHalf(lo, compare, visit, node) {
    var l, v;

    l = compare(lo, node.key);
    if (l <= 0) {
      if (node.left) {
        v = doVisitHalf(lo, compare, visit, node.left);
        if (v) { return v; }
      }
      v = visit(node.key, node.value);
      if (v) { return v; }
    }
    if (node.right) {
      return doVisitHalf(lo, compare, visit, node.right);
    }
  }

  function doVisit(lo, hi, compare, visit, node) {
    var l, h, v;

    l = compare(lo, node.key);
    h = compare(hi, node.key);
    if (l <= 0) {
      if (node.left) {
        v = doVisit(lo, hi, compare, visit, node.left);
        if (v) { return v; }
      }
      if (h > 0) {
        v = visit(node.key, node.value);
        if (v) { return v; }
      }
    }
    if (h > 0 && node.right) {
      return doVisit(lo, hi, compare, visit, node.right);
    }
  }

  proto.forEach = function rbTreeForEach(visit, lo, hi) {
    if (!this.root) {
      return;
    }
    switch (arguments.length) {
      case 1:
        return doVisitFull(visit, this.root);
      case 2:
        return doVisitHalf(lo, this._compare, visit, this.root);
      case 3:
        if (this._compare(lo, hi) >= 0) {
          return;
        }
        return doVisit(lo, hi, this._compare, visit, this.root);
    }
  };

  Object.defineProperty(proto, "begin", {
    get: function () {
      var stack, n;

      stack = [];
      n = this.root;
      while (n) {
        stack.push(n);
        n = n.left;
      }
      return new RedBlackTreeIterator(this, stack);
    }
  });

  Object.defineProperty(proto, "end", {
    get: function () {
      var stack, n;

      stack = [];
      n = this.root;
      while (n) {
        stack.push(n);
        n = n.right;
      }
      return new RedBlackTreeIterator(this, stack);
    }
  });

  proto.at = function (idx) {
    var n, stack;

    if (idx < 0) {
      return new RedBlackTreeIterator(this, []);
    }
    n = this.root;
    stack = [];
    while (true) {
      stack.push(n);
      if (n.left) {
        if (idx < n.left._count) {
          n = n.left;
          continue;
        }
        idx -= n.left._count;
      }
      if (!idx) {
        return new RedBlackTreeIterator(this, stack);
      }
      idx -= 1;
      if (n.right) {
        if (idx >= n.right._count) {
          break;
        }
        n = n.right;
      } else {
        break;
      }
    }
    return new RedBlackTreeIterator(this, []);
  };

  proto.ge = function (key) {
    var cmp, n, stack, last_ptr, d;

    cmp = this._compare;
    n = this.root;
    stack = [];
    last_ptr = 0;
    while (n) {
      d = cmp(key, n.key);
      stack.push(n);
      if (d <= 0) {
        last_ptr = stack.length;
      }
      if (d <= 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    stack.length = last_ptr;
    return new RedBlackTreeIterator(this, stack);
  };

  proto.gt = function (key) {
    var cmp, n, stack, last_ptr, d;

    cmp = this._compare;
    n = this.root;
    stack = [];
    last_ptr = 0;
    while (n) {
      d = cmp(key, n.key);
      stack.push(n);
      if (d < 0) {
        last_ptr = stack.length;
      }
      if (d < 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    stack.length = last_ptr;
    return new RedBlackTreeIterator(this, stack);
  };

  proto.lt = function (key) {
    var cmp, n, stack, last_ptr, d;

    cmp = this._compare;
    n = this.root;
    stack = [];
    last_ptr = 0;
    while (n) {
      d = cmp(key, n.key);
      stack.push(n);
      if (d > 0) {
        last_ptr = stack.length;
      }
      if (d <= 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    stack.length = last_ptr;
    return new RedBlackTreeIterator(this, stack);
  };

  proto.le = function (key) {
    var cmp, n, stack, last_ptr, d;

    cmp = this._compare;
    n = this.root;
    stack = [];
    last_ptr = 0;
    while (n) {
      d = cmp(key, n.key);
      stack.push(n);
      if (d >= 0) {
        last_ptr = stack.length;
      }
      if (d < 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    stack.length = last_ptr;
    return new RedBlackTreeIterator(this, stack);
  };

  proto.find = function (key) {
    var cmp, n, stack, d;

    cmp = this._compare;
    n = this.root;
    stack = [];
    while (n) {
      d = cmp(key, n.key);
      stack.push(n);
      if (d === 0) {
        return new RedBlackTreeIterator(this, stack);
      }
      if (d <= 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    return new RedBlackTreeIterator(this, []);
  };

  proto.remove = function (key) {
    var iter;

    iter = this.find(key);
    if (iter) {
      return iter.remove();
    }
    return this;
  };

  proto.get = function (key) {
    var cmp, n, d;

    cmp = this._compare;
    n = this.root;
    while (n) {
      d = cmp(key, n.key);
      if (d === 0) {
        return n.value;
      }
      if (d <= 0) {
        n = n.left;
      } else {
        n = n.right;
      }
    }
    return;
  };

  function RedBlackTreeIterator(tree, stack) {
    this.tree = tree;
    this._stack = stack;
  }

  var iproto = RedBlackTreeIterator.prototype;

  Object.defineProperty(iproto, "valid", {
    get: function () {
      return this._stack.length > 0;
    }
  });

  Object.defineProperty(iproto, "node", {
    get: function () {
      if (this._stack.length > 0) {
        return this._stack[this._stack.length - 1];
      }
      return null;
    },
    enumerable: true
  });

  iproto.clone = function () {
    return new RedBlackTreeIterator(this.tree, this._stack.slice());
  };

  function swapNode(n, v) {
    n.key = v.key;
    n.value = v.value;
    n.left = v.left;
    n.right = v.right;
    n._color = v._color;
    n._count = v._count;
  }

  function fixDoubleBlack(stack) {
    var i, n, p, s, z, pp;

    for (i = stack.length - 1; i >= 0; --i) {
      n = stack[i];
      if (i === 0) {
        n._color = BLACK;
        return;
      }

      p = stack[i - 1];
      if (p.left === n) {
        s = p.right;
        if (s.right && s.right._color === RED) {
          s = p.right = cloneNode(s);
          z = s.right = cloneNode(s.right);
          p.right = s.left;
          s.left = p;
          s.right = z;
          s._color = p._color;
          n._color = BLACK;
          p._color = BLACK;
          z._color = BLACK;
          recount(p);
          recount(s);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.left === p) {
              pp.left = s;
            } else {
              pp.right = s;
            }
          }
          stack[i - 1] = s;
          return;
        } else if (s.left && s.left._color === RED) {
          s = p.right = cloneNode(s);
          z = s.left = cloneNode(s.left);
          p.right = z.left;
          s.left = z.right;
          z.left = p;
          z.right = s;
          z._color = p._color;
          p._color = BLACK;
          s._color = BLACK;
          n._color = BLACK;
          recount(p);
          recount(s);
          recount(z);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.left === p) {
              pp.left = z;
            } else {
              pp.right = z;
            }
          }
          stack[i - 1] = z;
          return;
        }
        if (s._color === BLACK) {
          if (p._color === RED) {
            p._color = BLACK;
            p.right = repaint(RED, s);
            return;
          } else {
            p.right = repaint(RED, s);
            continue;
          }
        } else {
          s = cloneNode(s);
          p.right = s.left;
          s.left = p;
          s._color = p._color;
          p._color = RED;
          recount(p);
          recount(s);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.left === p) {
              pp.left = s;
            } else {
              pp.right = s;
            }
          }
          stack[i - 1] = s;
          stack[i] = p;
          if (i + 1 < stack.length) {
            stack[i + 1] = n;
          } else {
            stack.push(n);
          }
          i = i + 2;
        }
      } else {
        s = p.left;
        if (s.left && s.left._color === RED) {
          s = p.left = cloneNode(s);
          z = s.left = cloneNode(s.left);
          p.left = s.right;
          s.right = p;
          s.left = z;
          s._color = p._color;
          n._color = BLACK;
          p._color = BLACK;
          z._color = BLACK;
          recount(p);
          recount(s);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.right === p) {
              pp.right = s;
            } else {
              pp.left = s;
            }
          }
          stack[i - 1] = s;
          return;
        } else if (s.right && s.right._color === RED) {
          s = p.left = cloneNode(s);
          z = s.right = cloneNode(s.right);
          p.left = z.right;
          s.right = z.left;
          z.right = p;
          z.left = s;
          z._color = p._color;
          p._color = BLACK;
          s._color = BLACK;
          n._color = BLACK;
          recount(p);
          recount(s);
          recount(z);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.right === p) {
              pp.right = z;
            } else {
              pp.left = z;
            }
          }
          stack[i - 1] = z;
          return;
        }
        if (s._color === BLACK) {
          if (p._color === RED) {
            p._color = BLACK;
            p.left = repaint(RED, s);
            return;
          } else {
            p.left = repaint(RED, s);
            continue;
          }
        } else {
          s = cloneNode(s);
          p.left = s.right;
          s.right = p;
          s._color = p._color;
          p._color = RED;
          recount(p);
          recount(s);
          if (i > 1) {
            pp = stack[i - 2];
            if (pp.right === p) {
              pp.right = s;
            } else {
              pp.left = s;
            }
          }
          stack[i - 1] = s;
          stack[i] = p;
          if (i + 1 < stack.length) {
            stack[i + 1] = n;
          } else {
            stack.push(n);
          }
          i = i + 2;
        }
      }
    }
  };

  iproto.remove = function () {
    var stack, cstack, n, i, split, v, p, parent;

    stack = this._stack;
    if (stack.length === 0) {
      return this.tree;
    }
    cstack = new Array(stack.length);
    n = stack[stack.length - 1];
    cstack[cstack.length - 1] = new RBNode(n._color, n.key, n.value, n.left, n.right, n._count);
    for (i = stack.length - 2; i >= 0; --i) {
      n = stack[i];
      if (n.left === stack[i + 1]) {
        cstack[i] = new RBNode(n._color, n.key, n.value, cstack[i + 1], n.right, n._count);
      } else {
        cstack[i] = new RBNode(n._color, n.key, n.value, n.left, cstack[i + 1], n._count);
      }
    }

    n = cstack[cstack.length - 1];

    if (n.left && n.right) {
      split = cstack.length;
      n = n.left;
      while (n.right) {
        cstack.push(n);
        n = n.right;
      }
      v = cstack[split - 1];
      cstack.push(new RBNode(n._color, v.key, v.value, n.left, n.right, n._count));
      cstack[split - 1].key = n.key;
      cstack[split - 1].value = n.value;

      for (i = cstack.length - 2; i >= split; --i) {
        n = cstack[i];
        cstack[i] = new RBNode(n._color, n.key, n.value, n.left, cstack[i + 1], n._count);
      }
      cstack[split - 1].left = cstack[split];
    }

    n = cstack[cstack.length - 1];
    if (n._color === RED) {
      p = cstack[cstack.length - 2];
      if (p.left === n) {
        p.left = null;
      } else if (p.right === n) {
        p.right = null;
      }
      cstack.pop();
      for (i = 0; i < cstack.length; ++i) {
        cstack[i]._count--;
      }
      return new RedBlackTree(this.tree._compare, cstack[0]);
    } else {
      if (n.left || n.right) {
        if (n.left) {
          swapNode(n, n.left);
        } else if (n.right) {
          swapNode(n, n.right);
        }

        n._color = BLACK;
        for (i = 0; i < cstack.length - 1; ++i) {
          cstack[i]._count--;
        }
        return new RedBlackTree(this.tree._compare, cstack[0]);
      } else if (cstack.length === 1) {
        return new RedBlackTree(this.tree._compare, null);
      } else {
        for (i = 0; i < cstack.length; ++i) {
          cstack[i]._count--;
        }
        parent = cstack[cstack.length - 2];
        fixDoubleBlack(cstack);

        if (parent.left === n) {
          parent.left = null;
        } else {
          parent.right = null;
        }
      }
    }
    return new RedBlackTree(this.tree._compare, cstack[0]);
  };

  Object.defineProperty(iproto, "key", {
    get: function () {
      if (this._stack.length > 0) {
        return this._stack[this._stack.length - 1].key;
      }
      return;
    },
    enumerable: true
  });

  Object.defineProperty(iproto, "value", {
    get: function () {
      if (this._stack.length > 0) {
        return this._stack[this._stack.length - 1].value;
      }
      return;
    },
    enumerable: true
  });

  Object.defineProperty(iproto, "index", {
    get: function () {
      var idx, stack, r, s;

      idx = 0;
      stack = this._stack;
      if (stack.length === 0) {
        r = this.tree.root;
        if (r) {
          return r._count;
        }
        return 0;
      } else if (stack[stack.length - 1].left) {
        idx = stack[stack.length - 1].left._count;
      }
      for (s = stack.length - 2; s >= 0; --s) {
        if (stack[s + 1] === stack[s].right) {
          ++idx;
          if (stack[s].left) {
            idx += stack[s].left._count;
          }
        }
      }
      return idx;
    },
    enumerable: true
  });

  iproto.next = function () {
    var stack, n;

    stack = this._stack;
    if (stack.length === 0) {
      return;
    }
    n = stack[stack.length - 1];
    if (n.right) {
      n = n.right;
      while (n) {
        stack.push(n);
        n = n.left;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].right === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  };

  Object.defineProperty(iproto, "hasNext", {
    get: function () {
      var stack, s;

      stack = this._stack;
      if (stack.length === 0) {
        return false;
      }
      if (stack[stack.length - 1].right) {
        return true;
      }
      for (s = stack.length - 1; s > 0; --s) {
        if (stack[s - 1].left === stack[s]) {
          return true;
        }
      }
      return false;
    }
  });

  iproto.update = function (value) {
    var stack, cstack, n, i;

    stack = this._stack;
    if (stack.length === 0) {
      throw new Error("Can't update empty node!");
    }
    cstack = new Array(stack.length);
    n = stack[stack.length - 1];
    cstack[cstack.length - 1] = new RBNode(n._color, n.key, value, n.left, n.right, n._count);
    for (i = stack.length - 2; i >= 0; --i) {
      n = stack[i];
      if (n.left === stack[i + 1]) {
        cstack[i] = new RBNode(n._color, n.key, n.value, cstack[i + 1], n.right, n._count);
      } else {
        cstack[i] = new RBNode(n._color, n.key, n.value, n.left, cstack[i + 1], n._count);
      }
    }
    return new RedBlackTree(this.tree._compare, cstack[0]);
  };

  iproto.prev = function () {
    var stack, n;

    stack = this._stack;
    if (stack.length === 0) {
      return;
    }
    n = stack[stack.length - 1];
    if (n.left) {
      n = n.left;
      while (n) {
        stack.push(n);
        n = n.right;
      }
    } else {
      stack.pop();
      while (stack.length > 0 && stack[stack.length - 1].left === n) {
        n = stack[stack.length - 1];
        stack.pop();
      }
    }
  };

  Object.defineProperty(iproto, "hasPrev", {
    get: function () {
      var stack;

      stack = this._stack;
      if (stack.length === 0) {
        return false;
      }
      if (stack[stack.length - 1].left) {
        return true;
      }
      for (var s = stack.length - 1; s > 0; --s) {
        if (stack[s - 1].right === stack[s]) {
          return true;
        }
      }
      return false;
    }
  });

  function defaultCompare(a, b) {
    var arr;

    arr = [a, b].sort();
    if (arr[0] === a) {
      return -1;
    } else {
      return 1;
    }
  }

  function createRBTree(compare) {
    return new RedBlackTree(compare || defaultCompare, null);
  }

  return {
    createRBTree: createRBTree
  };
});
