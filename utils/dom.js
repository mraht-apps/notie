class DOM {
  static enhanceMethods() {
    NodeList.prototype.filter = Array.prototype.filter;
    NodeList.prototype.indexOf = Array.prototype.indexOf;
  }

  static removeAll(nodeList) {
    nodeList.forEach((node) => {
      node.remove();
    });
  }
}

module.exports = DOM;
