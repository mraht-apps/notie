class Document {
  static init() {
    Document.registerEvents();
  }

  static registerEvents() {
    $(document).on("contextmenu", (event) => Eventhandler.onClick(event));
    $(document).on("click", (event) => Eventhandler.onClick(event));
    $(document).on("keyup", (event) => Eventhandler.onKeyup(event));
    $(document).on("mousemove", (event) => Eventhandler.onMousemove(event));
    $(document).on("mouseup", (event) => Eventhandler.onMouseup(event));
    $(document).on("paste", (event) => Eventhandler.onPaste(event));
  }
}

class Eventhandler {
  static onPaste(event) {
    var items = (event.clipboardData || event.originalEvent.clipboardData).items;
    console.log(JSON.stringify(items));
    if (items.length == 0) return;
    for (index in items) {
      var item = items[index];
      if (item.kind === "file") {
        var blob = item.getAsFile();
        var reader = new FileReader();
        reader.onload = function (event) {
          console.log(event.target.result);
        }; // data url!
        reader.readAsDataURL(blob);
      }
    }
  }

  static onClick(event) {
    let element = $(event.target);
    BlockMenu.close(element);
    TableMenu.close(element);
    NavbarMenu.close(element);
    ColumnMenu.close(element);
    ColumnTypeMenu.close(element);
    NumberFormatMenu.close(element);
    TableSearchMenu.close(element);
  }

  static onKeyup(event) {
    if (!BlockMenu.isOpen() || Page.isDisabled()) return;

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
