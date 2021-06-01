const Navigation = require("../controller/navigation");

class Page {
  static blockElements = [];

  static init() {
    let startpage;
    let pageId = Settings.DATA.STARTPAGE;

    for (let i = 0; i < 2; i++) {
      switch (i) {
        case 0:
          if (pageId && pageId.length > 0) {
            let page = Page_DB.getById(pageId);
            if (page && page.id) startpage = page.id;
          }
          break;
        case 1:
          let page = Page_DB.getFirst();
          if (page && page.id) startpage = page.id;
          break;
        case 2:
          startpage = "newPage";
          break;
      }
      if (startpage) break;
    }
    Navigation.next(startpage);

    document.querySelector("#pageName").addEventListener("keydown", (event) => Eventhandler.onKeydownPageName(event));
    document.querySelector("#pageName").addEventListener("keyup", (event) => Eventhandler.onKeyupPageName(event));
    Placeholder.init();
  }

  static addToDatabase(page) {
    if (!page.id || page.id.length == 0) {
      page.id = Crypto.generateUUID();
    }

    if (!page.name || page.name.length == 0) {
      page.name = "Untitled";
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
        Page.openUserPage();
        break;
      case "settingsPage":
        Page.openSettingsPage();
        break;
      default:
        Page.openUserPage(page.id);
        break;
    }
  }

  static clear() {
    this.blockElements = [];
    document.querySelector("#content").innerHTML = "";
    document.querySelector("#pageName").value = "";
    document.querySelector("#content").dataset.uuid = "";
  }

  static openNewPage() {
    let page = { id: "", name: "" };
    Page.addToDatabase(page);
    Navbar.add(page);
    Navigation.next(page.id);
  }

  static openSettingsPage() {
    let page = File.readFile(Filepath.join(__dirname, "../view/settings.html"));
    General.toggle(document.querySelector("#placeholder"), false);
    document.querySelector("#content").innerHTML = page;
    document.querySelector("#pageName").value = "Settings";
    Settings.registerEvents();
  }

  static openUserPage(pageId) {
    if (!pageId) {
      Page.openNewPage();
      return;
    }

    let page = Page_DB.getById(pageId);
    let pageElements = Page_DB.getElements(pageId);

    if (!pageElements || pageElements.length == 0) {
      let blockElement = new Textline();
      this.addToContent(blockElement);
    } else {
      let blockElements = Table.createByPageId(pageId);
      blockElements.push(...Textline.createByPageId(pageId));

      blockElements.forEach((blockElement) => {
        this.addToContent(blockElement);
      });
    }

    General.toggle(document.querySelector("#placeholder"), true);
    document.querySelector("#content").dataset.uuid = page.id;
    document.querySelector("#pageName").value = page.name;
  }

  static addToContent(element) {
    document.querySelector("#content").append(element.container);
    this.blockElements.push(element);
  }

  static saveCurrentContent() {
    let pageId = document.querySelector("#content").dataset.uuid;
    if (!pageId || pageId.length == 0) return;

    Page.savePageName(pageId);
    Page.savePageContent(pageId);
  }

  static savePageName(pageId) {
    let pageName = document.querySelector("#pageName").value;
    Page.addToDatabase({ id: pageId, name: pageName });
  }

  static savePageContent(pageId) {
    let pageElements = General.findAll(document, ".pageElement");
    if (pageElements.length == 0) return;

    let sql = "";
    pageElements.forEach((pageElement, index) => {
      let blockElement = Page.getBlockElement(pageElement.dataset.uuid);
      if (!blockElement) return;
      blockElement.save();

      let element = { id: blockElement.container.dataset.uuid, typeId: blockElement.elementData.type };
      sql = Page_DB.prepareUpdateElement(sql, pageElements.length, index, pageId, element);
    });
    Page_DB.updateElement([sql]);
  }

  static delete(id) {
    Page_DB.delete(id);
    document.querySelector("#content").dataset.uuid = "";
    document.querySelector("#settingsPage").dispatchEvent(new Event("click"));
  }

  static addElement(elementType) {
    switch (elementType) {
      case "table":
        let tableElement = new Table();
        Textline.appendBefore(tableElement.container);
        Page.blockElements.push(tableElement);
        break;
    }
  }

  static removeElement(element) {
    let blockElement = Page.getBlockElement(element.container.dataset.uuid);
    let index = Page.blockElements.indexOf(blockElement);
    if (index > -1) {
      Page.blockElements.splice(index, 1);
    }
  }

  static setDisable(disable) {
    General.toggle(document.querySelector("#disabledPageContainer"), disable);
  }

  static isDisabled() {
    if (document.querySelector("#disabledPageContainer").style.display == "none") {
      return false;
    } else {
      return true;
    }
  }

  static getBlockElement(id) {
    return Page.blockElements.filter((blockElement) => {
      return blockElement.container.dataset.uuid == id;
    })?.[0];
  }
}

class Eventhandler {
  static onKeydownPageName(event) {
    switch (event.key) {
      case "Enter":
        let textline = Textline.create();
        document.querySelector("#content").prepend(textline);
        General.focus(textline);
        break;
    }
  }

  static onKeyupPageName(event) {
    let pageId = document.querySelector("#content").dataset.uuid;
    let navbarItem = document.querySelector(`.navbarItem[data-uuid='${pageId}']`);
    let pagename = document.querySelector("#pageName").value;
    navbarItem.textContent = pagename;
  }
}

module.exports = Page;
