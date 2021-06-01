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
    General.toggle(document.querySelector("#navbarMenu"), false);
    General.toggle(document.querySelector("#disabledPageContainer"), false);
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
    document.querySelector("#navbarMenu").style.cssText = `top: ${position.top}px; left: ${position.left}px;`;
    General.toggle(document.querySelector("#navbarMenu"), true);
    General.toggle(document.querySelector("#disabledPageContainer"), true);
  }

  static clickedOnMenu(element) {
    if (element && (element.id == "btnNavbarMenu" || element.querySelector("#btnNavbarMenu"))) {
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
