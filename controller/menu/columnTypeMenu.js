class ColumnTypeMenu {
  static create(columnTypeId) {
    let table = document.querySelector("#columnTypeMenu table");
    document.querySelector(table).querySelector("tbody tr").remove();

    Object.keys(Enums.ColumnTypes).forEach(function (key) {
      let element = Enums.ColumnTypes[key];
      if (element == Enums.ColumnTypes.ADD || element.id == columnTypeId) return;

      let tr = document.createElement("tr");
      document.querySelector(tr).dataset.type = element.id;
      document.querySelector(tr).addEventListener("click", (event) => Eventhandler.onClickColumnType(event));
      let td = document.createElement("td");
      td.className = "columnTypeOption";
      let div = document.createElement("div");
      let img = document.createElement("img");
      img.src = element.img;
      img.draggable = false;
      div.append(img);
      let text = document.createTextNode(element.descr);
      div.append(text);
      td.append(div);
      tr.append(td);
      document.querySelector(table).querySelector("tbody").append(tr);
    });
  }

  static isOpen() {
    return document.querySelector("#columnTypeMenu").style.display != "none";
  }

  static close(element) {
    if (!ColumnTypeMenu.isOpen() || ColumnTypeMenu.clickedOnMenu(element)) return;
    document.querySelector("#columnTypeMenu").toggle(false);
  }

  static open(columnType) {
    ColumnTypeMenu.create(columnType);
    document.querySelector("#columnTypeMenu").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.id == "columnTypeValue" ||
        element.id == "columnTypeMenu" ||
        General.getParents(element, "#columnTypeMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickColumnType(event) {
    let columnType = General.getParents(event.target, "tr")[0].dataset.type;
    ColumnMenu.setColumnType(columnType);
    ColumnTypeMenu.close();
  }
}

module.exports = ColumnTypeMenu;
