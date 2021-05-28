const General = require("../utils/general");
const Blockelement = require("./blockelement");

const placeholderText = "Type '/' for commands";

class Textline extends Blockelement {
  static createByPageId(pageId) {
    let htmlElements = [];
    let textlines = Page_DB.getTextlines(pageId);
    textlines.forEach((textline) => {
      let htmlElement = new Textline(textline);
      htmlElements.push(htmlElement);
    });

    return htmlElements;
  }

  constructor(jsonData) {
    super(jsonData.id, "textline");

    this.initData(jsonData);
    this.create();
  }

  create(jsonData) {
    if (!this.elementData) return;

    this.htmlElement = document.createElement("div");
    this.htmlElement.contentEditable = "true";
    this.htmlElement.className = "textline";
    this.htmlElement.dataset.placeholder = placeholderText;

    this.registerEvents();
  }

  initData(jsonData) {
    if (!jsonData) {
      jsonData = { id: "", text: "" };
    }
    this.elementData = jsonData;
  }

  registerEvents() {
    $(this.htmlElement).on("keydown", (event) => Eventhandler.onKeydown(event));
    $(this.htmlElement).on("focus", (event) => Eventhandler.onFocus(event));
  }

  static appendBefore(element) {
    $(Eventhandler.activeTextline).before(element);
    $(Eventhandler.activeTextline).text("");
    General.focus($(Eventhandler.activeTextline));
  }

  static focusFirst() {
    let textline = $(".textline:first");
    General.focus(textline);
  }

  static focusLast() {
    let textline = $(".textline:last");
    General.focus(textline);
  }

  static delete(textline) {
    let isFirstTextline = textline.is(".textline:first");

    Textline_DB.delete(true, [], [textline.data("uuid")]);
    textline.remove();

    if (isFirstTextline) General.focus($("#pageName"));
  }

  static save(textline) {
    Textline_DB.update(true, [], {
      id: textline.data("uuid"),
      text: textline.text(),
    });
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
    let prevElement = textline.prev();
    let nextElement = textline.next();

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
          let prevElementTextLength = prevElement.text().length;
          if (textline.text().length > 0 && selectedTextLength == 0) {
            prevElement.text(prevElement.text() + textline.text());
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
          let row = $(".clickable.active").eq(0);
          let elementType = row.data("type");
          Page.addElement(elementType);
          BlockMenu.close();
        } else {
          let newTextline = Textline.create();
          textline.after(newTextline);
          General.focus($(newTextline));
        }
        event.preventDefault();
        return;
      case "/":
        BlockMenu.open();
        return;
      default:
        textline.data("previousValue", textline.text());
        break;
    }

    let regex = /^[\w\s]+$/;
    if (event.key.match(regex) || event.key == "Escape") {
      BlockMenu.close();
    }
  }
}

module.exports = Textline;
