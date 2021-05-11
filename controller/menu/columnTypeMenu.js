class ColumnTypeMenu {
  static create(columnTypeId) {
    let table = $("#columnTypeMenu table");
    $(table).find("tbody tr").remove();

    Object.keys(Enums.ColumnTypes).forEach(function (key) {
      let element = Enums.ColumnTypes[key];
      if (element == Enums.ColumnTypes.ADD || element.id == columnTypeId) return;

      let tr = document.createElement("tr");
      $(tr).data("type", element.id);
      $(tr).on("click", (event) => Eventhandler.onClickColumnType(event));
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
    if (!ColumnTypeMenu.isOpen() || ColumnTypeMenu.clickedOnMenu(element)) return;
    $("#columnTypeMenu").toggle(false);
  }

  static open(columnType) {
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

class Eventhandler {
  static onClickColumnType(event) {
    let columnType = $(event.target).parents("tr").eq(0).data("type");
    ColumnMenu.setColumnType(columnType);
    ColumnTypeMenu.close();
  }
}

module.exports = ColumnTypeMenu;
