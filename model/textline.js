const Textline_DB = require("../controller/database/textline_db");
const General = require("../utils/general");

const placeholderText = "Type '/' for commands";
class Textline {
  static create(textline) {
    if (!textline) {
      textline = { id: "", text: "" };
    }

    let htmlTextline = document.createElement("div");
    htmlTextline.contentEditable = "true";
    htmlTextline.className = "pageElement textline";
    $(htmlTextline).html(textline.text);
    if (!textline.id || textline.id.length == 0) {
      $(htmlTextline).data("uuid", Crypto.generateUUID(6));
    } else {
      $(htmlTextline).data("uuid", textline.id);
    }
    $(htmlTextline).data("placeholder", placeholderText);

    Textline.registerEvents(htmlTextline);

    return htmlTextline;
  }

  static registerEvents(htmlTextline) {
    $(htmlTextline).on("keydown", function (event) {
      Eventhandler.onKeydown(event);
    });

    $(htmlTextline).on("focus", function (event) {
      Eventhandler.onFocus(event);
    });
  }

  static appendBefore(element) {
    $(Eventhandler.activeTextline).before(element);
    $(Eventhandler.activeTextline).text("");
    $(Eventhandler.activeTextline).trigger("focus");
  }

  static focusNext(nextElement) {
    if (!nextElement.is(".textline")) return;
    nextElement.trigger("focus");
    General.moveCursorToEnd(null);
  }

  static focusPrev(prevElement) {
    if (!prevElement.is(".textline")) return;
    prevElement.trigger("focus");
    General.moveCursorToEnd(null);
  }

  static focusLast() {
    let textline = $(".textline:last");
    textline.trigger("focus");
    General.moveCursorToEnd(null);
  }

  static delete(textline) {
    textline.remove();
    Textline_DB.delete(true, [], [textline.data("uuid")]);
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

    var textline = $(event.target);
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
        var selectedTextLength = General.getSelectedTextLength();

        if (
          General.getCursorPosition(textline) == 0 &&
          selectedTextLength == 0
        ) {
          var prevElementTextLength = prevElement.text().length;
          if (textline.text().length > 0 && selectedTextLength == 0) {
            prevElement.text(prevElement.text() + textline.text());
          }

          Textline.delete(textline);

          if (prevElement.is(".textline")) {
            General.moveCursorTo(prevElement, prevElementTextLength);
          }
          event.preventDefault();
        }
        break;
      case "Enter":
        if (Blockmenu.isOpen()) {
          Page.addElement();
          Blockmenu.closeAll();
          event.preventDefault();
          return;
        }
        var newTextline = Textline.create(null);
        Textline.registerEvents();
        textline.after(newTextline);
        Textline.focusNext($(newTextline));
        event.preventDefault();
        break;
      case "/":
        Blockmenu.open();
        break;
      default:
        textline.data("previousValue", textline.text());
        break;
    }

    // OPT Optimize blockmenu opening (e.g. also on backspace)
    let regex = /^[\w\s]+$/;
    if (event.key.match(regex) || event.key == "Escape") {
      Blockmenu.closeAll();
    }
  }
}

module.exports = Textline;
