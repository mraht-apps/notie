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
    let selection = window.getSelection();
    let range = selection.getRangeAt(0).cloneRange();
    let span = document.createElement("span");
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
    if (window.getSelection()) window.getSelection().empty();
  }

  static focus(inputField, moveCursor = Enums.FocusActions.END, deselect = true) {
    setTimeout(function () {
      $(inputField).trigger("focus");
      if ($(inputField).is("div[contenteditable='true']") || $(inputField).is("input:text")) {
        switch (moveCursor) {
          case Enums.FocusActions.ALL:
            General.selectText();
            break;
          case Enums.FocusActions.END:
            General.moveCursorToEnd(null);
            break;
        }
      } else if (deselect) {
        General.deselectText();
      }
    }, 0);
  }
}

module.exports = General;
