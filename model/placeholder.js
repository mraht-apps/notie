class Placeholder {
  static build(parent) {
    // let div = document.createElement("div");
    // div.id = "placeholder";
    Placeholder.registerEvents($("#placeholder"));
    // parent.append(div);
  }

  static registerEvents(div) {
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

module.exports = { Placeholder };
