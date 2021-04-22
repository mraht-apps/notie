class Page {
  static addPageToMenu(pagename) {
    let pageMenuItem = document.createElement("div");
    pageMenuItem.className = "pageMenuItem";
    let img = document.createElement("img");
    img.src = "../res/img/page.svg";
    pageMenuItem.appendChild(img);
    let textNode = document.createTextNode(pagename);
    pageMenuItem.appendChild(textNode);
    $("#newPage").before(pageMenuItem);
  }

  static load(pageMenuItem) {
    let page = pageMenuItem.data("url");
    const render = FileJS.readFile(page);
    $("#content").html(render);
    return false;
  }
}

module.exports = { Page };
