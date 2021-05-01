class Document {
  static init() {
    Document.registerEvents();
  }

  static registerEvents() {
    $(document).on("click", function (event) {
      Eventhandler.onClick(event);
    });

    $(document).on("keypress", function (event) {
      Eventhandler.onKeypress(event);
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
  // OPT Move relevant source code to blockmenu.js
  static onClick(event) {
    let element = $(event.target);
    if (
      !element.hasClass("blockmenu") &&
      element.parents("#blockmenu").length == 0
    ) {
      Blockmenu.closeAll();
    }

    if (element.parents(".tableMenuContainer").length == 0) {
      Tablemenu.closeAll();
    }
  }

  static onKeypress(event) {
    // switch (event.key) {
    //   case "Enter":
    //     Blockmenu.addElement();
    //     break;
    // }
  }

  static onKeyup(event) {
    if (!Blockmenu.isOpen()) return;

    if ($(".active").length == 0) {
      $(".clickable").eq(0).addClass("active");
    } else {
      let currentActiveRow = $(".active").eq(0);
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
