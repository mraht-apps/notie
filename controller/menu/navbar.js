const Page = require("../../model/page");
const Database = require("../database/database");

class Navbar {
  static resizeData = {
    tracking: false,
    startWidth: null,
    startCursorScreenX: null,
    handleWidth: 10,
    resizeTarget: null,
    parentElement: null,
    maxWidth: null,
  };

  static init() {
    Navbar.registerEvent($("#settingsPage"));
    Navbar.registerEvent($("#newPage"));

    Navbar.build();
    Navbar.registerEvents();
  }

  static build() {
    let pages = Database.all("SELECT * FROM pages;");
    $(pages).each(function () {
      Navbar.add(this);
    });
  }

  static registerEvent(navBarItem) {
    $(navBarItem).on("click", function (event) {
      Eventhandler.onClickNavbarItem(event);
    });

    $(navBarItem).on("contextmenu", function(event) {
      Eventhandler.onNavbarItemContextmenu(event);
    });
  }

  static registerEvents() {
    $(document.body).on(
      "mousedown",
      "#resizeSeparator",
      null,
      function (event) {
        Eventhandler.onMousedown(event);
      }
    );

    $(window).on("mousemove", function (event) {
      Eventhandler.onMousemove(event);
    });

    $(window).on("mouseup", function (event) {
      Eventhandler.onMouseup(event);
    });
  }

  static add(page) {
    let navBarItem = document.createElement("div");
    navBarItem.className = "navBarItem";
    navBarItem.dataset.uuid = page.id;
    let img = document.createElement("img");
    img.src = "../res/img/page.svg";
    navBarItem.appendChild(img);
    let textNode = document.createTextNode(page.name);
    navBarItem.appendChild(textNode);
    Navbar.registerEvent(navBarItem);

    $("#newPage").before(navBarItem);
  }
}

class Eventhandler {
  static onClickNavbarItem(event) {
    let navbarItem = $(event.target);
    Page.load({
      css_id: navbarItem.attr("id"),
      id: navbarItem.data("uuid"),
      url: navbarItem.data("url"),
    });
  }

  static onNavbarItemContextmenu(event) {
    Pagemenu.open();
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

    const targetElement = $("#navBar");
    Navbar.resizeData.startWidth = targetElement.outerWidth();
    Navbar.resizeData.startCursorScreenX = event.screenX;
    Navbar.resizeData.resizeTarget = targetElement;
    Navbar.resizeData.parentElement = handleElement.parentElement;
    Navbar.resizeData.maxWidth =
      $(handleElement.parentElement).innerWidth() -
      Navbar.resizeData.handleWidth;
    Navbar.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (Navbar.resizeData.tracking) {
      const cursorScreenXDelta =
        event.screenX - Navbar.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        Navbar.resizeData.startWidth + cursorScreenXDelta,
        Navbar.resizeData.maxWidth
      );

      $(Navbar.resizeData.resizeTarget).outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (Navbar.resizeData.tracking) Navbar.resizeData.tracking = false;
  }
}

module.exports = Navbar;
