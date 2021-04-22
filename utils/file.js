const FS = require("fs");

class File {
  static create(filename, data) {
    return FS.writeFileSync(filename, data, "utf8", function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
  
  static exists(filename) {
    return FS.existsSync(filename);
  }
  
  static readFile(filename) {
    return FS.readFileSync(filename, "utf8", function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
  
  static readFolder(folder) {
    return FS.readdirSync(folder, function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
}

module.exports = File;
