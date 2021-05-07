class Page_DB {
  static getById(id) {
    return Database.get(`SELECT * FROM pages WHERE id = '${id}';`);
  }

  static add(run = false, sqlStatements = [], page) {
    sqlStatements.push(
      `REPLACE INTO pages VALUES('${page.id}', '${page.name}');`
      // `REPLACE INTO pages VALUES('${page.id}', '${page.name}', '${page.parent}', '${page.parent_type}');`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static getElements(id) {
    return Database.all(`SELECT * FROM page_elements WHERE page_id = '${id}' ORDER BY position ASC;`);
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

  static delete(id) {
    let sqlStatements = [];
    let pageElements = Page_DB.getElements(id);

    let tableIds = [];
    let textlineIds = [];
    $(pageElements).each(function () {
      switch (this.type_id) {
        case Enums.ElementTypes.table:
          tableIds.push(this.id);
          break;
        case Enums.ElementTypes.textline:
          textlineIds.push(this.id);
          break;
      }
    });

    Table_DB.delete(false, sqlStatements, tableIds);
    Textline_DB.delete(false, sqlStatements, textlineIds);
    sqlStatements.push(`DELETE FROM pages WHERE id = '${id}';`);
    Database.run(sqlStatements);
  }
}

module.exports = Page_DB;
