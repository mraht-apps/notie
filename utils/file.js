const Filesystem = require("fs");

class File {
  static writeFile(file, data) {
    return Filesystem.writeFileSync(file, data, "binary", function (error) {
      if (error) throw error;
    });
  }

  static exists(file) {
    return Filesystem.existsSync(file);
  }

  static readFile(file) {
    return Filesystem.readFileSync(file, "binary", function (error) {
      if (error) throw error;
    });
  }

  static readFolder(folder) {
    const path = require("path");
    return Filesystem.readdirSync(path.resolve(folder), function (error) {
      if (error) console.log(error);
    });
  }

  static removeFile(file) {
    return Filesystem.unlinkSync(file, function (error) {
      if (error) throw error;
    });
  }

  static removeFolder(folder) {
    return Filesystem.rmSync(
      folder,
      { recursive: true, force: true },
      function (error) {
        if (error) throw error;
      }
    );
  }
}

module.exports = File;
