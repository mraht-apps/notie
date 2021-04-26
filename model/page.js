const Database = require("better-sqlite3");
const { Table } = require("./table");

class Page {
  static DEFAULT_NAME = "Untitled";

  static firstRun() {
    $("#pageName").attr("placeholder", Page.DEFAULT_NAME);
    Page.load();
    TextlineJS.Textline.build($("#content"), "");
    PlaceholderJS.Placeholder.registerEvents($("#placeholder"));
  }

  static create(page) {
    if (!page) {
      page = { id: "", name: "" };
    }

    Page.addToDatabase(page);
    PageMenuJS.PageMenu.add(page);
    Page.load(
      $(".pageMenuItem").filter(function () {
        return $(this).data("uuid") == page.id;
      })
    );
  }

  static addToDatabase(page) {
    if (!page.id || page.id.length == 0) {
      page.id = CryptoJS.generateUUID();
    }
    if (!page.name || page.name.length == 0) {
      page.name = Page.DEFAULT_NAME;
    }

    DatabaseJS.run([
      `REPLACE INTO pages VALUES ('${page.id}', '${page.name}');`,
    ]);
  }

  static load(pageMenuItem) {
    Page.saveCurrentContent();

    $("#content").html("");
    $("#pageName").val("");
    $("#content").removeData("uuid");

    if (!pageMenuItem) return;

    let pageCssId = pageMenuItem.attr("id");
    switch (pageCssId) {
      case "newPage":
        Page.create();
        break;
      case "settingsPage":
        let pageUrl = pageMenuItem.data("url");
        var page = FileJS.readFile(pageUrl);
        $("#content").html(page);
        $("#pageName").val("Settings");
        SettingsJS.registerEvents();
        break;
      default:
        Page.loadPageContent($(pageMenuItem).data("uuid"));
        break;
    }
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
    let children = $("#content").children();
    if (children.length == 0) return;

    let sql = "INSERT INTO pages_structure VALUES";
    children.each(function (index, element) {
      element = $(element);
      let elementTypeId;
      if (element.is(".table")) {
        elementTypeId = EnumsJS.ElementTypes.table;
        Page.saveTable(element);
      } else if (element.is(".textline")) {
        elementTypeId = EnumsJS.ElementTypes.textline;
        Page.saveTextline(element);
      }
      let elementId = element.data("uuid");
      sql += `('${pageId}', '${elementId}', '${elementTypeId}', '${index}')`;
      if (index < children.length - 1) {
        sql += ", ";
      }
    });
    sql += ";";
    DatabaseJS.run([
      `DELETE FROM pages_structure WHERE page_id = '${pageId}';`,
      sql,
    ]);
  }

  static saveTable(table) {
    let tableId = table.data("uuid");
    let tableName = table
      .find("caption > .captionContainer > .tableTitleContainer > input")
      .text();

    let sqlStatements = [
      `REPLACE INTO tables VALUES ('${tableId}', '${tableName}');`,
    ];
    let sqlTableStructure = "";
    let sqlColumns = "";

    let columns = table.find("thead > tr > th").filter(function () {
      return $(this).data("type") != "add";
    });
    columns.each(function (index, column) {
      column = $(column);

      let columnId = column.data("uuid");
      let columnType = column.data("type");
      let columnName = column.find(".columnTitle > input").val();
      let sqlColumnName, sqlColumnType;

      switch (columnType) {
        case "add":
          return;
        case "checkbox":
        case "text":
          sqlColumnName = `${columnName}_${columnId}`;
          sqlColumnType = "TEXT";
          break;
        default:
          return;
      }
      sqlTableStructure += `('${tableId}', '${columnId}', '${columnName}', '${columnType}')`;

      sqlColumns += `${sqlColumnName} ${sqlColumnType}`;
      if (index < columns.length - 1) {
        sqlTableStructure += ", ";
        sqlColumns += ", ";
      }
    });
    sqlStatements.push(
      `REPLACE INTO tables_structure VALUES ${sqlTableStructure};`,
      `DROP TABLE IF EXISTS '${tableId}';`,
      `CREATE TABLE IF NOT EXISTS '${tableId}' ` +
        `(id TEXT NOT NULL, ${sqlColumns}, PRIMARY KEY (id) );`
    );

    let sqlValues = "";
    let rows = table.find("tbody > tr").filter(function () {
      return $(this).data("uuid");
    });
    rows.each(function (rowIndex, row) {
      row = $(row);
      sqlValues += `('${row.data("uuid")}', `;
      columns.each(function (columnIndex, column) {
        column = $(column);

        let input = row.find("td").eq(columnIndex).find("input");
        switch (column.data("type")) {
          case "checkbox":
            sqlValues += `'${input.is(":checked")}'`;
            break;
          case "text":
            sqlValues += `'${input.val()}'`;
            break;
        }
        if (columnIndex < columns.length - 1) {
          sqlValues += ", ";
        }
      });
      sqlValues += ")";
      if (rowIndex < rows.length - 1) {
        sqlValues += ", ";
      }
    });
    sqlStatements.push(`INSERT INTO '${tableId}' VALUES ${sqlValues};`);

    DatabaseJS.run(sqlStatements);
  }

  static saveTextline(textline) {
    DatabaseJS.run([
      `REPLACE INTO textlines VALUES(` +
        `'${textline.data("uuid")}', '${textline.text()}');`,
    ]);
  }

  static loadPageContent(pageId) {
    let page = DatabaseJS.get(`SELECT * FROM pages WHERE id = '${pageId}';`);
    let elements = DatabaseJS.all(
      `SELECT * FROM pages_structure WHERE page_id = '${pageId}' ORDER BY position ASC;`
    );

    if (!elements || elements.length == 0) {
      TextlineJS.Textline.build($("#content"), "");
    } else {
      let textlines = DatabaseJS.all(
        `SELECT txt.* FROM pages_structure AS ps ` +
          `INNER JOIN textlines AS txt ON txt.id = ps.element_id ` +
          `WHERE ps.page_id = '${pageId}';`
      );

      $(elements).each(function (index, element) {
        console.log(element);
        switch (element.element_type_id) {
          case EnumsJS.ElementTypes.table:
            let tableId = element.element_id;
            let sqlTable = DatabaseJS.get(
              `SELECT * FROM tables WHERE id = '${tableId}'`
            );
            let sqlValues = DatabaseJS.all(`SELECT * FROM '${tableId}';`);
            let sqlColumns = DatabaseJS.all(
              `SELECT * FROM tables_structure WHERE table_id = '${tableId}';`
            );

            // NEW Implement
            let data = { caption: sqlTable.name, columns: [], rows: [] };
            TableJS.Table.build($("#content"), data);
            break;
          case EnumsJS.ElementTypes.textline:
            let sqlTextline = $(textlines).filter(function () {
              return this.id == element.element_id;
            });
            if (!sqlTextline || sqlTextline.length == 0) return;
            TextlineJS.Textline.build($("#content"), sqlTextline[0].text);
            break;
        }
      });
    }

    $("#content").data("uuid", page.id);
    $("#pageName").val(page.name);
  }
}

module.exports = { Page };
