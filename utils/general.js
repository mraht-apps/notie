class General {
  static moveCursorToEnd(element) {
    document.execCommand('selectAll', false, null);
    document.getSelection().collapseToEnd();
    // let range = document.createRange();
    // let selection = window.getSelection();
    // range.selectNodeContents(element.get(0));
    // range.setStart(element.get(0), element.text().length);
    // range.setEnd(element.get(0).firstChild, element.text().length);
    // selection.removeAllRanges();
    // selection.addRange(range);
  }
}

module.exports = General;
