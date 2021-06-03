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
      let textline = new Textline();
      document.querySelector("#content").append(textline.container);
    }
    Textline.focusLast();
  }
}

module.exports = Placeholder;
