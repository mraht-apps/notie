const SQLite3 = require("better-sqlite3");
const Table_DB = require("./table_db");

class Database {
  db;

  static init() {
    try {
      let exists = File.exists(Settings.ENC_DATABASE);
      if (exists) {
        let encryptedData = File.readFile(Settings.ENC_DATABASE);
        encryptedData = Crypto.extractIV(encryptedData);
        let bufferedData = Crypto.decrypt(encryptedData, Settings.CACHE.PASSWORD, Crypto.IV);
        let original = Buffer.from(bufferedData, "base64").toString();

        let dir = Filepath.parse(Settings.DEC_DATABASE).dir;
        if (!File.exists(dir)) {
          File.createDir(dir);
        }
        File.writeFile(Settings.DEC_DATABASE, original);
      }

      // Also creates a new database file if not existent
      Database.openConnection();
      Database.firstRun(exists);

      let result = Database.all("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%';");
      console.log(result);

      result = Database.all("SELECT * FROM element_types;");
      console.log(result);

      result = Database.all("SELECT * FROM parent_types;");
      console.log(result);

      result = Database.all("SELECT * FROM pages;");
      console.log(result);

      result = Database.all("SELECT * FROM page_elements;");
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  static openConnection() {
    Database.db = new SQLite3(Settings.DEC_DATABASE, {
      verbose: console.log,
    });
    Database.db.pragma("journal_mode = WAL");
  }

  static reset() {
    let sql = [
      "DROP TABLE IF EXISTS element_types;",
      "DROP TABLE IF EXISTS pages;",
      "DROP TABLE IF EXISTS page_elements;",
      "DROP TABLE IF EXISTS table_columns;",
      "DROP TABLE IF EXISTS tables;",
      "DROP TABLE IF EXISTS textlines;",
    ];
    Database.run(sql);
    return false;
  }

  static firstRun(exists) {
    if (exists) return;
    Database.initTables();
    Database.initElementTypes();
    Database.initParentTypes();
  }

  static initTables() {
    let sql = [
      "CREATE TABLE IF NOT EXISTS element_types (" +
        "id INTEGER NOT NULL," +
        "name TEXT NOT NULL," +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS parent_types (" +
        "id INTEGER NOT NULL," +
        "name TEXT NOT NULL," +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS pages (" +
        "id TEXT NOT NULL," +
        "name TEXT," +
        // "parent TEXT," +
        // "parent_type_id INTEGER REFERENCES parent_types(id)," +
        "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS page_elements (" +
        "page_id TEXT NOT NULL REFERENCES pages(id)," +
        "id TEXT NOT NULL," +
        "type_id INTEGER NOT NULL REFERENCES element_types(id)," +
        "position INTEGER NOT NULL," +
        "PRIMARY KEY (page_id, id, type_id) );",
      "CREATE TABLE IF NOT EXISTS 'tables' (" + "id TEXT NOT NULL, name TEXT, " + "PRIMARY KEY (id) );",
      "CREATE TABLE IF NOT EXISTS 'table_columns' (" +
        "table_id TEXT NOT NULL," +
        "id TEXT NOT NULL," +
        "name TEXT," +
        "type INTEGER NOT NULL, " +
        "width TEXT NOT NULL," +
        "position INTEGER NOT NULL," +
        "relation TEXT," +
        "PRIMARY KEY (table_id, id) );",
      "CREATE TABLE IF NOT EXISTS textlines (" + "id TEXT NOT NULL," + "text TEXT," + "PRIMARY KEY (id) );",
    ];
    Database.run(sql);
  }

  static initElementTypes() {
    let values = Object.keys(Enums.ElementTypes)
      .map(function (key) {
        let type = Enums.ElementTypes[key];
        return `('${type.id}', '${type.name}')`;
      })
      .join(", ");
    let sql = `REPLACE INTO element_types VALUES ${values};`;
    Database.run([sql]);
  }

  static initParentTypes() {
    let values = Object.keys(Enums.ParentTypes)
      .map(function (key) {
        return `('${key}', '${Enums.ParentTypes[key]}')`;
      })
      .join(", ");
    let sql = `REPLACE INTO parent_types VALUES ${values};`;
    Database.run([sql]);
  }

  static all(sql) {
    if (!Database.db) return;
    return Database.db.prepare(sql).all();
  }

  static get(sql) {
    if (!Database.db) return;
    return Database.db.prepare(sql).get();
  }

  static run(sqlArray) {
    if (!Database.db) return;
    sqlArray.forEach(function (sql) {
      if (sql.includes("REPLACE INTO tables") || sql.includes("DELETE FROM tables")) {
        Table_DB.tablesBuffer = [];
      }
      Database.db.prepare(sql).run();
    });
  }

  static close() {
    Database.closeConnection();
    Database.saveDatabase();
  }

  static closeConnection() {
    if (!Database.db) return;
    Database.db.close(function (error) {
      if (error) return console.error(error.message);
      console.log("Database connection closed.");
    });
    Database.db = null;
  }

  static saveDatabase() {
    try {
      let original = File.readFile(Settings.DEC_DATABASE);
      let bufferedData = Buffer.from(original).toString("base64");
      let encryptedData = Crypto.encrypt(bufferedData, Settings.CACHE.PASSWORD);
      encryptedData = Crypto.appendIV(encryptedData);
      File.writeFile(Settings.ENC_DATABASE, encryptedData);
    } catch (e) {}

    try {
      File.removeFile(Settings.DEC_DATABASE);
    } catch (e) {}
  }
}

module.exports = Database;
