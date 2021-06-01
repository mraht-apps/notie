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

  constructor(jsonData = null) {
    super(jsonData?.id, "text");

    this.initData(jsonData);
    this.create();
    this.registerEvents();

    this.container.append(this.htmlElement);
  }

  create() {
    if (!this.elementData) return;

    this.htmlElement = document.createElement("div");
    this.htmlElement.contentEditable = "true";
    this.htmlElement.className = "textline";
    this.htmlElement.dataset.placeholder = placeholderText;
  }

  initData(jsonData) {
    if (!jsonData) {
      jsonData = { type: Enums.ElementTypes.TEXTLINE.id, id: "", text: "" };
    }
    this.elementData = jsonData;
  }

  registerEvents() {
    this.htmlElement.onkeydown = (event) => Eventhandler.onKeydown(event);
    this.htmlElement.onfocus = (event) => Eventhandler.onFocus(event);
    this.container.onfocus = (event) => Eventhandler.onFocus(event);
  }

  static appendBefore(element) {
    document.querySelector("#content").insertBefore(element, Eventhandler.activeTextline.parentElement);
    Eventhandler.activeTextline.textContent = "";
    General.focus(Eventhandler.activeTextline);
  }

  static focusFirst() {
    let textline = document.querySelector(".textline:first-child");
    General.focus(textline);
  }

  static focusLast() {
    let textline = document.querySelector(".textline:last-child");
    General.focus(textline);
  }

  delete() {
    let isFirstTextline = typeof this.htmlElement == ".textline:first-of-type";

    Textline_DB.delete(true, [], [this.container.dataset.uuid]);
    this.container.remove();
    Page.removeElement(this);

    if (isFirstTextline) General.focus(document.querySelector("#pageName"));
  }

  save() {
    Textline_DB.update(true, [], {
      id: this.container.dataset.uuid,
      text: this.htmlElement.textContent,
    });
  }
}
class Eventhandler {
  activeTextline;

  static onFocus(event) {
    if (event.target.classList.contains("pageElement")) {
      Eventhandler.activeTextline = event.target.firstChild;
      General.focus(Eventhandler.activeTextline);
      event.preventDefault();
    } else {
      Eventhandler.activeTextline = event.target;
    }
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
