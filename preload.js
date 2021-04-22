window.onload = function () {
  addPagesToNavbar();
};

function addPagesToNavbar() {
  const FileJS = require("./utils/file.js");
  let files = FileJS.readFolder("./user_data/pages/");

  const PageJS = require("./model/page.js");
  files.forEach(function (page) {
    console.log("Append page to menu: " + page);

    let sliceIndex = page.indexOf(".html");
    let pagename = page.slice(0, sliceIndex);
    PageJS.Page.addPageToMenu(pagename);
  });
}
