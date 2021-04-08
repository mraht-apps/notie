const placeholderText = "Type '/' for commands";

class Textline {
  textarea;

  constructor(parent, text) {
    this.textarea = document.createElement("textarea");

    this.parent = parent;
    this.textarea.textContent = text;
    this.textarea.className = "line";
    this.textarea.rows = "1";
  }

  build() {
    this.addEventListeners();
    this.parent.append(this.textarea);
  }

  addEventListeners() {
    $(this.textarea).on("focus", function (event) {
      let textarea = $(event.target);
      if (textarea.val()) return;

      textarea.prop("placeholder", placeholderText);
    });

    $(this.textarea).on("focusout", function (event) {
      let textarea = $(event.target);
      if (textarea.val()) return;

      textarea.prop("placeholder", "");
    });

    $(this.textarea).on("keypress", function (event) {
      let textarea = $(event.target);
      switch (event.key) {
        case "/":
          break;
        case "Enter":
          let newTextline = new Textline(textarea.parent(), "");
          newTextline.addEventListeners();
          textarea.after(newTextline.textarea);
          Textline.focusNext($(newTextline.textarea));
          event.preventDefault();
          break;
        default:
          // textline.height("28px");
          // textline.height(textline.prop("scrollHeight") + "px");
          console.log(textarea.prop("scrollHeight"));
          break;
      }
    });

    $(this.textarea).on("keydown", function (event) {
      let textarea = $(event.target);
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
          event.preventDefault();
          break;
        default:
          textarea.data("previousValue", textarea.val());
          break;
      }
    });

    $(this.textarea).on("keyup", function (event) {
      let textarea = $(event.target);
      switch (event.key) {
        case "ArrowUp":
          var prevElement = textarea.prev();
          Textline.focusPrev(prevElement);
          event.preventDefault();
          break;
        case "ArrowDown":
          var nextElement = textarea.next();
          Textline.focusNext(nextElement);
          event.preventDefault();
          break;
        case "Backspace":
          var prevElement = textarea.prev();
          var previousValue = textarea.data("previousValue");
          if (
            !previousValue &&
            prevElement.is("textarea") &&
            prevElement.val().trim()
          ) {
            textarea.remove();
            Textline.focusPrev(prevElement);
          }
          break;
      }
    });
  }

  static focusNext(nextElement) {
    if (!nextElement.is("textarea")) return;
    nextElement.trigger("focus");
  }

  static focusPrev(prevElement) {
    if (!prevElement.is("textarea")) return;
    prevElement.trigger("focus");
  }
}

module.exports = Textline;
