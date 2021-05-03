class Blockmenu {
  static init() {
    Blockmenu.registerEvents();
  }

  static registerEvents() {
    $("#blockmenu").on("mouseout", function (event) {
      Eventhandler.onMouseout(event);
    });

    $(".clickable").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });

    $(".clickable").on("mouseover", function (event) {
      Eventhandler.onMouseoverMenuItem(event);
    });
  }

  static open() {
    let isOpen = Blockmenu.isOpen();
    Blockmenu.closeAll();

    if (!isOpen) {
      let { x, y } = General.getCursorPixelPosition();
      $("#blockmenu").css({ top: y - 100 + "px", left: x + 10 + "px" });
      $("#blockmenu").addClass("visible");
      $("#blockmenu").toggle(true);
      $(".clickable").eq(0).addClass("active");
    }
  }

  static addElement() {
    let row = $(".active").eq(0);
    let elementType = row.data("type");

    switch (elementType) {
      case "table":
        let htmlTable = Table.create(null, null);
        Textline.appendBefore(htmlTable);
        break;
    }
  }

  static isOpen() {
    return $("#blockmenu").hasClass("visible");
  }

  static closeAll() {
    $(".clickable").removeClass("active");
    $("#blockmenu").removeClass("visible");
    $("#blockmenu").toggle(false);
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    Blockmenu.addElement();
    Blockmenu.closeAll();
  }

  static onMouseout(event) {
    $(".active").removeClass("active");
  }

  static onMouseoverMenuItem(event) {
    $(".active").removeClass("active");
    let row = $(event.target);
    if (!$(event.target).is("tr")) {
      row = $(event.target).parents().filter(".clickable").eq(0);
    }
    row.addClass("active");
  }
}

module.exports = Blockmenu;
