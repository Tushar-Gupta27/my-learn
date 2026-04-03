class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  // Helper function to find the correct position recursively
  insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }
  bfs(root) {
    if (!root) return [];

    const result = [];
    const queue = [root]; // Initialize queue with root

    while (queue.length > 0) {
      const currentNode = queue.shift(); // Remove the first node
      result.push(currentNode.value);

      // Enqueue children in order (Left then Right)
      if (currentNode.left) queue.push(currentNode.left);
      if (currentNode.right) queue.push(currentNode.right);
    }

    return result;
  }
  dfsRecursivePreOrder = (node, arr = []) => {
    if (node) {
      arr.push(node.val);
      if (node.left) dfsRecursivePreOrder(node.left, arr);
      if (node.right) dfsRecursivePreOrder(node.right, arr);
    }
    return arr;
  };
  dfsRecursiveInOrder = (node, arr = []) => {
    if (node) {
      if (node.left) dfsRecursiveInOrder(node.left, arr);
      arr.push(node.val);
      if (node.right) dfsRecursiveInOrder(node.right, arr);
    }
    return arr;
  };

  dfsRecursivePostOrder = (node, arr = []) => {
    if (node) {
      if (node.left) dfsRecursivePostOrder(node.left, arr);
      if (node.right) dfsRecursivePostOrder(node.right, arr);
      arr.push(node.val);
    }
    return arr;
  };
}

//a tree can be constructed using this type of object - if not BST -> create current node -> left node will be the node returned by the smaller left object ran using the same function
// const tree = {
//   val: 1,
//   left: { val: 2, left: { val: 4 }, right: { val: 5 } },
//   right: { val: 3, left: { val: 6 }, right: { val: 7 } }
// };
