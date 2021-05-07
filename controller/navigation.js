class Navigation {
  static stack = [];

  static back() {
    Navigation.remove();
    let pageId = Navigation.stack[Navigation.stack.length - 1];
    Page.load({ id: pageId });
    Navbar.select(pageId);
  }

  static next(pageId) {
    Navigation.add(pageId);
    Page.load({ id: pageId });
    Navbar.select(pageId);
  }

  static add(pageId) {
    if (!pageId || pageId == "newPage") return;
    Navigation.stack.push(pageId);
  }

  static remove(pageId) {
    Navigation.stack.pop();
  }
}

module.exports = Navigation;
