window.onload = function () {
  setSystemInfo();
  addPagesToNavbar();
};

function setSystemInfo() {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }

  replaceText("page-title", "Hello World!");
}

function addPagesToNavbar() {
  const FileJS = require("./utils/file.js");
  let files = FileJS.readFolder("./user_data/pages/");

  const PageJS = require("./model/page.js");
  files.forEach(function (page) {
    console.log("Append page to menu: " + page);

    let sliceIndex = page.indexOf(".html");
    let pagename = page.slice(0, sliceIndex);
    PageJS.addPageToMenu(pagename);
  });
}
