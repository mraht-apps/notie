class Page_DB {
  static getById(id) {
    return Database.get(`SELECT * FROM pages WHERE id = '${id}';`);
  }

  static add(run = false, sqlStatements = [], page) {
    sqlStatements.push(
      `REPLACE INTO pages VALUES ('${page.id}', '${page.name}');`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static getElements(id) {
    return Database.all(
      `SELECT * FROM page_elements WHERE page_id = '${id}' ORDER BY position ASC;`
    );
  }

  static getTables(id) {
    return Database.all(
      `SELECT tbl.* FROM page_elements AS ps ` +
        `INNER JOIN tables AS tbl ON tbl.id = ps.id ` +
        `WHERE ps.page_id = '${id}';`
    );
  }

  static getTextlines(id) {
    return Database.all(
      `SELECT txt.* FROM page_elements AS ps ` +
        `INNER JOIN textlines AS txt ON txt.id = ps.id ` +
        `WHERE ps.page_id = '${id}';`
    );
  }

  static updateElement(sqlStatements) {
    Database.run(sqlStatements);
  }

  static buildUpdateElement(sql, elementLength, index, pageId, element) {
    if (sql == null || sql == "") {
      sql = "REPLACE INTO page_elements VALUES";
    }
    sql += `('${pageId}', '${element.id}', '${element.typeId}', '${index}')`;
    if (index < elementLength - 1) {
      sql += ", ";
    } else if (index == elementLength - 1) {
      sql += ";";
    }
    return sql;
  }

  static remove(id) {
    let sqlStatements = [`DELETE FROM pages WHERE id = '${id}';`];
    let pageElements = Page_DB.getElements(id);

    let tableIds = [];
    $(pageElements).each(function () {
      if (this.element_type != Enums.ElementTypes.table) return;
      tableIds.push(this.id);
    });
    Table_DB.remove(tableIds);

    Database.run();
  }
}

module.exports = Page_DB;
