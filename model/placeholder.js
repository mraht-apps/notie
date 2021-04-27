class Placeholder {
  static registerEvents(div) {
    $(div).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }
}

class Eventhandler {
  static onClick(event) {
    let textline = $(".textline:last");
    textline.trigger("focus");
    General.moveCursorToEnd(null);
  }
}

module.exports = Placeholder;
