// OPT Build blockmenu dynamically
class BlockMenu {
  static init() {
    BlockMenu.create();
    BlockMenu.registerEvents();
  }

  static registerEvents() {
    document.querySelector("#blockMenu").onmouseout = (event) => Eventhandler.onMouseout(event);
    General.findAll(document, ".clickable").forEach((clickable) => {
      clickable.onclick = (event) => Eventhandler.onClickMenuItem(event);
      clickable.onmouseover = (event) => Eventhandler.onMouseoverMenuItem(event);
    });
  }

  static create() {
    let tbody = document.querySelector("#blockMenu table tbody");
    for (let key of Object.keys(Enums.ElementTypes)) {
      let element = Enums.ElementTypes[key];
      if (element == Enums.ElementTypes.NONE) continue;
      let tr = document.createElement("tr");
      tr.className = "clickable";
      tr.dataset.type = element.name;
      let td = document.createElement("td");
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.src = element.img;
      div.append(img);
      td.append(div);
      tr.append(td);
      td = document.createElement("td");
      div = document.createElement("div");
      div.textContent = element.label;
      td.append(div);
      div = document.createElement("div");
      div.class = "description";
      div.textContent = element.descr;
      td.append(div);
      tr.append(td);
      tbody.append(tr);
    }
  }

  static isOpen() {
    return document.querySelector("#blockMenu").style.display != "none";
  }

  static open() {
    BlockMenu.close();
    let { x, y } = General.getCursorPixelPosition();
    document.querySelector("#blockMenu").style.top = `${y - 100}px`;
    document.querySelector("#blockMenu").style.left = `${x + 10}px`;
    General.toggle(document.querySelector("#blockMenu"), true);
    document.querySelector(".clickable").classList.add("active");
  }

  static close(element) {
    if (!BlockMenu.isOpen() || BlockMenu.clickedOnMenu(element)) return;
    document.querySelector(".clickable").classList.remove("active");
    General.toggle(document.querySelector("#blockMenu"), false);
  }

  static clickedOnMenu(element) {
    if (element && (element.id == "blockMenu" || element.parentNode)) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickMenuItem(event) {
    let row = document.querySelector(".clickable.active");
    let elementType = row.dataset.type;
    Page.addElement(elementType);
    BlockMenu.close();
  }

  static onMouseout(event) {
    document.querySelector(".clickable.active")?.classList.remove("active");
  }

  static onMouseoverMenuItem(event) {
    document.querySelector(".clickable.active")?.classList.remove("active");
    let row = event.target;
    if (event.target != typeof "tr") row = event.target.closest(".clickable");
    row.classList.add("active");
  }
}

module.exports = BlockMenu;
