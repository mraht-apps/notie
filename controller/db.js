const SQLite3 = require("better-sqlite3");

class Database {
  db;

  static init() {
    let FileJS = require("../utils/file.js");
    let exists = FileJS.exists("./user_data/notie.db");

    Database.initInstance();
    Database.initTables(exists);

    let result = Database.all(
      "SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';"
    );
    console.log(result);
  }

  static searchTables(tableName) {
    return Database.all(
      "SELECT name FROM sqlite_master WHERE type ='table' AND name LIKE '%" +
        tableName +
        "%';"
    );
  }

  static all(sql) {
    return Database.db.prepare(sql).all();
  }

  static initInstance() {
    Database.db = new SQLite3(SettingsJS.DATA_FOLDER + "notie.db", { verbose: console.log });
    Database.db.pragma("journal_mode = WAL");
  }

  static initTables(exists) {
    if (!exists) return;

    // Database.db.prepare("DROP TABLE IF EXISTS element_types;").run();
    // Database.db.prepare("DROP TABLE IF EXISTS pages;").run();
    // Database.db.prepare("DROP TABLE IF EXISTS pages_structure;").run();

    let sql = [
      "CREATE TABLE IF NOT EXISTS element_types (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "name TEXT);",
      "CREATE TABLE IF NOT EXISTS pages (" +
        "id TEXT PRIMARY KEY," +
        "name TEXT NOT NULL );",
      "CREATE TABLE IF NOT EXISTS pages_structure (" +
        "page_id TEXT," +
        "element_id TEXT," +
        "element_type_id INTEGER REFERENCES element_types(id)," +
        "position INTEGER NOT NULL," +
        "PRIMARY KEY (page_id, element_id, element_type_id) );",
      "INSERT INTO element_types(name) VALUES ('table'), ('textline');",
    ];
    Database.run(sql);

    // let result = DB.all("SELECT * FROM element_types;");
    // console.log(result);
  }

  static run(sqlArray) {
    for (let sql of sqlArray) {
      Database.db.prepare(sql).run();
    }
  }

  static close() {
    Database.db.close(function (error) {
      if (error) return console.error(error.message);
      console.log("Database connection closed.");
    });
    Database.db = null;
  }
}

module.exports = Database;
