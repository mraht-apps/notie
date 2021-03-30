const fs = require("fs");

function exists(filename) {
  return fs.existsSync(filename);
}

function readFile(filename) {
  return fs.readFileSync(filename, "utf8", function (error) {
    if (error) {
      console.log(error);
    }
  });
}

function writeFile(filename, data) {
  fs.writeFileSync(filename, data, "utf8", function (error) {
    if (error) {
      console.log(error);
    }
  });
}

module.exports = {
  exists,
  readFile,
  writeFile
};
