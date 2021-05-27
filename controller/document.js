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
    const clipboard = electron.clipboard;
    let nativeImage = clipboard.readImage("clipboard").toPNG();
    if (!nativeImage || nativeImage.length == 0) return;
    let uuid = Crypto.generateUUID(8);
    File.writeFile(`./cache/img/${uuid}.png`, nativeImage);
    let image = document.createElement("img");
    image.src = `../cache/img/${uuid}.png`;
    let textline = $(event.target) || $(event.target).parent(".textline");
    textline.append(image);
    textline.prop("contentEditable", false);
    textline.removeClass("textline");
    textline.addClass("image");
    // document.querySelector("#test").src = `../cache/img/${uuid}.png`;
    event.preventDefault();
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

  // FIX If blockmenu is open arrows aren't selecing entries anymore #4
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
