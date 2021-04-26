// OPT Encapsulate loading and saving functions into table.js or textline.js
// OPT Show error if no or wrong password has been supplied
class Data {
  static load() {
    let jsonData = Data.readData();
    Data.loadPageName(jsonData);
    Data.loadPageContent(jsonData);
  }

  static readData() {
    if (FileJS.exists("data.enc")) {
      let data = FileJS.readFile("data.enc");
      let ivEnd = CryptoJS.IV_LENGTH * 2;
      CryptoJS.IV = CryptoJS.parseIV(data.slice(0, ivEnd));

      data = data.slice(ivEnd, data.length);
      let decryptedData = CryptoJS.decrypt(
        data,
        CryptoJS.PASSWORD,
        CryptoJS.IV
      );

      let jsonData = JSON.parse(decryptedData);
      console.log(jsonData);
      return jsonData;
    }
  }

  static loadPageName(jsonData) {
    console.log("Set pagename to " + jsonData.name);
    $("#pageName").text(jsonData.name);
  }

  static loadPageContent(jsonData) {
    Data.resetPageContent();

    let parent = $("#content");
    $(jsonData.content).each(function (index, element) {
      switch (element.type) {
        case "table":
          Data.loadTable(parent, element);
          break;
        case "textline":
          Data.loadTextline(parent, element);
          break;
      }
    });
  }

  static resetPageContent() {
    $("#content").empty();
  }

  static loadTextline(parent, element) {
    TextlineJS.Textline.build(parent, element.text);
  }

  static loadTable(parent, data) {
    TableJS.Table.build(parent, data);
  }

  static save() {
    let pageName = Data.savePageName();
    let pageContent = Data.savePageContent();

    let page = {
      name: pageName,
      content: pageContent,
    };

    return JSON.stringify(page);
  }

  static savePageName() {
    return $("#pageName").text();
  }

  static savePageContent() {
    let pageContent = [];
    let children = $("#content").children();
    let textline, table;

    children.each(function () {
      let element = $(this);
      if (element.is(".textline")) {
        textline = saveTextline(element);
        pageContent.push(textline);
      } else if (element.is(".table")) {
        table = saveTable(element);
        pageContent.push(table);
      }
    });

    return pageContent;
  }

  static saveTextline(element) {
    console.log(element);
    let textline = { type: "textline", text: element.val() };
    console.log(textline);
    return textline;
  }

  static saveTable(element) {
    console.log(element);

    let caption = $(element)
      .find("caption > .captionContainer > .tableTitleContainer > input")
      .val();

    let columns = element.find(".tableHead > th");
    let columnsContent = [];

    for (var i = 0; i < columns.length - 1; i++) {
      let column = columns.eq(i);
      let columnContent = {
        name: column.find(".columnTitle > input").val(),
        type: column.data("type"),
        width: column.css("width"),
      };
      columnsContent.push(columnContent);
    }

    let rows = element.find(".tableBody > tr");
    let rowsContent = [];

    for (var i = 0; i < rows.length - 1; i++) {
      let row = rows.eq(i);
      let cells = $(row).find("td");

      let cellsContent = {};
      for (var j = 0; j < columns.length - 1; j++) {
        let columnName = $(columns[j]).find(".columnTitle > input").val();
        let element = cells.eq(j).find("input");
        let text = element.val();
        if (element.is(":checkbox")) {
          text = element.is(":checked");
        }
        $(cellsContent).attr(columnName, text);
      }
      rowsContent.push(cellsContent);
    }

    let table = {
      type: "table",
      caption: caption,
      columns: columnsContent,
      rows: rowsContent,
    };

    console.log(table);
    return table;
  }
}

module.exports = Data;
