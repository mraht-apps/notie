class NumberFormatMenu {
  static create(numberFormatId) {
    let table = document.querySelector("#numberFormatMenu table");
    document.querySelector(table).querySelector("tbody tr").remove();

    Object.keys(Enums.NumberFormats).forEach(function (key) {
      let element = Enums.NumberFormats[key];
      if (element.id == numberFormatId) return;

      let tr = document.createElement("tr");
      document.querySelector(tr).dataset.format = element.id;
      document.querySelector(tr).addEventListener("click", (event) => Eventhandler.onClickNumberFormat(event));
      let td = document.createElement("td");
      td.className = "numberFormatOption";
      let text = document.createTextNode(element.descr);
      td.append(text);
      tr.append(td);
      document.querySelector(table).querySelector("tbody").append(tr);
    });
  }

  static isOpen() {
    return document.querySelector("#numberFormatMenu").style.display != "none";
  }

  static close(element) {
    if (!NumberFormatMenu.isOpen() || NumberFormatMenu.clickedOnMenu(element)) return;
    document.querySelector("#numberFormatMenu").toggle(false);
  }

  static open(numberFormat) {
    NumberFormatMenu.create(numberFormat);
    document.querySelector("#numberFormatMenu").toggle(true);
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
