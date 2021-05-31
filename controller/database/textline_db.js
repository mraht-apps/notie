class Textline_DB {
  static update(run = false, sqlStatements = [], textline) {
    sqlStatements.push(`REPLACE INTO textlines VALUES(` + `'${textline.id}', '${textline.textContent}');`);

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }

  static delete(run = false, sqlStatements = [], ids) {
    if (!ids || ids.length == 0) return;

    let sqlIds = "";
    document.querySelector(ids).each(function (index, id) {
      sqlIds += `'${id}'`;
      if (index < ids.length - 1) {
        sqlIds += ", ";
      }
    });

    sqlStatements.push(
      `DELETE FROM textlines WHERE id IN (${sqlIds});`,
      `DELETE FROM page_elements WHERE id IN (${sqlIds});`
    );

    if (run) {
      Database.run(sqlStatements);
    }
    return sqlStatements;
  }
}

module.exports = Textline_DB;
