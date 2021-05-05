const Page = require("../model/page");
const Pagemenu = require("./menu/pagemenu");

class Document {
  static init() {
    Document.registerEvents();
  }

  static registerEvents() {
    $(document).on("click", function (event) {
      Eventhandler.onClick(event);
    });

    $(document).on("keyup", function (event) {
      Eventhandler.onKeyup(event);
    });

    $(document).on("mousemove", function (event) {
      Eventhandler.onMousemove(event);
    });

    $(document).on("mouseup", function (event) {
      Eventhandler.onMouseup(event);
    });
  }
}

class Eventhandler {
  static onClick(event) {
    let element = $(event.target);
    Blockmenu.closeAll(element);
    Tablemenu.closeAll(element);
    Pagemenu.closeAll(element);
  }

  static onKeyup(event) {
    if (!Blockmenu.isOpen() || Page.isDisabled()) return;

    if ($(".clickable.active").length == 0) {
      $(".clickable").eq(0).addClass("active");
    } else {
      let currentActiveRow = $(".clickable.active").eq(0);
      let newActiveRow;
      switch (event.key) {
        case "ArrowDown":
          newActiveRow = currentActiveRow.next();
          break;
        case "ArrowUp":
          newActiveRow = currentActiveRow.prev();
          break;
      }

      if (newActiveRow && newActiveRow.hasClass("clickable")) {
        newActiveRow.addClass("active");
        currentActiveRow.removeClass("active");
      }
    }
  }

  static onMousemove(event) {
    Table.trigger("onMousemove", event);
  }

  static onMouseup(event) {
    Table.trigger("onMouseup", event);
  }
}

module.exports = Document;
