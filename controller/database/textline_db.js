class Textline_DB {
  static update(run = false, sqlStatements = [], textline) {
    sqlStatements.push(
      `REPLACE INTO textlines VALUES(` +
        `'${textline.id}', '${textline.text}');`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static delete(run = false, sqlStatements = [], id) {
    sqlStatements.push(
      `DELETE FROM textlines WHERE id = '${id}';`,
      `DELETE FROM page_elements WHERE id = '${id}';`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }
}

module.exports = Textline_DB;
