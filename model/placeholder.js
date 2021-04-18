class Placeholder {
  static build(parent) {
    let div = document.createElement("div");
    div.className = "placeholder";
    Placeholder.addEventListeners(div);
    parent.append(div);
  }

  static addEventListeners(div) {
    $(div).on("click", function (event) {
      Eventhandler.onClick(event);
    });
  }
}

class Eventhandler {
  static onClick(event) {
    let textline = $(".textline:last");
    textline.trigger("focus");
  }
}

module.exports = Placeholder;
