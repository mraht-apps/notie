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
    Textline.focusLast();
  }
}

module.exports = Placeholder;
