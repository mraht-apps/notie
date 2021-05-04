const Page = require("../model/page");

class Navigation {
  static stack = [];

  static back() {
    Navigation.stack.pop();
    let pageId = Navigation.stack[Navigation.stack.length - 1];
    Page.load({ id: pageId  });
  }

  static next(pageId) {
    Navigation.stack.push(pageId);
    Page.load({ id: pageId });
  }
}

module.exports = Navigation;