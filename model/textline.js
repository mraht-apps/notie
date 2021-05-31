const General = require("../utils/general");

const placeholderText = "Type '/' for commands";
class Textline {
  static createByPageId(pageId) {
    let htmlElements = [];
    let textlines = Page_DB.getTextlines(pageId);
    document.querySelector(textlines).each(function (index, textline) {
      let htmlElement = Textline.create(textline);
      htmlElements.push(htmlElement);
    });

    return htmlElements;
  }

  static create(textline) {
    if (!textline) {
      textline = { id: "", text: "" };
    }

    let htmlTextline = document.createElement("div");
    htmlTextline.contentEditable = "true";
    htmlTextline.className = "pageElement textline";
    document.querySelector(htmlTextline).html(textline.textContent);
    if (!textline.id || textline.id.length == 0) {
      document.querySelector(htmlTextline).dataset.uuid = Crypto.generateUUID(6);
    } else {
      document.querySelector(htmlTextline).dataset.uuid = textline.id;
    }
    // css wouldn't recognize this attribute if we'd set it with jquery
    htmlTextline.dataset.placeholder = placeholderText;

    Textline.registerEvents(htmlTextline);

    return htmlTextline;
  }

  static registerEvents(htmlTextline) {
    document.querySelector(htmlTextline).addEventListener("keydown", (event) => Eventhandler.onKeydown(event));
    document.querySelector(htmlTextline).addEventListener("focus", (event) => Eventhandler.onFocus(event));
  }

  static appendBefore(element) {
    document.querySelector(Eventhandler.activeTextline).before(element);
    document.querySelector(Eventhandler.activeTextline).textContent = "";
    General.focus(document.querySelector(Eventhandler.activeTextline));
  }

  static focusFirst() {
    let textline = document.querySelector(".textline:first");
    General.focus(textline);
  }

  static focusLast() {
    let textline = document.querySelector(".textline:last");
    General.focus(textline);
  }

  static delete(textline) {
    let isFirstTextline = textline.is(".textline:first");

    Textline_DB.delete(true, [], [textline.dataset.uuid]);
    textline.remove();

    if (isFirstTextline) General.focus(document.querySelector("#pageName"));
  }

  static save(textline) {
    Textline_DB.update(true, [], {
      id: textline.dataset.uuid,
      text: textline.textContent,
    });
  }
}
class Eventhandler {
  activeTextline;

  static onFocus(event) {
    Eventhandler.activeTextline = document.querySelector(event.target);
  }

  static onKeydown(event) {
    // Ignore certain characters
    if (event.key == "Shift") return;

    let textline = document.querySelector(event.target);
    let prevElement = textline.previousElementSibling;
    let nextElement = textline.nextElementSibling;

    switch (event.key) {
      case "ArrowUp":
        General.focus(prevElement);
        event.preventDefault();
        return;
      case "ArrowDown":
        General.focus(nextElement);
        event.preventDefault();
        return;
      case "Backspace":
        let selectedTextLength = General.getSelectedTextLength();

        if (General.getCursorPosition(textline) == 0 && selectedTextLength == 0) {
          let prevElementTextLength = prevElement.textContent.length;
          if (textline.textContent.length > 0 && selectedTextLength == 0) {
            prevElement.textContent = prevElement.textContent + textline.textContent;
          }

          Textline.delete(textline);

          if (prevElement.is(".textline")) {
            General.moveCursorTo(prevElement, prevElementTextLength);
          }
          event.preventDefault();
        }
        return;
      case "Enter":
        if (BlockMenu.isOpen()) {
          let row = document.querySelector(".clickable.active")[0];
          let elementType = row.dataset.type;
          Page.addElement(elementType);
          BlockMenu.close();
        } else {
          let newTextline = Textline.create();
          textline.after(newTextline);
          General.focus(document.querySelector(newTextline));
        }
        event.preventDefault();
        return;
      case "/":
        BlockMenu.open();
        return;
      default:
        textline.dataset.previousValue = textline.textContent;
        break;
    }

    let regex = /^[\w\s]+$/;
    if (event.key.match(regex) || event.key == "Escape") {
      BlockMenu.close();
    }
  }
}

module.exports = Textline;
