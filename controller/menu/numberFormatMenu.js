class NumberFormatMenu {
  static create(numberFormatId) {
    let table = document.querySelector("#numberFormatMenu table");
    table.querySelector("tbody tr").remove();

    Object.keys(Enums.NumberFormats).forEach(function (key) {
      let element = Enums.NumberFormats[key];
      if (element.id == numberFormatId) return;

      let tr = document.createElement("tr");
      tr.dataset.format = element.id;
      tr.addEventListener("click", (event) => Eventhandler.onClickNumberFormat(event));
      let td = document.createElement("td");
      td.className = "numberFormatOption";
      let text = document.createTextNode(element.descr);
      td.append(text);
      tr.append(td);
      table.querySelector("tbody").append(tr);
    });
  }

  static isOpen() {
    return document.querySelector("#numberFormatMenu").style.display != "none";
  }

  static close(element) {
    if (!NumberFormatMenu.isOpen() || NumberFormatMenu.clickedOnMenu(element)) return;
    General.toggle(document.querySelector("#numberFormatMenu"), false);
  }

  static open(numberFormat) {
    NumberFormatMenu.create(numberFormat);
    General.toggle(document.querySelector("#numberFormatMenu"), true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.id == "numberFormatValue" ||
        General.getParents(element, "#numberFormatValue").length > 0 ||
        element.id == "numberFormatMenu" ||
        General.getParents(element, "#numberFormatMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static onClickNumberFormat(event) {
    // FIX Number format with comma as decimal separator not chooseable #3
    let numberFormatId = General.getParents(event.target, "tr")[0].dataset.format;
    ColumnMenu.setNumberFormat(numberFormatId);
    NumberFormatMenu.close();
  }
}

module.exports = NumberFormatMenu;
