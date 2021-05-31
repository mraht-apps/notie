class Navbar {
  static init() {
    Navbar.registerEvent(document.querySelector("#settingsPage"));
    Navbar.registerEvent(document.querySelector("#newPage"));

    Navbar.build();
    Navbar.registerResizeEvents();
  }

  static build() {
    let pages = Database.all("SELECT * FROM pages;");
    document.querySelector(pages).each(function () {
      Navbar.add(this);
    });
  }

  static registerEvent(navbarItem) {
    document.querySelector(navbarItem).addEventListener("click", (event) => Eventhandler.onClickNavbarItem(event));
    document.querySelector(navbarItem).addEventListener("contextmenu", (event) => Eventhandler.onNavbarItemContextmenu(event));
  }

  static registerResizeEvents() {
    document.querySelector(document.body).addEventListener("mousedown", "#resizeSeparator", null, (event) => Eventhandler.onMousedown(event));
    document.querySelector(window).addEventListener("mousemove", (event) => Eventhandler.onMousemove(event));
    document.querySelector(window).addEventListener("mouseup", (event) => Eventhandler.onMouseup(event));
  }

  static add(page) {
    let navbarItem = document.createElement("div");
    navbarItem.className = "navbarItem navbarUserItem";
    navbarItem.dataset.uuid = page.id;
    let img = document.createElement("img");
    img.src = "../res/img/page.svg";
    img.className = "navbarItemIcon";
    img.draggable = false;
    navbarItem.append(img);
    let textNode = document.createTextNode(page.name);
    navbarItem.append(textNode);
    img = document.createElement("img");
    img.src = "../res/img/menu.svg";
    img.id = "btnNavbarMenu";
    img.draggable = false;
    document.querySelector(img).addEventListener("click", (event) => Eventhandler.onClickBtnNavbarMenu(event));
    navbarItem.append(img);
    Navbar.registerEvent(navbarItem);

    document.querySelector("#newPage").before(navbarItem);
  }

  static select(pageId) {
    if (pageId == "newPage") return;
    document.querySelector(".navbarItem")
      .filter(function () {
        return document.querySelector(this).dataset.uuid") == pageId;
      })
      .classList.add("active");
  }
}

class Eventhandler {
  static resizeData = {
    tracking: false,
    startWidth: null,
    startCursorScreenX: null,
    handleWidth: 10,
    resizeTarget: null,
    parentElement: null,
    maxWidth: null,
  };

  static onClickNavbarItem(event) {
    let navbarItem = document.querySelector(event.target);
    if (navbarItem.is("img")) return;
    document.querySelector(".navbarItem.active").classList.remove("active");
    Navigation.next(navbarItem.dataset.uuid"));
  }

  static onNavbarItemContextmenu(event) {
    NavbarMenu.open(document.querySelector(event.target), { top: event.pageY, left: event.pageX });
  }

  static onClickBtnNavbarMenu(event) {
    NavbarMenu.open(document.querySelector(event.target));
  }

  static onMousedown(event) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const handleElement = event.currentTarget;
    if (!handleElement.parentElement) {
      console.error(new Error("Parent element not found."));
      return;
    }

    const targetElement = document.querySelector("#navbar");
    Eventhandler.resizeData.startWidth = targetElement.outerWidth();
    Eventhandler.resizeData.startCursorScreenX = event.screenX;
    Eventhandler.resizeData.resizeTarget = targetElement;
    Eventhandler.resizeData.parentElement = handleElement.parentElement;
    Eventhandler.resizeData.maxWidth =
      document.querySelector(handleElement.parentElement).innerWidth() - Eventhandler.resizeData.handleWidth;
    Eventhandler.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (Eventhandler.resizeData.tracking) {
      const cursorScreenXDelta = event.screenX - Eventhandler.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        Eventhandler.resizeData.startWidth + cursorScreenXDelta,
        Eventhandler.resizeData.maxWidth
      );

      document.querySelector(Eventhandler.resizeData.resizeTarget).outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (Eventhandler.resizeData.tracking) Eventhandler.resizeData.tracking = false;
  }
}

module.exports = Navbar;
