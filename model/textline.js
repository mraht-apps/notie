const placeholderText = "Type '/' for commands";
const blockmenu = require("../controller/blockmenu.js");
class Textline {
  static build(parent, text) {
    let input = document.createElement("input");
    input.type = "text";
    input.value = text;

    Textline.addEventListeners(input);
    parent.append(input);
  }

  static addEventListeners(input) {
    $(input).on("focus", function (event) {
      let textarea = $(event.target);
      if (textarea.val()) return;

      textarea.prop("placeholder", placeholderText);
    });

    $(input).on("focusout", function (event) {
      let textarea = $(event.target);
      if (textarea.val()) return;

      textarea.prop("placeholder", "");
    });

    $(input).on("keypress", function (event) {
      let textarea = $(event.target);
      switch (event.key) {
        case "Enter":
          let newTextline = new Textline(textarea.parent(), "");
          newTextline.addEventListeners();
          textarea.after(newTextline.textarea);
          Textline.focusNext($(newTextline.textarea));
          event.preventDefault();
          break;
      }

      // NEW Character: Jump to entry which matches character behind '/'
      let regex = /^[\w\s]+$/;
      if (event.key.match(regex) || event.key == "Escape") {
        blockmenu.close();
        console.log(textarea.prop("scrollHeight"));
      }
    });

    $(input).on("keydown", function (event) {
      let textline = $(event.target);
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault();
          break;
        default:
          textline.data("previousValue", textline.val());
          break;
      }
    });

    $(input).on("keyup", function (event) {
      // Ignore certain character
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
          var previousValue = textline.data("previousValue");
          if (
            !previousValue &&
            prevElement.is("input:text") &&
            prevElement.val().trim()
          ) {
            textline.remove();
            Textline.focusPrev(prevElement);
          }
          break;
        case "/":
          blockmenu.openFirstTime();
          break;
      }
    });
  }

  static focusNext(nextElement) {
    if (!nextElement.is("input:text")) return;
    nextElement.trigger("focus");
  }

  static focusPrev(prevElement) {
    if (!prevElement.is("input:text")) return;
    prevElement.trigger("focus");
  }
}

module.exports = Textline;
