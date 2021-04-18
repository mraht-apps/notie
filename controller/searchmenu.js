const DB = require("./db");

class SearchMenu {
  static registerEvents() {
    let input = $(".searchMenu").children("input:text");
    input.on("input", function (event) {
      let input = $(event.target);
      let result = DB.searchTables(input.val());

      let tbody = $(".searchMenu").children("table").children("tbody");
      tbody.children().remove();

      if(result.length == 0) return;      
      $(result).each(function() {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.textContent = this.name;
        tr.append(td);
        tbody.append(tr);
      });
    });
  }
}

module.exports = SearchMenu;
