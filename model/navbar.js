class Navbar {
  static init() {
    Navbar.registerEvent($("#settingsPage"));
    Navbar.registerEvent($("#newPage"));

    Navbar.build();
    Navbar.registerResizeEvents();
  }

  static build() {
    let pages = Database.all("SELECT * FROM pages;");
    $(pages).each(function () {
      Navbar.add(this);
    });
  }

  static registerEvent(navbarItem) {
    $(navbarItem).on("click", function (event) {
      Eventhandler.onClickNavbarItem(event);
    });

    $(navbarItem).on("contextmenu", function (event) {
      Eventhandler.onNavbarItemContextmenu(event);
    });
  }

  static registerResizeEvents() {
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
    $(img).on("click", function (event) {
      Eventhandler.onClickBtnNavbarMenu(event);
    });
    navbarItem.append(img);
    Navbar.registerEvent(navbarItem);

    $("#newPage").before(navbarItem);
  }

  static select(pageId) {
    if (pageId == "newPage") return;
    $(".navbarItem")
      .filter(function () {
        return $(this).data("uuid") == pageId;
      })
      .addClass("active");
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
    if (navbarItem.is("img")) return;
    $(".navbarItem.active").removeClass("active");
    Navigation.next(navbarItem.data("uuid"));
  }

  static onNavbarItemContextmenu(event) {
    NavbarMenu.open($(event.target), { top: event.pageY, left: event.pageX });
  }

  static onClickBtnNavbarMenu(event) {
    NavbarMenu.open($(event.target));
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

    const targetElement = $("#navbar");
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
