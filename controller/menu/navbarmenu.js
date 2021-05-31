class NavbarMenu {
  static init() {
    NavbarMenu.registerEvents();
  }

  static registerEvents() {
    document
      .querySelector("#navbarMenu table tbody tr")
      .addEventListener("click", (event) => Eventhandler.onClickMenuItem(event));
  }

  static isOpen() {
    return document.querySelector("#navbarMenu").style.display != "none";
  }

  static close(element) {
    if (!NavbarMenu.isOpen() || NavbarMenu.clickedOnMenu(element)) return;
    document.querySelector("#navbarMenu").toggle(false);
    document.querySelector("#disabledPageContainer").toggle(false);
  }

  static open(element, position) {
    let btnNavbarMenu = element;
    if (btnNavbarMenu.id != "btnNavbarMenu") {
      btnNavbarMenu = element.querySelector("#btnNavbarMenu");
    }

    if (!position) {
      position = {
        top: btnNavbarMenu.position().top + 24,
        left: btnNavbarMenu.position().left,
      };
    }

    NavbarMenu.close(btnNavbarMenu);
    Eventhandler.selectedPage = btnNavbarMenu.parentElement;
    document.querySelector("#navbarMenu").css({
      top: `${position.top}px`,
      left: `${position.left}px`,
    });
    document.querySelector("#navbarMenu").toggle(true);
    document.querySelector("#disabledPageContainer").toggle(true);
  }

  static clickedOnMenu(element) {
    if (element && (element.id == "btnNavbarMenu" || element.children("#btnNavbarMenu").length > 0)) {
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
    let action = General.getParents(event.target, "tr").id;

    switch (action) {
      case Enums.PageActions["delete"]:
        Page.delete(Eventhandler.selectedPage.dataset.uuid);
        Eventhandler.selectedPage.remove();
        break;
    }

    NavbarMenu.close();
  }
}

module.exports = NavbarMenu;
