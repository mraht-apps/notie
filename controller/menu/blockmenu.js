class BlockMenu {
  static init() {
    BlockMenu.registerEvents();
  }

  static registerEvents() {
    $("#blockMenu").on("mouseout", function (event) {
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
    return $("#blockMenu").is(":visible");
  }

  static open() {
    BlockMenu.close();
    let { x, y } = General.getCursorPixelPosition();
    $("#blockMenu").css({ top: y - 100 + "px", left: x + 10 + "px" });
    $("#blockMenu").toggle(true);
    $(".clickable").eq(0).addClass("active");
  }

  static close(element) {
    if (!BlockMenu.isOpen() || BlockMenu.clickedOnMenu(element)) return;
    $(".clickable").removeClass("active");
    $("#blockMenu").toggle(false);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "blockMenu" ||
        element.parents("#blockMenu").length > 0)
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
    BlockMenu.close();
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

module.exports = BlockMenu;
