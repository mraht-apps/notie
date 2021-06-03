class DOM {
  static enhanceMethods() {
    NodeList.prototype.filter = Array.prototype.filter;
    NodeList.prototype.indexOf = Array.prototype.indexOf;
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
  }

  static removeAll(nodeList) {
    nodeList.forEach((node) => {
      node.remove();
    });
  }
}

module.exports = DOM;
