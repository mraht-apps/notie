class Page {
  static DEFAULT_NAME = "Untitled";

  static init() {
    let startpage = { id: "" };
    let pageId = Settings.DATA.STARTPAGE;
    if (pageId && pageId.length > 0) {
      startpage = Page_DB.getById(pageId);
      if (startpage) Navigation.next(startpage.id);
    }

    Placeholder.init();
  }

  static addToDatabase(page) {
    if (!page.id || page.id.length == 0) {
      page.id = Crypto.generateUUID();
    }

    if (!page.name || page.name.length == 0) {
      page.name = Page.DEFAULT_NAME;
    }

    if (!page.parent || page.parent.length == 0) {
      page.parent = "";
    }

    if (!page.parent_type || page.parent_type.length == 0) {
      page.parent_type = 0;
    }

    Page_DB.add(true, [], page);
  }

  static load(page) {
    Page.saveCurrentContent();
    Page.clear();

    if (!page) return;

    switch (page.id) {
      case "newPage":
        Page.openNewPage();
        break;
      case "settingsPage":
        Page.openSettingsPage(page);
        break;
      default:
        Page.openUserPage(page.id);
        break;
    }
  }

  static clear() {
    $("#content").html("");
    $("#pageName").val("");
    $("#content").data("uuid", null);
  }

  static openNewPage() {
    let page = { id: "", name: "" };
    Page.addToDatabase(page);
    Navbar.add(page);
    Navigation.next(page.id);
  }

  static openSettingsPage(page) {
    var page = File.readFile(Filepath.join(__dirname, "../view/settings.html"));
    $("#content").html(page);
    $("#pageName").val("Settings");
    Settings.registerEvents();
  }

  static openUserPage(pageId) {
    let page = Page_DB.getById(pageId);
    let elements = Page_DB.getElements(pageId);
    let htmlElement = null;

    if (!elements || elements.length == 0) {
      htmlElement = Textline.create(null);
      $("#content").append(htmlElement);
    } else {
      let htmlElements = Table.createByPageId(pageId);
      htmlElements.push(...Textline.createByPageId(pageId));

      $(elements).each(function (index, element) {
        let htmlElement = $(htmlElements).filter(function(){
          return $(this).data("uuid") == element.id;
        });
        if(!htmlElement) return;
        $("#content").append(htmlElement);
      });
    }

    $("#content").data("uuid", page.id);
    $("#pageName").val(page.name);
    $("#pageName").on("keyup", function (event) {
      Eventhandler.onKeyupPageName(event);
    });
  }

  static saveCurrentContent() {
    let pageId = $("#content").data("uuid");
    if (!pageId || pageId.length == 0) return;

    Page.savePageName(pageId);
    Page.savePageContent(pageId);
  }

  static savePageName(pageId) {
    let pageName = $("#pageName").val();
    Page.addToDatabase({ id: pageId, name: pageName });
  }

  static savePageContent(pageId) {
    let htmlChildren = $("#content").children();
    if (htmlChildren.length == 0) return;

    let sql = "";
    htmlChildren.each(function (index, htmlChild) {
      htmlChild = $(htmlChild);
      let elementTypeId;
      if (htmlChild.is(".table")) {
        elementTypeId = Enums.ElementTypes.table;
        Table.save(htmlChild);
      } else if (htmlChild.is(".textline")) {
        elementTypeId = Enums.ElementTypes.textline;
        Textline.save(htmlChild);
      }
      let element = { id: htmlChild.data("uuid"), typeId: elementTypeId };
      sql = Page_DB.buildUpdateElement(
        sql,
        htmlChildren.length,
        index,
        pageId,
        element
      );
    });
    Page_DB.updateElement([sql]);
  }

  static delete(id) {
    Page_DB.delete(id);
    $("#content").data("uuid", null);
    $("#settingsPage").trigger("click");
  }

  static addElement(elementType) {
    switch (elementType) {
      case "table":
        let tableElement = Table.create(null);
        Textline.appendBefore(tableElement);
        break;
    }
  }

  static setDisable(disable) {
    $("#disabledPageContainer").toggle(disable);
  }

  static isDisabled() {
    if ($("#disabledPageContainer").css("display") == "none") {
      return false;
    } else {
      return true;
    }
  }
}

class Eventhandler {
  static onKeyupPageName(event) {
    let pageId = $("#content").data("uuid");
    let navbarItem = $(".navbarItem").filter(function () {
      return $(this).data("uuid") == pageId;
    });

    let pagename = $("#pageName").val();
    let textNode = navbarItem.contents().filter(function () {
      return this.nodeType == Node.TEXT_NODE;
    });
    if (textNode && textNode.length > 0) {
      textNode.replaceWith(pagename);
    } else {
      let textNode = document.createTextNode(pagename);
      navbarItem.append(textNode);
    }
  }
}

module.exports = Page;
