class ColumnTypeMenu {
  static create(columnType) {
    let table = $("#columnTypeMenu table");
    $(table).find("tbody tr").remove();

    Object.keys(Enums.ColumnTypes).forEach(function (key) {
      let element = Enums.ColumnTypes[key];
      if (element.id == Enums.ColumnTypes.ADD.id || element.id == columnType)
        return;

      let tr = document.createElement("tr");
      tr.id = element.cssId;
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
      $(table).find("tbody").append(tr);
    });
  }

  static isOpen() {
    return $("#columnTypeMenu").is(":visible");
  }

  static close(element) {
    if (!ColumnTypeMenu.isOpen() || ColumnTypeMenu.clickedOnMenu(element))
      return;
    $("#columnTypeMenu").toggle(false);
  }

  static open(element, columnType) {
    ColumnTypeMenu.close(element);
    ColumnTypeMenu.create(columnType);
    $("#columnTypeMenu").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "columnTypeValue" ||
        element.attr("id") == "columnTypeMenu" ||
        element.parents("#columnTypeMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {}

module.exports = ColumnTypeMenu;
