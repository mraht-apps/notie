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
}

class Eventhandler {
  static onClickPageMenuItem(event) {
    let pageMenuItem = $(event.target);
    PageJS.Page.load(pageMenuItem);
    if (pageMenuItem.text().trim() == "Settings") {
      SettingsJS.registerEvents();
    } else {
      TextlineJS.Textline.build($("#content"), "");
    }
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

module.exports = { Pagemenu, Eventhandler };
