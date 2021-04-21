function addPageToMenu(pagename) {
  const FileJS = require("../utils/file.js");

  var a = document.createElement("a");
  a.id = "page";
  a.href = "#";
  a.innerText = pagename;
  a.onclick = function (event) {
    let page = pagename + ".html";
    const render = FileJS.readFile("../user_data/pages/" + page);
    $(".content").html(render);
    return false;
  };
  $("#pagemenu-content").append(a);
}

module.exports = {
  addPageToMenu,
};
