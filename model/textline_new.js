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
    this.htmlElement.onkeydown = (event) => Eventhandler.onKeydown(event);
    this.htmlElement.onfocus = (event) => Eventhandler.onFocus(event);
  }

  static appendBefore(element) {
    Eventhandler.activeTextline.insertBefore(element);
    Eventhandler.activeTextline.textContent = "";
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

  delete() {
    let isFirstTextline = typeof this.htmlElement == ".textline:first";

    Textline_DB.delete(true, [], [this.htmlElement.dataset.uuid]);
    this.htmlElement.remove();

    if (isFirstTextline) General.focus(document.querySelector("#pageName"));
  }

  save() {
    Textline_DB.update(true, [], {
      id: this.htmlElement.dataset.uuid,
      text: this.htmlElement.textContent,
    });
  }
}
class Eventhandler {
  activeTextline;

  static onFocus(event) {
    Eventhandler.activeTextline = event.target;
  }

  static onKeydown(event) {
    // Ignore certain characters
    if (event.key == "Shift") return;

    let textline = event.target;
    let prevElement = textline.previousElementSibling;
    let nextElement = textline.nextSibling;

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

          textline.delete();

          if (typeof prevElement == ".textline") {
            General.moveCursorTo(prevElement, prevElementTextLength);
          }
          event.preventDefault();
        }
        return;
      case "Enter":
        if (BlockMenu.isOpen()) {
          let row = document.querySelector(".clickable.active");
          let elementType = row.dataset.type;
          Page.addElement(elementType);
          BlockMenu.close();
        } else {
          let newTextline = new Textline();
          textline.after(newTextline.container);
          General.focus(newTextline);
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
