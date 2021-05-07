const Filesystem = require("fs");

class File {
  static writeFile(file, data) {
    return Filesystem.writeFileSync(file, data, "binary", function (error) {
      if (error) throw error;
    });
  }

  static createDir(dir) {
    Filesystem.mkdirSync(dir);
  }

  static exists(path) {
    return Filesystem.existsSync(path);
  }

  static isDir(path) {
    try {
      let stat = Filesystem.lstatSync(path);
      return stat.isDirectory();
    } catch (e) {
      return false;
    }
  }

  static readFile(file) {
    return Filesystem.readFileSync(file, "binary", function (error) {
      if (error) throw error;
    });
  }

  static readDir(dir) {
    return Filesystem.readdirSync(Filepath.resolve(dir), function (error) {
      if (error) console.log(error);
    });
  }

  static removeFile(file) {
    return Filesystem.unlinkSync(file, function (error) {
      if (error) throw error;
    });
  }

  static removeDir(dir) {
    return Filesystem.rmSync(dir, { recursive: true, force: true }, function (error) {
      if (error) throw error;
    });
  }
}

module.exports = File;
