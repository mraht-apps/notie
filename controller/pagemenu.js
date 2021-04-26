const Database = require("./db");

class PageMenu {
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
    PageMenu.build();
    PageMenu.registerEvents();
  }

  static build() {
    let pages = DatabaseJS.all("SELECT * FROM pages;");
    $(pages).each(function () {
      PageMenu.add(this);
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

    $(".pageMenuItem").on("click", function (event) {
      Eventhandler.onClickPageMenuItem(event);
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
    PageMenu.registerEvent(pageMenuItem);

    $("#newPage").before(pageMenuItem);
  }
}

class Eventhandler {
  static onClickPageMenuItem(event) {
    let pageMenuItem = $(event.target);
    PageJS.Page.load(pageMenuItem);
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
    PageMenu.resizeData.startWidth = targetElement.outerWidth();
    PageMenu.resizeData.startCursorScreenX = event.screenX;
    PageMenu.resizeData.resizeTarget = targetElement;
    PageMenu.resizeData.parentElement = handleElement.parentElement;
    PageMenu.resizeData.maxWidth =
      $(handleElement.parentElement).innerWidth() -
      PageMenu.resizeData.handleWidth;
    PageMenu.resizeData.tracking = true;
  }

  static onMousemove(event) {
    if (PageMenu.resizeData.tracking) {
      const cursorScreenXDelta =
        event.screenX - PageMenu.resizeData.startCursorScreenX;
      const newWidth = Math.min(
        PageMenu.resizeData.startWidth + cursorScreenXDelta,
        PageMenu.resizeData.maxWidth
      );

      $(PageMenu.resizeData.resizeTarget).outerWidth(newWidth);
    }
  }

  static onMouseup(event) {
    if (PageMenu.resizeData.tracking) PageMenu.resizeData.tracking = false;
  }
}

module.exports = { PageMenu, Eventhandler };
