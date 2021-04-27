const Filesystem = require("fs");

class File {
  static writeFile(file, data) {
    return Filesystem.writeFileSync(file, data, "binary", function (error) {
      if (error) {
        console.log(error);
      }
    });
  }

  static exists(file) {
    return Filesystem.existsSync(file);
  }

  static readFile(file) {
    return Filesystem.readFileSync(file, "binary", function (error) {
      if (error) {
        console.log(error);
      }
    });
  }

  static readFolder(folder) {
    return Filesystem.readdirSync(folder, function (error) {
      if (error) {
        console.log(error);
      }
    });
  }

  static removeFile(file) {
    return Filesystem.unlinkSync(file, function (error) {
      if (error) {
        console.log(error);
      }
    });
  }
}

module.exports = File;
