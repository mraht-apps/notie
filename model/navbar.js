class Navbar {
  static init() {
    Navbar.registerEvent(document.querySelector("#settingsPage"));
    Navbar.registerEvent(document.querySelector("#newPage"));

    Navbar.build();
    Navbar.registerResizeEvents();
  }

  static build() {
    let pages = Database.all("SELECT * FROM pages;");
    pages.forEach((page) => {
      Navbar.add(page);
    });
  }

  static registerEvent(navbarItem) {
    navbarItem.onclick = (event) => Eventhandler.onClickNavbarItem(event);
    navbarItem.oncontextmenu = (event) => Eventhandler.onNavbarItemContextmenu(event);
  }

  static registerResizeEvents() {
    (document.body.onmousedown = "#resizeSeparator"), null, (event) => Eventhandler.onMousedown(event);
    window.onmousemove = (event) => Eventhandler.onMousemove(event);
    window.onmouseup = (event) => Eventhandler.onMouseup(event);
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
    img.onclick = (event) => Eventhandler.onClickBtnNavbarMenu(event);
    navbarItem.append(img);
    Navbar.registerEvent(navbarItem);

    document.querySelector("#newPage").before(navbarItem);
  }

  static select(pageId) {
    if (pageId == "newPage") return;
    console.log(pageId);
    document.querySelector(`.navbarItem[data-uuid='${pageId}']`)?.classList.add("active");
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
    let navbarItem = event.target;
    if (navbarItem == typeof "img") return;
    document.querySelector(".navbarItem.active").classList.remove("active");
    Navigation.next(navbarItem.dataset.uuid);
  }

  static onNavbarItemContextmenu(event) {
    NavbarMenu.open(event.target, { top: event.pageY, left: event.pageX });
  }

  static onClickBtnNavbarMenu(event) {
    NavbarMenu.open(event.target);
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
    Eventhandler.resizeData.startWidth = targetElement.offsetWidth;
    Eventhandler.resizeData.startCursorScreenX = event.screenX;
    Eventhandler.resizeData.resizeTarget = targetElement;
    Eventhandler.resizeData.parentElement = handleElement.parentElement;
    Eventhandler.resizeData.maxWidth = handleElement.parentElement.clientWidth - Eventhandler.resizeData.handleWidth;
    Eventhandler.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (Eventhandler.resizeData.tracking) {
      const cursorScreenXDelta = event.screenX - Eventhandler.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        Eventhandler.resizeData.startWidth + cursorScreenXDelta,
        Eventhandler.resizeData.maxWidth
      );
      Eventhandler.resizeData.resizeTarget.outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (Eventhandler.resizeData.tracking) Eventhandler.resizeData.tracking = false;
  }
}

module.exports = Navbar;
