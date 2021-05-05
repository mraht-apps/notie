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

  static isOpen() {
    return $("#blockmenu").is(":visible");
  }

  static open() {
    Blockmenu.close();
    let { x, y } = General.getCursorPixelPosition();
    $("#blockmenu").css({ top: y - 100 + "px", left: x + 10 + "px" });
    $("#blockmenu").toggle(true);
    $(".clickable").eq(0).addClass("active");
  }

  static close(element) {
    if (!Blockmenu.isOpen() || Blockmenu.clickedOnMenu(element)) return;
    $(".clickable").removeClass("active");
    $("#blockmenu").toggle(false);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "blockmenu" ||
        element.parents("#blockmenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    let row = $(".clickable.active").eq(0);
    let elementType = row.data("type");
    Page.addElement(elementType);
    Blockmenu.close();
  }

  static onMouseout(event) {
    $(".clickable.active").removeClass("active");
  }

  static onMouseoverMenuItem(event) {
    $(".clickable.active").removeClass("active");
    let row = $(event.target);
    if (!$(event.target).is("tr")) {
      row = $(event.target).parents().filter(".clickable").eq(0);
    }
    row.addClass("active");
  }
}

module.exports = Blockmenu;
