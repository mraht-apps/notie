const Page = require("../../model/page");
const Database = require("../database/database");

class Pagemenu {
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
    Pagemenu.registerEvent($("#settingsPage"));
    Pagemenu.registerEvent($("#newPage"));

    Pagemenu.build();
    Pagemenu.registerEvents();
  }

  static build() {
    let pages = Database.all("SELECT * FROM pages;");
    $(pages).each(function () {
      Pagemenu.add(this);
    });
  }

  static registerEvent(pageMenuItem) {
    $(pageMenuItem).on("click", function (event) {
      Eventhandler.onClickPageMenuItem(event);
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
    let pageMenuItem = document.createElement("div");
    pageMenuItem.className = "pageMenuItem";
    pageMenuItem.dataset.uuid = page.id;
    let img = document.createElement("img");
    img.src = "../res/img/page.svg";
    pageMenuItem.appendChild(img);
    let textNode = document.createTextNode(page.name);
    pageMenuItem.appendChild(textNode);
    Pagemenu.registerEvent(pageMenuItem);

    $("#newPage").before(pageMenuItem);
  }
}

class Eventhandler {
  static onClickPageMenuItem(event) {
    let pageMenuItem = $(event.target);
    Page.load({
      css_id: pageMenuItem.attr("id"),
      id: pageMenuItem.data("uuid"),
      url: pageMenuItem.data("url"),
    });
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

    const targetElement = $("#pageMenu");
    Pagemenu.resizeData.startWidth = targetElement.outerWidth();
    Pagemenu.resizeData.startCursorScreenX = event.screenX;
    Pagemenu.resizeData.resizeTarget = targetElement;
    Pagemenu.resizeData.parentElement = handleElement.parentElement;
    Pagemenu.resizeData.maxWidth =
      $(handleElement.parentElement).innerWidth() -
      Pagemenu.resizeData.handleWidth;
    Pagemenu.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (Pagemenu.resizeData.tracking) {
      const cursorScreenXDelta =
        event.screenX - Pagemenu.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        Pagemenu.resizeData.startWidth + cursorScreenXDelta,
        Pagemenu.resizeData.maxWidth
      );

      $(Pagemenu.resizeData.resizeTarget).outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (Pagemenu.resizeData.tracking) Pagemenu.resizeData.tracking = false;
  }
}

module.exports = Pagemenu;
