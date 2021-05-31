class Placeholder {
  static init() {
    document.querySelector("#placeholder").addEventListener("click", (event) => Eventhandler.onClick(event));
  }
}

class Eventhandler {
  static onClick(event) {
    let lastElement = document.querySelector("#content").children.last(".pageElement");
    if (!lastElement.classList.contains("textline")) {
      let textline = Textline.create();
      document.querySelector("#content").append(textline);
    }
    Textline.focusLast();
  }
}

module.exports = Placeholder;
