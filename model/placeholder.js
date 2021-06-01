class Placeholder {
  static init() {
    document.querySelector("#placeholder").addEventListener("click", (event) => Eventhandler.onClick(event));
  }
}

class Eventhandler {
  static onClick(event) {
    let pageElements = document.querySelector("#content .pageElement").children;
    let lastElement = pageElements[pageElements.length - 1];
    if (!lastElement.classList.contains("textline")) {
      let textline = Textline.create();
      document.querySelector("#content").append(textline);
    }
    Textline.focusLast();
  }
}

module.exports = Placeholder;
