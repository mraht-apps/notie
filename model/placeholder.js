const Textline = require("./textline");

class Placeholder {
  static init() {
    $("#placeholder").on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }
}

class Eventhandler {
  static onClick(event) {
    let lastElement = $("#content").children().last(".pageElement");
    if (!lastElement.hasClass("textline")) {
      var textline = Textline.create();
      $("#content").append(textline);
    }
    Textline.focusLast();
  }
}

module.exports = Placeholder;
