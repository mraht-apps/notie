class Page {
  static DEFAULT_NAME = "Untitled";
  static DEFAULT_TITLE = "Untitled";

  static create(pageId, pagename) {
    if (pagename.length == 0) {
      pagename = Page.DEFAULT_NAME;
    }

    let pageMenuItem = document.createElement("div");
    pageMenuItem.className = "pageMenuItem";
    if (pageId.length == 0) {
      pageId = CryptoJS.generateUUID();
    }
    pageMenuItem.data("uuid") = pageId;
    let img = document.createElement("img");
    img.src = "../res/img/page.svg";
    pageMenuItem.appendChild(img);
    let textNode = document.createTextNode(pagename);
    pageMenuItem.appendChild(textNode);

    Page.addPageToMenu(pageMenuItem);
  }

  static addPageToMenu(pageMenuItem) {
    $("#newPage").before(pageMenuItem);
  }

  static load(pageMenuItem) {
    let pageId = pageMenuItem.attr("id");
    switch (pageId) {
      case "newPage":
        pageId = CryptoJS.generateUUID();
        var page = FileJS.create(SettingsJS.DATA_FOLDER + id + ".html");
        $("#content").html(page);
        break;
      case "dashboardPage":
      case "settingsPage":
        let pageUrl = pageMenuItem.data("url");
        var page = FileJS.readFile(pageUrl);
        $("#content").html(page);
        break;
      default:
        var page = FileJS.readFile(SettingsJS.DATA_FOLDER + pageId + ".html");
        $("#content").html(page);
        break;
    }
    $("#pageTitle").attr("placeholder", Page.DEFAULT_TITLE);
  }
}

module.exports = { Page };
