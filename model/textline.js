const General = require("../utils/general");

const placeholderText = "Type '/' for commands";
class Textline {
  static build(parent, text) {
    let textline = document.createElement("div");
    textline.contentEditable = "true";
    textline.className = "textline";
    let textNode = document.createTextNode(text);
    textline.appendChild(textNode);
    textline.dataset.uuid = CryptoJS.generateUUID(6);
    textline.dataset.placeholder = placeholderText;

    Textline.registerEvents(textline);
    parent.append(textline);
    return textline;
  }

  static registerEvents(textline) {
    $(textline).on("keydown", function (event) {
      Eventhandler.onKeydown(event);
    });

    $(textline).on("focus", function (event) {
      Eventhandler.onFocus(event);
    });
  }

  static focusNext(nextElement) {
    if (!nextElement.is(".textline")) return;
    nextElement.trigger("focus");
    GeneralJS.moveCursorToEnd(null);
  }

  static focusPrev(prevElement) {
    if (!prevElement.is(".textline")) return;
    prevElement.trigger("focus");
    GeneralJS.moveCursorToEnd(null);
  }
}
class Eventhandler {
  activeTextline;

  static onFocus(event) {
    Eventhandler.activeTextline = $(event.target);
  }

  static onKeydown(event) {
    // Ignore certain characters
    if (event.key == "Shift") return;

    let textline = $(event.target);
    switch (event.key) {
      case "ArrowUp":
        var prevElement = textline.prev();
        Textline.focusPrev(prevElement);
        event.preventDefault();
        break;
      case "ArrowDown":
        var nextElement = textline.next();
        Textline.focusNext(nextElement);
        event.preventDefault();
        break;
      case "Backspace":
        var prevElement = textline.prev();
        if (prevElement.is(".textline") && GeneralJS.getCursorPosition(textline) == 0) {
          let prevElementTextLength = prevElement.text().length;
          if (textline.text().length > 0) {
            prevElement.text(prevElement.text() + textline.text());
          }
          textline.remove();
          GeneralJS.moveCursorTo(prevElement, prevElementTextLength);
          event.preventDefault();
        }
        break;
      case "Enter":
        if (BlockMenuJS.BlockMenu.isOpen()) {
          BlockMenuJS.BlockMenu.addElement();
          BlockMenuJS.BlockMenu.closeAll();
          event.preventDefault();
          return;
        }
        // NEW Enter before text: Add textline before
        // NEW Enter within text: Split text at cursor position
        let newTextline = Textline.build(textline.parent(), "");
        Textline.registerEvents();
        textline.after(newTextline);
        Textline.focusNext($(newTextline));
        event.preventDefault();
        break;
      case "/":
        let { x, y } = GeneralJS.getCursorPixelPosition();
        BlockMenuJS.BlockMenu.openFirstTime(x, y);
        break;
      default:
        textline.data("previousValue", textline.text());
        break;
    }

    // OPT Optimize blockmenu opening (e.g. also on backspace)
    let regex = /^[\w\s]+$/;
    if (event.key.match(regex) || event.key == "Escape") {
      BlockMenuJS.BlockMenu.closeAll();
    }
  }
}

module.exports = { Textline, Eventhandler };
