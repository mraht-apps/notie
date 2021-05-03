const Page = require("../../model/page");
const Database = require("../database/database");

class Navbar {
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

    $(navBarItem).on("contextmenu", function (event) {
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
    let navbarItem = $(event.target);
    Page.load({
      css_id: navbarItem.attr("id"),
      id: navbarItem.data("uuid"),
      url: navbarItem.data("url"),
    });
  }

  static onNavbarItemContextmenu(event) {
    Pagemenu.open($(event.target));
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
    Eventhandler.resizeData.startWidth = targetElement.outerWidth();
    Eventhandler.resizeData.startCursorScreenX = event.screenX;
    Eventhandler.resizeData.resizeTarget = targetElement;
    Eventhandler.resizeData.parentElement = handleElement.parentElement;
    Eventhandler.resizeData.maxWidth =
      $(handleElement.parentElement).innerWidth() -
      Eventhandler.resizeData.handleWidth;
    Eventhandler.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (Eventhandler.resizeData.tracking) {
      const cursorScreenXDelta =
        event.screenX - Eventhandler.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        Eventhandler.resizeData.startWidth + cursorScreenXDelta,
        Eventhandler.resizeData.maxWidth
      );

      $(Eventhandler.resizeData.resizeTarget).outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (Eventhandler.resizeData.tracking)
      Eventhandler.resizeData.tracking = false;
  }
}

module.exports = Navbar;
