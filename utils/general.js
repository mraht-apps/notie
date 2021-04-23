class General {
  static moveCursorToEnd(element) {
    document.execCommand("selectAll", false, null);
    document.getSelection().collapseToEnd();
    // let range = document.createRange();
    // let selection = window.getSelection();
    // range.selectNodeContents(element.get(0));
    // range.setStart(element.get(0), element.text().length);
    // range.setEnd(element.get(0).firstChild, element.text().length);
    // selection.removeAllRanges();
    // selection.addRange(range);
  }

  static getCursorPositionTextline() {
    var selection = window.getSelection();
    let range = selection.getRangeAt(0).cloneRange();
    var span = document.createElement("span");
    range.insertNode(span);
    let rect = span.getClientRects()[0];
    span.remove();
    return { x: rect.left, y: rect.top };
  }
}

module.exports = General;
