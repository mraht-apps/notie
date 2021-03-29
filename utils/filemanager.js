const fs = require("fs");

function readFile(filename) {
  fs.readFile(filename, function (error) {
    if (error) {
      console.log(error);
    }
  });
}

function writeFile(filename, data) {
  fs.writeFile(filename, data, function (error) {
    if (error) {
      console.log(error);
    }
  });
}

module.exports = {
  readFile,
  writeFile,
};
