class Table_DB {
  static getColumns(tables) {
    if (!tables || tables.length == 0) return;

    let tableIds = "";
    $(tables).each(function (index, table) {
      tableIds += `'${table.id}'`;
      if (index < tables.length - 1) {
        tableIds += ", ";
      }
    });
    return Database.all(
      `SELECT * FROM table_columns WHERE table_id IN (${tableIds}) ORDER BY position ASC;`
    );
  }

  static getValues(id) {
    return Database.all(`SELECT * FROM '${id}';`);
  }

  static update(run = false, sqlStatements = [], table) {
    sqlStatements.push(
      `REPLACE INTO tables VALUES ('${table.id}', '${table.name}');`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static updateColumns(run = false, sqlStatements = [], tableId, htmlColumns) {
    let sqlTableStructure = "";
    let sqlColumns = "";

    htmlColumns.each(function (index, column) {
      column = $(column);

      let columnId = column.data("uuid");
      let columnName = column.find(".columnTitle > input").val();
      let columnType = column.data("type");
      let columnWidth = column.css("width");

      let sqlColumnName, sqlColumnType;

      switch (columnType) {
        case "add":
          return;
        case "checkbox":
        case "text":
          sqlColumnName = columnId;
          sqlColumnType = "TEXT";
          break;
        default:
          return;
      }
      sqlTableStructure += `('${tableId}', '${columnId}', '${columnName}', '${columnType}', '${columnWidth}', ${index})`;

      sqlColumns += `'${sqlColumnName}' ${sqlColumnType}`;
      if (index < htmlColumns.length - 1) {
        sqlTableStructure += ", ";
        sqlColumns += ", ";
      }
    });
    sqlStatements.push(
      `REPLACE INTO table_columns VALUES ${sqlTableStructure};`,
      `DROP TABLE IF EXISTS '${tableId}';`,
      `CREATE TABLE IF NOT EXISTS '${tableId}' ` +
        `(id TEXT NOT NULL, ${sqlColumns}, PRIMARY KEY (id) );`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static updateValues(
    run = false,
    sqlStatements = [],
    tableId,
    htmlColumns,
    htmlRows
  ) {
    let sqlValues = "";
    htmlRows.each(function (rowIndex, htmlRow) {
      htmlRow = $(htmlRow);
      sqlValues += `('${htmlRow.data("uuid")}', `;
      htmlColumns.each(function (columnIndex, htmlColumn) {
        htmlColumn = $(htmlColumn);

        let input = htmlRow.find("td").eq(columnIndex).find("input");
        switch (htmlColumn.data("type")) {
          case "checkbox":
            sqlValues += `'${input.is(":checked")}'`;
            break;
          case "text":
            sqlValues += `'${input.val()}'`;
            break;
        }
        if (columnIndex < htmlColumns.length - 1) {
          sqlValues += ", ";
        }
      });
      sqlValues += ")";
      if (rowIndex < htmlRows.length - 1) {
        sqlValues += ", ";
      }
    });
    sqlStatements.push(`REPLACE INTO '${tableId}' VALUES ${sqlValues};`);

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static delete(run = false, sqlStatements = [], tableIds) {
    let ids = "";
    $(tableIds).each(function (index, tableId) {
      ids += `'${tableId}'`;
      if (index < tableIds.length - 1) {
        ids += ", ";
      }
      sqlStatements.push(`DROP TABLE IF EXISTS '${tableId}';`);
    });
    ids += "";
    sqlStatements.push(
      `DELETE FROM tables WHERE id IN (${ids});`,
      `DELETE FROM table_columns WHERE table_id IN (${ids});`,
      `DELETE FROM page_elements WHERE id IN (${ids});`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }
}

module.exports = Table_DB;
