$ = require("jquery");

class General {
  static moveCursorToEnd(element) {
    // OPT Replace deprecated command
    document.execCommand("selectAll", false, null);
    document.getSelection().collapseToEnd();
  }

  static moveCursorTo(element, offset) {
    // OPT Replace deprecated command
    document.execCommand("selectAll", false, null);
    // Set the caret to the nth character of the first line of text
    document.getSelection().collapse(element.firstChild, offset);
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
    // OPT Replace deprecated command
    document.execCommand("selectAll", false, null);
  }

  static deselectText(inputField) {
    // TST Replaced window.getSelection by select
    // if (window.getSelection()) window.getSelection().empty();
    inputField.select();
  }

  static focus(inputField, moveCursor = Enums.FocusActions.END, deselect = true) {
    if (!inputField) return;
    setTimeout(function () {
      inputField.focus();
      if (inputField.contentEditable == "true" || inputField == typeof "input:text") {
        switch (moveCursor) {
          case Enums.FocusActions.ALL:
            General.selectText();
            break;
          case Enums.FocusActions.END:
            General.moveCursorToEnd(null);
            break;
        }
      } else if (deselect) {
        General.deselectText(inputField);
      }
    }, 0);
  }

  static findAll(element = document, selector) {
    return Array.from(element.querySelectorAll(selector));
  }

  static getParent(node, selector) {
    return $(node).parent(selector).get(0);
  }

  static getParents(node, selector) {
    return $(node).parents(selector).get();
  }

  static toggle(element, show) {
    if (show) {
      if (element.tagName == "DIV") {
        element.style.display = "block";
      } else {
        element.style.display = "";
      }
    } else {
      element.style.display = "none";
    }
  }
}

module.exports = General;
