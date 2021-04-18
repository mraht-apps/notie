const Database = require("better-sqlite3");

class DB {
  db;

  static init() {
    let filemanager = require("../utils/file.js");
    let exists = filemanager.exists("./user_data/notie.db");

    DB.initInstance();
    DB.initPages(exists);

    let result = DB.all(
      "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
    );
    console.log(result);
  }

static searchTables(tableName) {
  return DB.all(
    "SELECT name FROM sqlite_master WHERE type ='table' AND name LIKE '%" + tableName + "%';"
  );
}

  static all(sql) {
    return this.db.prepare(sql).all();
  }

  static initInstance() {
    this.db = new Database("./user_data/notie.db", { verbose: console.log });
    this.db.pragma("journal_mode = WAL");
    // NEW Encryption: this.db.pragma('key = "123"'); OR file-based encryption
  }

  static initPages(exists) {
    if (!exists) return;

    this.db
      .prepare(
        "CREATE TABLE IF NOT EXISTS tables (" +
          "id   integer PRIMARY KEY AUTOINCREMENT," +
          "name text NOT NULL );"
      )
      .run();

    console.log("Created db table 'tables'.");
  }

  static run(sql) {
    return this.db.run(sql, function (error) {
      if (error) console.error(error.message);
    });
  }

  static close() {
    this.db.close(function (error) {
      if (error) return console.error(error.message);
      console.log("Database connection closed.");
    });
    this.db = null;
  }
}

module.exports = DB;
