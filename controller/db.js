const SQLite3 = require("better-sqlite3");

class Database {
  db;

  static init() {
    let FileJS = require("../utils/file.js");
    let exists = FileJS.exists("./user_data/notie.db");

    Database.initInstance();
    exists = Database.reset();
    Database.firstRun(exists);

    let result = Database.all(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';"
    );
    console.log(result);

    result = Database.all("SELECT * FROM element_types;");
    console.log(result);

    result = Database.all("SELECT * FROM pages;");
    console.log(result);

    result = Database.all("SELECT * FROM page_elements;");
    console.log(result);
  }

  static initInstance() {
    Database.db = new SQLite3(SettingsJS.DATA_FOLDER + "notie.db", {
      verbose: console.log,
    });
    Database.db.pragma("journal_mode = WAL");
  }

  static reset() {
    // Database.db.prepare("DROP TABLE IF EXISTS element_types;").run();
    Database.db.prepare("DROP TABLE IF EXISTS pages;").run();
    Database.db.prepare("DROP TABLE IF EXISTS page_elements;").run();
    Database.db.prepare("DROP TABLE IF EXISTS table_columns;").run();
    Database.db.prepare("DROP TABLE IF EXISTS textlines;").run();
    return false;
  }

  static firstRun(exists) {
    if (exists) return;
    Database.initTables();
    Database.initElementTypes();
  }

  static initTables() {
    let sql = [
      "CREATE TABLE IF NOT EXISTS element_types (" +
        "id INTEGER NOT NULL," +
        "name TEXT," +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS pages (" +
        "id TEXT NOT NULL," +
        "name TEXT," +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS page_elements (" +
        "page_id TEXT NOT NULL," +
        "id TEXT NOT NULL," +
        "type_id INTEGER NOT NULL REFERENCES element_types(id)," +
        "position INTEGER NOT NULL," +
        "PRIMARY KEY (page_id, id, type_id) );",
      "CREATE TABLE IF NOT EXISTS 'tables' (" +
        "id TEXT NOT NULL, name TEXT, " +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS 'table_columns' (" +
        "table_id TEXT NOT NULL," +
        "id TEXT NOT NULL," +
        "name TEXT," +
        "type INTEGER NOT NULL, " +
        "width TEXT NOT NULL," +
        "position INTEGER NOT NULL," +
        "PRIMARY KEY (table_id, id) );",
      "CREATE TABLE IF NOT EXISTS textlines (" +
        "id TEXT NOT NULL," +
        "text TEXT," +
        "PRIMARY KEY (id) );",
    ];
    Database.run(sql);
  }

  static initElementTypes() {
    let sql = "REPLACE INTO element_types VALUES ";
    let types = Object.keys(EnumsJS.ElementTypes);
    for (let i = 0; i < types.length; i++) {
      let type = types[i];
      sql += `('${EnumsJS.ElementTypes[type]}', '${type}')`;
      if (i < types.length - 1) {
        sql += ", ";
      }
    }
    sql += ";";
    Database.run([sql]);
  }

  static all(sql) {
    return Database.db.prepare(sql).all();
  }

  static get(sql) {
    return Database.db.prepare(sql).get();
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
