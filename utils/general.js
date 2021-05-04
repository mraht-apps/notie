class General {
  static moveCursorToEnd(element) {
    document.execCommand("selectAll", false, null);
    document.getSelection().collapseToEnd();
  }

  static moveCursorTo(element, offset) {
    document.execCommand("selectAll", false, null);
    // Set the caret to the nth character of the first line of text
    document.getSelection().collapse(element.get(0).firstChild, offset);
  }

  static getCursorPosition() {
    return window.getSelection().baseOffset;
  }

  static getCursorPixelPosition() {
    var selection = window.getSelection();
    let range = selection.getRangeAt(0).cloneRange();
    var span = document.createElement("span");
    range.insertNode(span);
    let rect = span.getClientRects()[0];
    span.remove();
    return { x: rect.left, y: rect.top };
  }

  static getSelectedTextLength() {
    let selection = window.getSelection();
    return selection.focusOffset - selection.baseOffset;
  }

  static selectText() {
    document.execCommand("selectAll", false, null);
  }

  static deselectText() {
    window.getSelection().empty();
  }
}

module.exports = General;
