class NumberFormatMenu {
  static create(numberFormatId) {
    let table = $("#numberFormatMenu table");
    $(table).find("tbody tr").remove();

    Object.keys(Enums.NumberFormats).forEach(function (key) {
      let element = Enums.NumberFormats[key];
      if (element.id == numberFormatId) return;

      let tr = document.createElement("tr");
      $(tr).data("format", element.id);
      $(tr).on("click", (event) => Eventhandler.onClickNumberFormat(event));
      let td = document.createElement("td");
      td.className = "numberFormatOption";
      let text = document.createTextNode(element.descr);
      td.append(text);
      tr.append(td);
      $(table).find("tbody").append(tr);
    });
  }

  static isOpen() {
    return $("#numberFormatMenu").is(":visible");
  }

  static close(element) {
    if (!NumberFormatMenu.isOpen() || NumberFormatMenu.clickedOnMenu(element)) return;
    $("#numberFormatMenu").toggle(false);
  }

  static open(numberFormat) {
    NumberFormatMenu.create(numberFormat);
    $("#numberFormatMenu").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "numberFormatValue" ||
        element.parents("#numberFormatValue").length > 0 ||
        element.attr("id") == "numberFormatMenu" ||
        element.parents("#numberFormatMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickNumberFormat(event) {
    let numberFormatId = $(event.target).parents("tr").eq(0).data("format");
    ColumnMenu.setNumberFormat(numberFormatId);
    NumberFormatMenu.close();
  }
}

module.exports = NumberFormatMenu;
