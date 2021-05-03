class Page {
  static DEFAULT_NAME = "Untitled";

  static init() {
    let startpage;
    let pageId = Settings.DATA.STARTPAGE;
    if (pageId && pageId.length > 0) {
      startpage = Page_DB.getById(pageId);
    }

    if (startpage && startpage.id && startpage.id.length > 0) {
      Page.load({ id: startpage.id });
    } else {
      Page.create();
    }

    Placeholder.init();
  }

  static create() {
    let page = { id: "", name: "" };

    Page.addToDatabase(page);
    Navbar.add(page);
    Page.load(page);
  }

  static addToDatabase(page) {
    if (!page.id || page.id.length == 0) {
      page.id = Crypto.generateUUID();
    }
    if (!page.name || page.name.length == 0) {
      page.name = Page.DEFAULT_NAME;
    }

    Page_DB.add(true, [], page);
  }

  static load(page) {
    Page.saveCurrentContent();

    $("#content").html("");
    $("#pageName").val("");
    $("#content").removeData("uuid");

    if (!page) return;

    let pageCssId = page.css_id;
    switch (pageCssId) {
      case "newPage":
        Page.create();
        break;
      case "settingsPage":
        let pageUrl = page.url;
        var page = File.readFile(Path.join(__dirname, pageUrl));
        $("#content").html(page);
        $("#pageName").val("Settings");
        Settings.registerEvents();
        break;
      default:
        Page.loadPageContent(page.id);
        break;
    }
  }

  static loadPageContent(pageId) {
    let page = Page_DB.getById(pageId);
    let elements = Page_DB.getElements(pageId);

    if (!elements || elements.length == 0) {
      Textline.create($("#content"), null);
    } else {
      let textlines = Page_DB.getTextlines(pageId);
      let tables = Page_DB.getTables(pageId);
      let tableColumns = Table_DB.getColumns(tables);
      $(elements).each(function (index, element) {
        console.log(element);
        switch (element.type_id) {
          case Enums.ElementTypes.table:
            let table = $(tables)
              .filter(function () {
                return this.id == element.id;
              })
              .get(0);

            let columns = $(tableColumns).filter(function () {
              return this.table_id == element.id;
            });

            let values = Table_DB.getValues(table.id);
            let rows = [];
            $(values).each(function () {
              let sqlValue = this;
              let row = {};
              $(columns).each(function () {
                let column = this;
                let cellValue = sqlValue[column.id];
                if (column.type == "checkbox") {
                  cellValue = cellValue == "true";
                }
                row[column.name] = cellValue;
              });
              rows.push(row);
            });

            let tableData = {
              id: table.id,
              caption: table.name,
              columns: columns,
              rows: rows,
            };
            Table.create($("#content"), tableData);
            break;
          case Enums.ElementTypes.textline:
            let sqlTextline = $(textlines).filter(function () {
              return this.id == element.id;
            })[0];
            if (!sqlTextline) return;
            Textline.create($("#content"), sqlTextline);
            break;
        }
      });
    }

    $("#content").data("uuid", page.id);
    $("#pageName").val(page.name);
  }

  static saveCurrentContent() {
    let pageId = $("#content").data("uuid");
    if (!pageId || pageId.length == 0) return;

    Page.savePageName(pageId);
    Page.savePageContent(pageId);
  }

  static savePageName(pageId) {
    let pageName = $("#pageName").val();
    Page.addToDatabase({ id: pageId, name: pageName });
  }

  static savePageContent(pageId) {
    let htmlChildren = $("#content").children();
    if (htmlChildren.length == 0) return;

    let sql = "";
    htmlChildren.each(function (index, htmlChild) {
      htmlChild = $(htmlChild);
      let elementTypeId;
      if (htmlChild.is(".table")) {
        elementTypeId = Enums.ElementTypes.table;
        Page.saveTable(htmlChild);
      } else if (htmlChild.is(".textline")) {
        elementTypeId = Enums.ElementTypes.textline;
        Page.saveTextline(htmlChild);
      }
      let element = { id: htmlChild.data("uuid"), typeId: elementTypeId };
      sql = Page_DB.buildUpdateElement(
        sql,
        htmlChildren.length,
        index,
        pageId,
        element
      );
    });
    Page_DB.updateElement([sql]);
  }

  static saveTable(table) {
    let tableId = table.data("uuid");
    let tableName = table
      .find("caption > .captionContainer > .tableTitleContainer > input")
      .val();

    let sqlStatements = [];
    Table_DB.update(false, sqlStatements, {
      id: tableId,
      name: tableName,
    });

    let htmlColumns = table.find("thead > tr > th").filter(function () {
      return $(this).data("type") != "add";
    });
    Table_DB.updateColumns(false, sqlStatements, tableId, htmlColumns);

    let htmlRows = table.find("tbody > tr").filter(function () {
      return $(this).data("uuid");
    });
    Table_DB.updateValues(true, sqlStatements, tableId, htmlColumns, htmlRows);
  }

  static saveTextline(textline) {
    Textline_DB.update(true, [], {
      id: textline.data("uuid"),
      text: textline.text(),
    });
  }

  static delete(id) {
    Page_DB.delete(id);
  }
}

module.exports = Page;
