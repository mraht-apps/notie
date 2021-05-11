// OPT Build blockmenu dynamically
class BlockMenu {
  static init() {
    BlockMenu.create();
    BlockMenu.registerEvents();
  }

  static registerEvents() {
    $("#blockMenu").on("mouseout", (event) => Eventhandler.onMouseout(event));
    $(".clickable").on("click", (event) => Eventhandler.onClickMenuItem(event));
    $(".clickable").on("mouseover", (event) => Eventhandler.onMouseoverMenuItem(event));
  }

  static create() {
    let tbody = $("#blockMenu table tbody");
    for (let key of Object.keys(Enums.ElementTypes)) {
      let element = Enums.ElementTypes[key];
      if (element == Enums.ElementTypes.NONE) continue;
      let tr = document.createElement("tr");
      tr.className = "clickable";
      $(tr).data("type", element.name);
      let td = document.createElement("td");
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.src = element.img;
      div.append(img);
      td.append(div);
      tr.append(td);
      td = document.createElement("td");
      div = document.createElement("div");
      let textNode = document.createTextNode(element.label);
      div.append(textNode);
      td.append(div);
      div = document.createElement("div");
      div.class = "description";
      textNode = document.createTextNode(element.descr);
      div.append(textNode);
      td.append(div);
      tr.append(td);
      tbody.append(tr);
    }
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
    if (element && (element.attr("id") == "blockMenu" || element.parents("#blockMenu").length > 0)) {
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
