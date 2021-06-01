class Document {
  static init() {
    Document.registerEvents();
  }

  static registerEvents() {
    document.oncontextmenu = (event) => Eventhandler.onClick(event);
    document.onclick = (event) => Eventhandler.onClick(event);
    document.onkeyup = (event) => Eventhandler.onKeyup(event);
    document.onmousemove = (event) => Eventhandler.onMousemove(event);
    document.onmouseup = (event) => Eventhandler.onMouseup(event);
    document.onpaste = (event) => Eventhandler.onPaste(event);
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
    let textline = event.target || event.target.closest(".textline");
    textline.append(image);
    textline.contentEditable = "false";
    textline.classList.remove("textline");
    textline.classList.add("image");
    event.preventDefault();
  }

  static onClick(event) {
    let element = event.target;
    BlockMenu.close(element);
    TableMenu.close(element);
    NavbarMenu.close(element);
    ColumnMenu.close(element);
    ColumnTypeMenu.close(element);
    NumberFormatMenu.close(element);
    TableSearchMenu.close(element);
  }

  //
  static onKeyup(event) {
    if (!BlockMenu.isOpen() || Page.isDisabled()) return;

    if (General.findAll(document, ".clickable.active").length == 0) {
      document.querySelector(".clickable").classList.add("active");
    } else {
      let currentActiveRow = document.querySelector(".clickable.active");
      let newActiveRow;
      switch (event.key) {
        case "ArrowDown":
          newActiveRow = currentActiveRow.nextSibling;
          break;
        case "ArrowUp":
          newActiveRow = currentActiveRow.previousElementSibling;
          break;
      }

      if (newActiveRow && newActiveRow.classList.contains("clickable")) {
        newActiveRow.classList.add("active");
        currentActiveRow.classList.remove("active");
      }
    }
  }

  static onMousemove(event) {
    Table.dispatchEvent("onMousemove", event);
  }

  static onMouseup(event) {
    Table.dispatchEvent("onMouseup", event);
  }
}

module.exports = Document;
