function addPageToMenu(pagename) {
  const filemanager = global.include("/utils/filemanager.js");

  var a = document.createElement("a");
  a.id = "page";
  a.href = "#";
  a.innerText = pagename;
  a.onclick = function (event) {
    let page = pagename + ".html";
    const render = filemanager.readFile("./pages/" + page);
    $(".main").html(render);
    return false;
  };
  $("#navbarContent").append(a);
}

module.exports = {
  addPageToMenu,
};
