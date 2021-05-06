class NavbarMenu {
  static init() {
    NavbarMenu.registerEvents();
  }

  static registerEvents() {
    $("#navbarMenu table tbody tr").on("click", function (event) {
      Eventhandler.onClickMenuItem(event);
    });
  }

  static isOpen() {
    return $("#navbarMenu").is(":visible");
  }

  static close(element) {
    if (!NavbarMenu.isOpen() || NavbarMenu.clickedOnMenu(element)) return;
    $("#navbarMenu").toggle(false);
    $("#disabledPageContainer").toggle(false);
  }

  static open(element, position) {
    let btnNavbarMenu = element;
    if (btnNavbarMenu.attr("id") != "btnNavbarMenu") {
      btnNavbarMenu = element.find("#btnNavbarMenu");
    }

    if (!position) {
      position = {
        top: btnNavbarMenu.position().top + 24,
        left: btnNavbarMenu.position().left,
      };
    }

    NavbarMenu.close(btnNavbarMenu);
    Eventhandler.selectedPage = btnNavbarMenu.parent();
    $("#navbarMenu").css({
      top: `${position.top}px`,
      left: `${position.left}px`,
    });
    $("#navbarMenu").toggle(true);
    $("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (
      element &&
      (element.attr("id") == "btnNavbarMenu" ||
        element.children("#btnNavbarMenu").length > 0)
    ) {
      return true;
    } else {
      return false;
    }
  }
}

class Eventhandler {
  static selectedPage;

  static onClickMenuItem(event) {
    if (!Eventhandler.selectedPage) return;
    let action = $(event.target).parents("tr").attr("id");

    switch (action) {
      case Enums.PageActions["delete"]:
        Page.delete(Eventhandler.selectedPage.data("uuid"));
        Eventhandler.selectedPage.remove();
        break;
    }

    NavbarMenu.close();
  }
}

module.exports = NavbarMenu;
