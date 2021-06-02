class Table_DB {
  static tablesBuffer = [];

  static get(id) {
    if (Table_DB.tablesBuffer.length == 0) {
      Table_DB.tablesBuffer = Database.all(`SELECT * FROM tables ORDER BY name COLLATE NOCASE ASC;`);
    }
    let result = Table_DB.tablesBuffer.filter((table) => {
      return table.id == id;
    });
    return result[0];
  }

  static getByName(name) {
    if (Table_DB.tablesBuffer.length == 0) {
      Table_DB.tablesBuffer = Database.all(`SELECT * FROM tables ORDER BY name COLLATE NOCASE ASC;`);
    }
    let result = Table_DB.tablesBuffer.filter((table) => {
      return table.name.toLowerCase().includes(name.toLowerCase());
    });
    return result;
  }

  static getByPageId(id) {
    return Database.all(
      `SELECT tbl.* FROM page_elements AS ps ` +
        `INNER JOIN tables AS tbl ON tbl.id = ps.id ` +
        `WHERE ps.page_id = '${id}';`
    );
  }

  static getColumns(tables) {
    if (!tables || tables.length == 0) return;

    let tableIds = tables.map((t) => `'${t.id}'`).join(", ");
    return Database.all(`SELECT * FROM table_columns WHERE table_id IN (${tableIds}) ORDER BY position ASC;`);
  }

  static getValues(id) {
    return Database.all(`SELECT * FROM '${id}';`);
  }

  static update(run = false, sqlStatements = [], table) {
    sqlStatements.push(`REPLACE INTO tables VALUES ('${table.id}', '${table.name}');`);

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static updateColumns(run = false, sqlStatements = [], tableId, htmlColumns) {
    let sqlTableStructure = "";
    let sqlColumns = "";

    htmlColumns.forEach((column, index) => {
      let columnId = column.dataset.uuid;
      let columnName = column.querySelector(".columnTitle > input").value;
      let columnType = column.dataset.type;
      let columnWidth = column.style.width;
      let relation = column.dataset.relation ? `'${column.dataset.relation}'` : null;
      let format = column.dataset.format ? column.dataset.format : null;

      let sqlColumnName, sqlColumnType;

      switch (columnType) {
        case Enums.ColumnTypes.ADD.id:
          return;
        default:
          sqlColumnName = columnId;
          sqlColumnType = "TEXT";
          break;
      }
      sqlTableStructure += `('${tableId}', '${columnId}', '${columnName}', '${columnType}', '${columnWidth}', ${index}, ${relation}, ${format})`;

      sqlColumns += `'${sqlColumnName}' ${sqlColumnType}`;
      if (index < htmlColumns.length - 1) {
        sqlTableStructure += ", ";
        sqlColumns += ", ";
      }
    });
    sqlStatements.push(
      `REPLACE INTO table_columns VALUES ${sqlTableStructure};`,
      `DROP TABLE IF EXISTS '${tableId}';`,
      `CREATE TABLE IF NOT EXISTS '${tableId}' ` + `(id TEXT NOT NULL, ${sqlColumns}, PRIMARY KEY (id) );`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static updateValues(run = false, sqlStatements = [], tableId, htmlColumns, htmlRows) {
    let sqlValues = "";
    htmlRows.forEach((htmlRow, rowIndex) => {
      sqlValues += `('${htmlRow.dataset.uuid}', `;
      htmlColumns.forEach((htmlColumn, columnIndex) => {
        let input = htmlRow.querySelectorAll("td")[columnIndex].children[0];
        switch (Number(htmlColumn.dataset.type)) {
          case Enums.ColumnTypes.CHK.id:
            sqlValues += `'${input.checked}'`;
            break;
          default:
            sqlValues += `'${input.innerHTML}'`;
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

  static delete(run = false, sqlStatements = [], ids) {
    if (!ids || ids.length == 0) return;

    let sqlIds = "";
    ids.forEach((id, index) => {
      sqlIds += `'${id}'`;
      if (index < ids.length - 1) {
        sqlIds += ", ";
      }
      sqlStatements.push(`DROP TABLE IF EXISTS '${id}';`);
    });

    sqlStatements.push(
      `DELETE FROM tables WHERE id IN (${sqlIds});`,
      `DELETE FROM table_columns WHERE table_id IN (${sqlIds});`,
      `DELETE FROM page_elements WHERE id IN (${sqlIds});`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static deleteColumn(run = false, sqlStatements = [], tableId, columnId) {
    sqlStatements.push(
      `ALTER TABLE '${tableId}' DROP COLUMN '${columnId}';`,
      `DELETE FROM table_columns WHERE id = '${columnId}';`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }
}

module.exports = Table_DB;
