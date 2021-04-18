function addPageToMenu(pagename) {
  const filemanager = require("../utils/file.js");

  var a = document.createElement("a");
  a.id = "page";
  a.href = "#";
  a.innerText = pagename;
  a.onclick = function (event) {
    let page = pagename + ".html";
    const render = filemanager.readFile("../user_data/pages/" + page);
    $(".content").html(render);
    return false;
  };
  $("#pagemenu-content").append(a);
}

module.exports = {
  addPageToMenu,
};
